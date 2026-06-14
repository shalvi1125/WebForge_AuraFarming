/* index.ts — updated for TypeScript build errors (casts, error handling, helper functions) */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { HeritageSiteSchema, SiteStorySchema, SiteArtifactSchema } from "@/shared/types";
import z from "zod";
import { neon } from "@neondatabase/serverless";
import { Agent, run, tool } from "@openai/agents";
import type { Collection, MongoClient, ObjectId } from "mongodb";

/* ---------- Helper types & functions ---------- */

type UserRole = 'student' | 'warden' | 'admin';

interface MongoUserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

interface PublicAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  preferences: Record<string, unknown>;
}

const VALID_AUTH_ROLES: UserRole[] = ['student', 'warden', 'admin'];
const PASSWORD_HASH_ITERATIONS = 210000;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
let mongoClientPromise: Promise<MongoClient> | null = null;
let mongoDriverPromise: Promise<typeof import("mongodb")> | null = null;

function isUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && VALID_AUTH_ROLES.includes(role as UserRole);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  return atob(padded);
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PASSWORD_HASH_ITERATIONS },
    keyMaterial,
    256
  );
  return `pbkdf2:${PASSWORD_HASH_ITERATIONS}:${bytesToBase64(salt)}:${bytesToBase64(new Uint8Array(derivedBits))}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [, iterationsRaw, saltRaw, hashRaw] = storedHash.split(':');
  if (!storedHash.startsWith('pbkdf2:') || !iterationsRaw || !saltRaw || !hashRaw) return false;
  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations < 100000) return false;
  const encoder = new TextEncoder();
  const salt = base64ToBytes(saltRaw);
  const expected = base64ToBytes(hashRaw);
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    expected.byteLength * 8
  );
  const actual = new Uint8Array(derivedBits);
  if (actual.byteLength !== expected.byteLength) return false;
  let diff = 0;
  actual.forEach((byte, index) => { diff |= byte ^ expected[index]; });
  return diff === 0;
}

function getMongoUri(env: any): string {
  return String(env?.MONGODB_URI || env?.MONGO_URI || env?.mongodb_uri || '');
}

function getMongoDbName(uri: string, env: any): string {
  const configured = String(env?.MONGODB_DB || env?.MONGO_DB || env?.mongodb_db || '').trim();
  if (configured) return configured;
  try {
    const parsed = new URL(uri);
    const pathDb = parsed.pathname.replace(/^\//, '').trim();
    return pathDb || 'hosteliq';
  } catch {
    return 'hosteliq';
  }
}

async function getUsersCollection(env: any): Promise<Collection<MongoUserDocument>> {
  const uri = getMongoUri(env);
  if (!uri) throw new Error('MONGODB_URI is not configured');
  const { MongoClient } = await getMongoDriver();
  if (!mongoClientPromise) mongoClientPromise = new MongoClient(uri).connect();
  const client = await mongoClientPromise;
  const users = client.db(getMongoDbName(uri, env)).collection<MongoUserDocument>('users');
  await users.createIndex({ email: 1 }, { unique: true });
  return users;
}

function getMongoDriver(): Promise<typeof import("mongodb")> {
  if (!mongoDriverPromise) mongoDriverPromise = import("mongodb");
  return mongoDriverPromise;
}

function toPublicAuthUser(user: MongoUserDocument): PublicAuthUser {
  const [firstName = user.name, ...rest] = user.name.trim().split(/\s+/);
  const lastName = rest.join(' ') || 'User';
  return {
    id: user._id?.toString() || '',
    firstName,
    lastName,
    username: user.email.split('@')[0] || firstName.toLowerCase(),
    email: user.email,
    role: user.role,
    preferences: {},
  };
}

async function signSessionValue(value: string, env: any): Promise<string> {
  const encoder = new TextEncoder();
  const secret = String(env?.AUTH_SESSION_SECRET || env?.JWT_SECRET || getMongoUri(env));
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToBase64(new Uint8Array(signature)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function createSession(user: MongoUserDocument, env: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user._id?.toString(),
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    nonce: crypto.randomUUID(),
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await signSessionValue(body, env);
  return `${body}.${signature}`;
}

async function validateSession(sessionToken: string, env: any): Promise<any | null> {
  const [body, signature] = sessionToken.split('.');
  if (!body || !signature) return null;
  const expectedSignature = await signSessionValue(body, env);
  if (signature !== expectedSignature) return null;
  const payload = JSON.parse(base64UrlDecode(body)) as { sub?: string; exp?: number };
  if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  const users = await getUsersCollection(env);
  const { ObjectId } = await getMongoDriver();
  const user = await users.findOne({ _id: new ObjectId(payload.sub) });
  return user && isUserRole(user.role) ? user : null;
}

async function destroySession(sessionToken: string, env: any): Promise<void> {
  void sessionToken;
  void env;
}

/* ---------- Env interface ---------- */
interface Env {
  NEON_DATABASE_URL?: string;
  neon_database_url?: string;
  NEON_DB_URL?: string;
  MONGODB_URI?: string;
  MONGO_URI?: string;
  MONGODB_DB?: string;
  MONGO_DB?: string;
  AUTH_SESSION_SECRET?: string;
  JWT_SECRET?: string;
  DB: any;
  OPENAI_API_KEY?: string;
  SERPAPI_KEY?: string;
  GEMINI_API_KEY?: string;
  GOOGLE_MAPS_API_KEY?: string;
  [key: string]: unknown;
}

/* ---------- App ---------- */
const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());

/* ---------- Neon helper ---------- */
const getNeonSql = (env: any) => {
  const url = env?.NEON_DATABASE_URL || env?.neon_database_url || env?.NEON_DB_URL;
  return url ? neon(url as string) : null;
};

/* ---------- Utility: safeErrorMessage ---------- */
function safeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/* ---------- Routes ---------- */

/* Get all heritage sites */
app.get('/api/heritage-sites', async (c) => {
  try {
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }
    const rows = await sql`SELECT * FROM heritage_sites ORDER BY is_featured DESC, name ASC`;
    return c.json((rows as unknown[]) || []);
  } catch (error) {
    console.error('Error fetching heritage sites:', error);
    return c.json({ error: 'Failed to fetch heritage sites' }, 500);
  }
});

/* Heritage Vision Chat */
app.post('/api/chat/heritage-vision', async (c) => {
  try {
    const env = c.env as any;
    const apiKey = (env?.OPENAI_API_KEY as string) || '';
    if (!apiKey) return c.json({ error: 'Missing OPENAI_API_KEY' }, 500);

    const body = await c.req.json().catch(() => ({} as any));
    const imageDataUrl = typeof body?.imageDataUrl === 'string' ? body.imageDataUrl : '';
    const message = typeof body?.message === 'string' ? body.message : '';
    const sceneContext = typeof body?.sceneContext === 'string' ? body.sceneContext : '';
    const location = typeof body?.location === 'string' ? body.location : '';
    const position = body?.position && typeof body.position === 'object' ? body.position : null;
    const persona = (body?.persona === 'kids' || body?.persona === 'expert' || body?.persona === 'casual') ? body.persona : 'casual';
    const language = typeof body?.language === 'string' ? body.language : 'en';

    if (!imageDataUrl || !message) return c.json({ error: 'Missing imageDataUrl or message' }, 400);

    const m = /^data:(.*?);base64,(.*)$/.exec(imageDataUrl);
    if (!m) return c.json({ error: 'Invalid image data URL' }, 400);
    const mimeType = m[1] || 'image/jpeg';
    const dataB64 = m[2];

    const roleContext = persona === 'kids'
      ? 'You are a friendly heritage guide talking to children. Use simple words, be curious and engaging, like a fun teacher.'
      : persona === 'expert'
      ? 'You are a knowledgeable heritage scholar. Provide detailed architectural, historical, and cultural insights with precise terminology.'
      : 'You are a helpful heritage guide for general visitors. Be informative yet conversational.';
    const languageInstruction = language?.toLowerCase().startsWith('hi')
      ? 'Always respond in Hindi (हिंदी में जवाब दें).'
      : 'Always respond in English.';
    const locationContext = location ? `The user is currently at: ${location}. ` : '';
    const positionContext = position ? `User position in the 3D space: x=${position.x}, y=${position.y}, z=${position.z}. ` : '';
    const sceneInfo = sceneContext ? `Current scene description: "${sceneContext}". ` : '';

    const systemInstruction = `${roleContext} ${languageInstruction}

You are helping visitors explore Indian heritage sites in an immersive VR experience.
Be concise, accurate, and connect observations to Indian history, architecture, and culture.
If specific features are asked, explain their historical/cultural importance.`;

    const messages = [
      { role: 'system', content: systemInstruction },
      {
        role: 'user',
        content: [
          { type: 'text', text: `User question: ${message}` },
          ...(sceneContext ? [{ type: 'text', text: `Scene context: ${sceneContext}` }] : []),
          ...(location ? [{ type: 'text', text: `Location: ${location}` }] : []),
          ...(position ? [{ type: 'text', text: `Position: x=${position.x}, y=${position.y}, z=${position.z}` }] : []),
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${dataB64}` } },
        ]
      }
    ];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: env?.OPENAI_VISION_MODEL || 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      return c.json({ error: 'Heritage vision chat failed', details: t }, 500);
    }

    const json: any = await resp.json().catch(() => null);
    if (!json) return c.json({ error: 'Empty response' }, 500);

    const content = json?.choices?.[0]?.message?.content;
    const responseText = typeof content === 'string'
      ? content.trim()
      : Array.isArray(content)
        ? content.map((p: any) => (p?.text || '')).join('\n').trim()
        : '';
    if (!responseText) return c.json({ error: 'No text in response' }, 500);

    return c.json({
      response: responseText,
      context: {
        location,
        position,
        sceneContext,
        persona,
        language
      }
    });
  } catch (error: unknown) {
    console.error('Heritage vision chat error:', error);
    return c.json({ error: 'Failed to process heritage vision chat', details: safeErrorMessage(error) }, 500);
  }
});

/* Vision describe */
app.post('/api/vision/describe', async (c) => {
  try {
    const env = c.env as any;
    const apiKey = (env?.OPENAI_API_KEY as string) || '';
    if (!apiKey) return c.json({ error: 'Missing OPENAI_API_KEY' }, 500);

    const body = await c.req.json().catch(() => ({} as any));
    const imageDataUrl = typeof body?.imageDataUrl === 'string' ? body.imageDataUrl : '';
    const persona = (body?.persona === 'kids' || body?.persona === 'expert' || body?.persona === 'casual') ? body.persona : 'casual';
    const language = typeof body?.language === 'string' ? body.language : 'en';
    const hint = typeof body?.hint === 'string' ? body.hint.trim() : '';
    if (!imageDataUrl) return c.json({ error: 'Missing imageDataUrl' }, 400);

    const m = /^data:(.*?);base64,(.*)$/.exec(imageDataUrl);
    if (!m) return c.json({ error: 'Invalid image data URL' }, 400);
    const mimeType = m[1] || 'image/jpeg';
    const dataB64 = m[2];

    const tone = persona === 'kids'
      ? 'Explain simply for children in 2-3 short sentences, curious and friendly.'
      : persona === 'expert'
      ? 'Provide architectural and historical specifics in 3-5 sentences, concise and precise.'
      : 'Friendly explanation in 2-3 sentences.';
    const langLine = language?.toLowerCase().startsWith('hi') ? 'Reply fully in Hindi.' : 'Reply fully in English.';
    const question = hint ? `\nUser question: ${hint}` : '';
    const systemInstruction2 = `You are an on-site heritage docent. ${tone} ${langLine}`;
    const userContent = [
      ...(hint ? [{ type: 'text', text: `User question: ${hint}` }] : []),
      { type: 'image_url', image_url: { url: `data:${mimeType};base64,${dataB64}` } },
    ];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: env?.OPENAI_VISION_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction2 },
          { role: 'user', content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 400,
      })
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      return c.json({ error: 'Vision call failed', details: t }, 500);
    }
    const json: any = await resp.json().catch(() => null);
    if (!json) return c.json({ error: 'Empty response' }, 500);
    const content2 = json?.choices?.[0]?.message?.content;
    const text = typeof content2 === 'string' ? content2.trim() : '';
    if (!text) return c.json({ error: 'No text in response' }, 500);
    return c.json({ text });
  } catch (error: unknown) {
    console.error('Vision describe error:', error);
    return c.json({ error: 'Failed to describe image', details: safeErrorMessage(error) }, 500);
  }
});

/* Time-travel image generation */
app.post('/api/time-travel/generate', async (c) => {
  try {
    const env = c.env as any;
    const apiKey = (env?.GEMINI_API_KEY as string) || '';
    if (!apiKey) return c.json({ error: 'Missing GEMINI_API_KEY' }, 500);
    const body = await c.req.json().catch(() => ({} as any));
    const promptIn = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    if (!promptIn) return c.json({ error: 'Missing prompt' }, 400);

    const guidance = `Create a historically plausible image for the following request. Use the requested time period for architectural style, materials, clothing, and environment. Avoid modern artifacts. Render photorealistic but faithful to the era. Request: ${promptIn}`;

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: guidance }],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      return c.json({ error: 'Generation failed', details: t }, 500);
    }
    const json: any = await resp.json().catch(() => null);
    if (!json) return c.json({ error: 'Empty response from image model' }, 500);

    const findInlineData = (obj: any): { mimeType?: string; data?: string } | null => {
      if (!obj || typeof obj !== 'object') return null;
      if (obj.inlineData && obj.inlineData.data) return obj.inlineData;
      if (Array.isArray(obj)) {
        for (const it of obj) {
          const f = findInlineData(it);
          if (f) return f;
        }
      } else {
        for (const k of Object.keys(obj)) {
          const f = findInlineData(obj[k]);
          if (f) return f;
        }
      }
      return null;
    };

    const inline = findInlineData(json);
    const b64 = inline?.data || null;
    const mime = inline?.mimeType || 'image/png';
    if (!b64) return c.json({ error: 'No image in response' }, 500);

    const imageDataUrl = `data:${mime};base64,${b64}`;
    return c.json({ imageDataUrl });
  } catch (error: unknown) {
    console.error('Time Travel generation error:', error);
    return c.json({ error: 'Failed to generate image', details: safeErrorMessage(error) }, 500);
  }
});

/* Get site exploration */
app.get('/api/heritage-sites/:id/exploration', async (c) => {
  const siteId = parseInt(c.req.param('id'));

  if (isNaN(siteId)) {
    return c.json({ error: 'Invalid site ID' }, 400);
  }

  try {
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    const siteRows = await sql`SELECT * FROM heritage_sites WHERE id = ${siteId} LIMIT 1`;
    const site = (siteRows as any[])[0];
    if (!site) return c.json({ error: 'Heritage site not found' }, 404);

    const stories = (await sql`
      SELECT * FROM site_stories WHERE site_id = ${siteId} AND is_active = TRUE ORDER BY id ASC
    `) as any[];
    const artifacts = (await sql`
      SELECT * FROM site_artifacts WHERE site_id = ${siteId} ORDER BY id ASC
    `) as any[];

    return c.json({ site, stories, artifacts });
  } catch (error: unknown) {
    console.error('Error fetching site exploration:', error);
    return c.json({ error: 'Failed to fetch site exploration', details: safeErrorMessage(error) }, 500);
  }
});

/* Create heritage site */
app.post('/api/heritage-sites', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = HeritageSiteSchema.omit({
      id: true,
      created_at: true,
      updated_at: true
    }).parse(body);
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    const rows = await sql`
      INSERT INTO heritage_sites (
        name, description, historical_period, location,
        latitude, longitude, is_featured, model_url, background_url
      ) VALUES (
        ${validatedData.name},
        ${validatedData.description},
        ${validatedData.historical_period},
        ${validatedData.location},
        ${String(validatedData.latitude ?? '')},
        ${String(validatedData.longitude ?? '')},
        ${validatedData.is_featured ? 1 : 0},
        ${validatedData.model_url ?? ''},
        ${validatedData.background_url ?? ''}
      )
      RETURNING id;
    `;

    const id = rows?.[0]?.id;
    return c.json({ id, ...validatedData });
  } catch (error: unknown) {
    console.error('Error creating heritage site:', error);
    return c.json({ error: 'Failed to create heritage site', details: safeErrorMessage(error) }, 500);
  }
});

/* Add story to heritage site */
app.post('/api/heritage-sites/:id/stories', async (c) => {
  const siteId = parseInt(c.req.param('id'));

  if (isNaN(siteId)) {
    return c.json({ error: 'Invalid site ID' }, 400);
  }

  try {
    const body = await c.req.json();
    const validatedData = SiteStorySchema.omit({
      id: true,
      site_id: true,
      created_at: true,
      updated_at: true
    }).parse(body);
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    // safe parsing and casting
    const posX = parseFloat(String(validatedData.position_x ?? '0'));
    const posY = parseFloat(String(validatedData.position_y ?? '0'));
    const posZ = parseFloat(String(validatedData.position_z ?? '0'));
    const audioUrl = validatedData.audio_url ?? null;
    const isActive = validatedData.is_active ? 1 : 0;

    const rows = await sql<{ id: number }[]>`
      INSERT INTO site_stories (
        site_id, title, content, audio_url,
        position_x, position_y, position_z, is_active
      ) VALUES (
        ${Number(siteId)},
        ${validatedData.title},
        ${validatedData.content},
        ${audioUrl},
        ${posX},
        ${posY},
        ${posZ},
        ${isActive}
      ) RETURNING id
    `;

    const id = rows?.[0]?.id;
    return c.json({ id, site_id: siteId, ...validatedData });
  } catch (error: unknown) {
    console.error('Error adding story:', error);
    return c.json({ error: 'Failed to add story', details: safeErrorMessage(error) }, 500);
  }
});

/* Add artifact to heritage site */
app.post('/api/heritage-sites/:id/artifacts', async (c) => {
  const siteId = parseInt(c.req.param('id'));

  if (isNaN(siteId)) {
    return c.json({ error: 'Invalid site ID' }, 400);
  }

  try {
    const body = await c.req.json();
    const validatedData = SiteArtifactSchema.omit({
      id: true,
      site_id: true,
      created_at: true,
      updated_at: true
    }).parse(body);
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    const posX = Number(validatedData.position_x ?? 0);
    const posY = Number(validatedData.position_y ?? 0);
    const posZ = Number(validatedData.position_z ?? 0);
    const scale = Number(validatedData.scale_factor ?? 1);
    const interactive = validatedData.is_interactive ? 1 : 0;

    const rows = await sql<[{ id: number }]>`
      INSERT INTO site_artifacts (
        site_id, name, description, model_url,
        position_x, position_y, position_z, scale_factor, is_interactive
      ) VALUES (
        ${siteId}, ${validatedData.name}, ${validatedData.description}, ${validatedData.model_url ?? ''},
        ${posX}, ${posY}, ${posZ}, ${scale}, ${interactive}
      ) RETURNING id
    `;
    const id = rows?.[0]?.id;
    return c.json({ id, site_id: siteId, ...validatedData });
  } catch (error: unknown) {
    console.error('Error adding artifact:', error);
    return c.json({ error: 'Failed to add artifact', details: safeErrorMessage(error) }, 500);
  }
});

/* ---------- AGENT CHAT (streaming NDJSON response) ---------- */
app.post('/api/agent/chat', async (c): Promise<Response> => {
  const env = c.env as any;
  try {
    const body = await c.req.json().catch(() => ({}));
    const inputMessages = (Array.isArray(body?.messages) ? body.messages : []) as Array<{ role: string; content: string }>;

    const chatMessages = inputMessages
      .filter((m) => m && typeof m.role === 'string' && typeof m.content === 'string')
      .map((m) => ({ role: (m.role as 'user' | 'assistant' | 'system'), content: m.content }));

    const systemPrompt =
      "You are Raahi, a personalized AI travel companion. You know the user's preferences and travel interests. " +
      "IMPORTANT: Always provide a helpful, informative response FIRST, then ask only 1-2 targeted questions if needed. " +
      "User Preferences Context: [PREFERENCES_CONTEXT] " +
      "Response Guidelines: " +
      "1. Start with a direct, helpful answer to your query " +
      "2. Provide specific recommendations based on their preferences " +
      "3. Include practical details like costs, best times, transportation " +
      "4. Ask only 1-2 questions maximum, focused on clarifying their specific needs " +
      "5. Personalize suggestions based on their interest categories " +
      "Available Tools: Weather, hotels, maps, reviews, TripAdvisor, events " +
      "Use tools proactively to provide complete, actionable information.";

    /* ---------- Tools (tool function from @openai/agents) ---------- */

    const weatherTool = tool({
      name: 'weather_get',
      description: 'Get current weather and short forecast for a location',
      parameters: z.object({
        location: z.string().nullable().describe('City or place name'),
        latitude: z.number().nullable().describe('Latitude'),
        longitude: z.number().nullable().describe('Longitude'),
      }),
      async execute({ location, latitude, longitude }: { location: string | null; latitude: number | null; longitude: number | null }) {
        let lat = latitude as number | undefined;
        let lon = longitude as number | undefined;
        let resolvedName = location as string | undefined;
        if ((!lat || !lon) && location) {
          const geo: any = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
          ).then((r) => r.json()).catch(() => null);
          if (geo?.results?.[0]) {
            lat = geo.results[0].latitude;
            lon = geo.results[0].longitude;
            resolvedName = `${geo.results[0].name}${geo.results[0].country ? ', ' + geo.results[0].country : ''}`;
          }
        }
        if (lat == null || lon == null) {
          return { error: 'Location not found' };
        }
        const wx: any = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        ).then((r) => r.json()).catch(() => null);
        if (!wx) return { error: 'Weather fetch failed' };
        return {
          location: { name: resolvedName ?? 'coordinates', latitude: lat, longitude: lon },
          current: {
            temperatureC: wx.current?.temperature_2m ?? null,
            windKph: wx.current?.wind_speed_10m != null ? Math.round(wx.current.wind_speed_10m * 3.6) : null,
            weatherCode: wx.current?.weather_code ?? null,
          },
          forecast: Array.isArray(wx.daily?.time)
            ? wx.daily.time.slice(0, 3).map((t: string, i: number) => ({
                date: t,
                minC: wx.daily.temperature_2m_min?.[i] ?? null,
                maxC: wx.daily.temperature_2m_max?.[i] ?? null,
                precipProbability: wx.daily.precipitation_probability_max?.[i] ?? null,
              }))
            : [],
        };
      },
    });

    const routeTool = tool({
      name: 'maps_route',
      description: 'Get an estimated route between two points',
      parameters: z.object({
        origin: z.string().describe('Origin as "lat,lon" or place name'),
        destination: z.string().describe('Destination as "lat,lon" or place name'),
        travelMode: z.enum(['driving', 'walking', 'bicycling']).default('driving'),
      }),
      async execute({ origin, destination, travelMode }: { origin: string; destination: string; travelMode: 'driving' | 'walking' | 'bicycling' }) {
        const parse = (s: string) => {
          const m = /^\s*(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)\s*$/.exec(s);
          if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
          return null;
        };
        const a = parse(origin);
        const b = parse(destination);
        const R = 6371;
        const toRad = (d: number) => (d * Math.PI) / 180;
        const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
          return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
        };
        if (a && b) {
          const km = haversine(a.lat, a.lon, b.lat, b.lon);
          const speeds: Record<string, number> = { driving: 50, walking: 5, bicycling: 15 };
          const speed = speeds[travelMode] ?? 50;
          const minutes = Math.round((km / speed) * 60);
          return { origin, destination, travelMode, distanceKm: Math.round(km * 10) / 10, durationMinutes: minutes };
        }
        const apiKey = (env?.GOOGLE_MAPS_API_KEY as string) || '';
        if (apiKey) {
          const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
            origin
          )}&destination=${encodeURIComponent(destination)}&mode=${encodeURIComponent(travelMode)}&key=${apiKey}`;
          const data = await fetch(url).then((r) => r.json()).catch(() => null);
          const leg = (data as any)?.routes?.[0]?.legs?.[0];
          if (leg) {
            const distanceKm = leg.distance?.value ? Math.round((leg.distance.value / 1000) * 10) / 10 : null;
            const durationMinutes = leg.duration?.value ? Math.round(leg.duration.value / 60) : null;
            return { origin, destination, travelMode, distanceKm, durationMinutes };
          }
        }
        return { origin, destination, travelMode, error: 'Route not available' };
      },
    });

    const serpapiMapsTool = tool({
      name: 'serpapi_maps_search',
      description: 'Search Google Maps for places/businesses and get details (via SerpApi)',
      parameters: z.object({
        query: z.string().describe('e.g., Nalanda Museum or restaurants near Patna'),
        latitude: z.number().nullable().default(null),
        longitude: z.number().nullable().default(null),
        limit: z.number().int().min(1).max(20).default(5),
      }),
      async execute({ query, latitude, longitude, limit }: { query: string; latitude: number | null; longitude: number | null; limit: number }) {
        const apiKey = (env?.SERPAPI_KEY as string) || '';
        if (!apiKey) return { query, error: 'Missing SERPAPI_KEY' };
        const params = new URLSearchParams({ engine: 'google_maps', api_key: apiKey, q: query, hl: 'en', gl: 'in' });
        if (latitude != null && longitude != null) params.set('ll', `${latitude},${longitude}`);
        const url = `https://serpapi.com/search.json?${params.toString()}`;
        const json: any = await fetch(url).then((r) => r.json()).catch(() => null as any);
        const arr = Array.isArray(json?.local_results) ? json.local_results : Array.isArray(json?.places) ? json.places : [];
        const results = arr.slice(0, limit).map((p: any) => ({
          title: p.title || p.name || null,
          rating: p.rating ?? null,
          reviews: p.reviews ?? p.user_ratings_total ?? null,
          address: p.address || (Array.isArray(p.address_lines) ? p.address_lines.join(', ') : null),
          phone: p.phone || null,
          website: p.website || null,
          type: p.type || p.category || null,
          place_id: p.place_id || null,
          data_id: p.data_id || null,
          link: p.link || p.google_maps_url || null,
          latitude: p.gps_coordinates?.latitude ?? null,
          longitude: p.gps_coordinates?.longitude ?? null,
        }));
        return { query, latitude: latitude ?? null, longitude: longitude ?? null, results };
      },
    });

    const serpapiMapsReviewsTool = tool({
      name: 'serpapi_maps_reviews',
      description: 'Fetch Google Maps reviews for a place (via SerpApi). Provide data_id if available; otherwise provide query.',
      parameters: z.object({
        data_id: z.string().nullable().default(null),
        query: z.string().nullable().default(null),
        limit: z.number().int().min(1).max(100).default(10),
        hl: z.string().default('en'),
        gl: z.string().default('in'),
      }),
      async execute({ data_id, query, limit, hl, gl }: { data_id: string | null; query: string | null; limit: number; hl: string; gl: string }) {
        const apiKey = (env?.SERPAPI_KEY as string) || '';
        if (!apiKey) return { error: 'Missing SERPAPI_KEY' };
        let id = data_id || null;
        if (!id && query) {
          const sp = new URLSearchParams({ engine: 'google_maps', api_key: apiKey, q: query, hl, gl });
          const su = `https://serpapi.com/search.json?${sp.toString()}`;
          const sjson: any = await fetch(su).then((r) => r.json()).catch(() => null as any);
          const arr = Array.isArray(sjson?.local_results) ? sjson.local_results : [];
          id = arr?.[0]?.data_id || null;
        }
        if (!id) return { error: 'Missing data_id and failed to resolve from query' };
        const rp = new URLSearchParams({ engine: 'google_maps_reviews', api_key: apiKey, data_id: id, hl, gl });
        const ru = `https://serpapi.com/search.json?${rp.toString()}`;
        const rjson: any = await fetch(ru).then((r) => r.json()).catch(() => null as any);
        const revs = Array.isArray(rjson?.reviews)
          ? rjson.reviews.slice(0, limit).map((r: any) => ({
              rating: r.rating ?? null,
              date: r.date ?? r.date_utc ?? null,
              author: r.user?.name ?? r.author?.name ?? null,
              text: r.snippet ?? r.text ?? null,
              likes: r.likes ?? null,
            }))
          : [];
          return { data_id: id, count: revs.length, reviews: revs };
        },
      });

    const serpapiTripadvisorTool = tool({
      name: 'serpapi_tripadvisor_search',
      description: 'Search Tripadvisor for destinations, attractions, restaurants, or hotels (via SerpApi)',
      parameters: z.object({
        query: z.string().describe('Query like restaurants in Patna or Nalanda attractions'),
        type: z.enum(['all', 'restaurants', 'things_to_do', 'hotels', 'destinations', 'vacation_rentals']).default('all'),
        location: z.string().nullable().default(null),
        limit: z.number().int().min(1).max(20).default(5),
        hl: z.string().default('en'),
        gl: z.string().default('in'),
      }),
      async execute({ query, type, location, limit, hl, gl }: { query: string; type: 'all' | 'restaurants' | 'things_to_do' | 'hotels' | 'destinations' | 'vacation_rentals'; location: string | null; limit: number; hl: string; gl: string }) {
        const apiKey = (env?.SERPAPI_KEY as string) || '';
        if (!apiKey) return { error: 'Missing SERPAPI_KEY' };
        const params = new URLSearchParams({ engine: 'tripadvisor', api_key: apiKey, q: query, hl, gl });
        if (location) params.set('location', location);
        const url = `https://serpapi.com/search.json?${params.toString()}`;
        const json: any = await fetch(url).then((r) => r.json()).catch(() => null as any);
        const arr = Array.isArray(json?.organic_results) ? json.organic_results : [];
        const items = arr
          .filter((x: any) => {
            if (type === 'all') return true;
            const cat = String(x?.type || x?.category || '').toLowerCase();
            if (type === 'restaurants') return cat.includes('restaurant');
            if (type === 'things_to_do') return cat.includes('thing') || cat.includes('attraction') || cat.includes('tour');
            if (type === 'hotels') return cat.includes('hotel');
            if (type === 'destinations') return cat.includes('destination') || cat.includes('city');
            if (type === 'vacation_rentals') return cat.includes('rental') || cat.includes('apartment') || cat.includes('vacation');
            return true;
          })
          .slice(0, limit)
          .map((it: any) => ({
            title: it.title || it.name || null,
            rating: it.rating ?? null,
            reviews: it.reviews ?? it.user_ratings_total ?? null,
            category: it.type || it.category || null,
            address: it.address || null,
            price: it.price ?? null,
            link: it.link || it.url || null,
          }));
        return { query, type, location: location ?? null, results: items };
      },
    });

    const serpapiEventsTool = tool({
      name: 'serpapi_events_search',
      description: 'Search Google Events for upcoming events in a city or place (via SerpApi)',
      parameters: z.object({
        query: z.string().describe('e.g., Events in Patna or Nalanda events'),
        date_filter: z.enum(['today', 'tomorrow', 'this_weekend', 'next_week', 'this_month', 'next_month']).nullable().default(null),
        limit: z.number().int().min(1).max(20).default(5),
        hl: z.string().default('en'),
        gl: z.string().default('in'),
      }),
      async execute({ query, date_filter, limit, hl, gl }: { query: string; date_filter: string | null; limit: number; hl: string; gl: string }) {
        const apiKey = (env?.SERPAPI_KEY as string) || '';
        if (!apiKey) return { error: 'Missing SERPAPI_KEY' };
        const params = new URLSearchParams({ engine: 'google_events', api_key: apiKey, q: query, hl, gl });
        if (date_filter) params.set('htichips', `date:${date_filter}`);
        const url = `https://serpapi.com/search.json?${params.toString()}`;
        const json: any = await fetch(url).then((r) => r.json()).catch(() => null as any);
        const arr = Array.isArray(json?.events_results) ? json.events_results : [];
        const events = arr.slice(0, limit).map((e: any) => ({
          title: e.title || null,
          start: e.date?.start_date || e.date?.when || null,
          end: e.date?.end_date || null,
          address: e.address || e.venue?.name || null,
          tickets: e.tickets_link || e.link || null,
          description: e.description || null,
          source: e.source || null,
        }));
        return { query, date_filter: date_filter ?? null, results: events };
      },
    });

    const serpapiHotelsTool = tool({
      name: 'serpapi_hotels_search',
      description: 'Search Google Hotels for properties in a location and dates (via SerpApi)',
      parameters: z.object({
        location: z.string().describe('City or area, e.g., Patna'),
        check_in: z.string().nullable().default(null),
        check_out: z.string().nullable().default(null),
        adults: z.number().int().min(1).max(9).default(2),
        limit: z.number().int().min(1).max(20).default(5),
        hl: z.string().default('en'),
        gl: z.string().default('in'),
      }),
      async execute({ location, check_in, check_out, adults, limit, hl, gl }: { location: string; check_in: string | null; check_out: string | null; adults: number; limit: number; hl: string; gl: string }) {
        const apiKey = (env?.SERPAPI_KEY as string) || '';
        if (!apiKey) return { error: 'Missing SERPAPI_KEY' };
        const params = new URLSearchParams({ engine: 'google_hotels', api_key: apiKey, q: location, hl, gl, currency: 'INR' });
        if (check_in) params.set('check_in_date', check_in);
        if (check_out) params.set('check_out_date', check_out);
        if (adults) params.set('adults', String(adults));
        const url = `https://serpapi.com/search.json?${params.toString()}`;
        const json: any = await fetch(url).then((r) => r.json()).catch(() => null as any);
        const arr = Array.isArray(json?.properties) ? json.properties : [];
        const hotels = arr.slice(0, limit).map((h: any) => ({
          name: h.name || null,
          rating: h.rating ?? null,
          reviews: h.reviews ?? h.user_ratings_total ?? null,
          priceINR: typeof h?.price === 'number'
            ? h.price
            : typeof h?.price === 'string'
            ? (Number(String(h.price).replace(/[^0-9.]/g, '')) || null)
            : h?.rate?.price_raw ?? null,
          address: h.address || h.address_line || null,
          link: h.link || h.hotel_id_link || null,
          latitude: h.gps_coordinates?.latitude ?? null,
          longitude: h.gps_coordinates?.longitude ?? null,
        }));
        return { location, check_in: check_in ?? null, check_out: check_out ?? null, adults, currency: 'INR', hotels };
      },
    });

    const serpapiImagesTool = tool({
      name: 'serpapi_images_search',
      description: 'Search Google Images and return images suitable for embedding in chat (via SerpApi)',
      parameters: z.object({
        query: z.string(),
        count: z.number().int().min(1).max(12).default(6),
        license: z.enum(['any', 'cc']).default('any'),
        size: z.enum(['any', 'large', 'medium', 'icon']).default('any'),
      }),
      async execute({ query, count, license, size }: { query: string; count: number; license: 'any' | 'cc'; size: 'any' | 'large' | 'medium' | 'icon' }) {
        const apiKey = (env?.SERPAPI_KEY as string) || '';
        if (!apiKey) return { error: 'Missing SERPAPI_KEY' };
        const params = new URLSearchParams({ engine: 'google_images', api_key: apiKey, q: query, hl: 'en', gl: 'in' });
        const tbs: string[] = [];
        if (license === 'cc') tbs.push('sur:cl');
        if (size === 'large') tbs.push('isz:l');
        else if (size === 'medium') tbs.push('isz:m');
        else if (size === 'icon') tbs.push('isz:i');
        if (tbs.length) params.set('tbs', tbs.join(','));
        const url = `https://serpapi.com/search.json?${params.toString()}`;
        const json: any = await fetch(url).then((r) => r.json()).catch(() => null as any);
        const arr = Array.isArray(json?.images_results) ? json.images_results : [];
        const images = arr
          .slice(0, count)
          .map((im: any) => ({
            title: im.title || null,
            original: im.original || im.image || null,
            thumbnail: im.thumbnail || null,
            source: im.source || im.link || null,
            displayed_link: im.displayed_link || null,
            width: im?.original_width ?? im?.width ?? null,
            height: im?.original_height ?? im?.height ?? null,
          }))
          .filter((x: any) => !!x.original);
        return { query, count: images.length, images };
      },
    });

    /* Construct agent */
    const agent = new Agent({
      name: 'Heritage Trip Planner',
      instructions: systemPrompt,
      model: 'o4-mini',
      tools: [
        weatherTool,
        routeTool,
        serpapiMapsTool,
        serpapiMapsReviewsTool,
        serpapiTripadvisorTool,
        serpapiEventsTool,
        serpapiHotelsTool,
        serpapiImagesTool,
      ],
    });

    const userText = chatMessages.length
      ? chatMessages.map((m) => `${m.role}: ${m.content}`).join('\n')
      : 'Help plan a heritage trip.';

    const stream = new ReadableStream({
      start: async (controller) => {
        const enc = new TextEncoder();
        const send = (obj: any) => controller.enqueue(enc.encode(JSON.stringify(obj) + '\n'));
        const label = (toolName: string) => {
          switch (toolName) {
            case 'serpapi_images_search':
              return 'Searching images';
            case 'serpapi_hotels_search':
              return 'Searching hotels';
            case 'weather_get':
              return 'Fetching weather';
            case 'maps_route':
              return 'Calculating route';
            case 'serpapi_maps_search':
              return 'Searching places on Google Maps';
            case 'serpapi_maps_reviews':
              return 'Fetching Google reviews';
            case 'serpapi_tripadvisor_search':
              return 'Searching Tripadvisor';
            case 'serpapi_events_search':
              return 'Searching events';
            default:
              return `Running ${toolName}`;
          }
        };

        const onStart = (_ctx: any, tool: any) => {
          try {
            const name = (tool as any)?.name || 'tool';
            console.log('[tool_start]', name);
            send({ type: 'status', text: label(name) });
          } catch {}
        };
        const onEnd = (_ctx: any, tool: any) => {
          try {
            const name = (tool as any)?.name || 'tool';
            console.log('[tool_end]', name);
            send({ type: 'status', text: `${label(name)} — done` });
          } catch {}
        };

        agent.on('agent_tool_start', onStart);
        agent.on('agent_tool_end', onEnd);

        try {
          const result = await run(agent, userText);
          const rawText = typeof (result as any).finalOutput === 'string' ? (result as any).finalOutput : JSON.stringify((result as any).finalOutput);

          const checkboxLines = rawText.split('\n').filter((line: string) => line.includes('[ ]') || line.includes('[x]'));
          const checkboxes = checkboxLines.map((line: string, index: number) => ({
            id: `option_${index + 1}`,
            text: line.replace(/^\[.\]\s*/, '').trim(),
            selected: false
          }));

          send({ type: 'final', checkboxes, text: rawText });
        } catch (err) {
          send({ type: 'final', text: 'Sorry, something went wrong while generating the response.' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('Agent error:', error);
    return c.json({ error: 'Failed to run agent', details: safeErrorMessage(error) }, 500);
  }
});

/* Hotels search endpoint */
app.post('/api/hotels/search', async (c) => {
  try {
    const env = c.env as any;
    const body = await c.req.json().catch(() => ({}));
    const location = typeof body?.location === 'string' ? body.location.trim() : '';
    const checkIn = typeof body?.checkIn === 'string' ? body.checkIn.trim() : null;
    const checkOut = typeof body?.checkOut === 'string' ? body.checkOut.trim() : null;
    const adults = typeof body?.adults === 'number' ? Math.max(1, Math.min(body.adults, 9)) : 2;
    const limit = typeof body?.limit === 'number' ? Math.max(1, Math.min(body.limit, 20)) : 5;

    if (!location) {
      return c.json({ error: 'Location is required' }, 400);
    }

    const apiKey = (env?.SERPAPI_KEY as string) || '';
    if (!apiKey) return c.json({ error: 'Hotels search unavailable' }, 500);

    const params = new URLSearchParams({
      engine: 'google_hotels',
      api_key: apiKey,
      q: location,
      hl: 'en',
      gl: 'in',
      currency: 'INR'
    });

    if (checkIn) params.set('check_in_date', checkIn);
    if (checkOut) params.set('check_out_date', checkOut);
    if (adults) params.set('adults', String(adults));

    const url = `https://serpapi.com/search.json?${params.toString()}`;
    const json: any = await fetch(url).then((r) => r.json()).catch(() => null as any);

    const arr = Array.isArray(json?.properties) ? json.properties : [];
    const hotels = arr.slice(0, limit).map((h: any) => ({
      name: h.name || null,
      rating: h.rating ?? null,
      reviews: h.reviews ?? h.user_ratings_total ?? null,
      priceINR: typeof h?.price === 'number'
        ? h.price
        : typeof h?.price === 'string'
        ? (Number(String(h.price).replace(/[^0-9.]/g, '')) || null)
        : h?.rate?.price_raw ?? null,
      address: h.address || h.address_line || null,
      link: h.link || h.hotel_id_link || null,
      latitude: h.gps_coordinates?.latitude ?? null,
      longitude: h.gps_coordinates?.longitude ?? null,
    }));

    return c.json({
      location,
      checkIn: checkIn ?? null,
      checkOut: checkOut ?? null,
      adults,
      currency: 'INR',
      hotels
    });
  } catch (error: unknown) {
    console.error('Hotels search error:', error);
    return c.json({ error: 'Failed to search hotels', details: safeErrorMessage(error) }, 500);
  }
});

/* MongoDB-backed HostelIQ authentication endpoints */
app.post('/api/auth/signup', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({} as any));
    const firstName = typeof body?.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body?.lastName === 'string' ? body.lastName.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const role = body?.role;

    if (!email || !password || !isUserRole(role)) {
      return c.json({ error: 'Name, email, password, and valid role are required' }, 400);
    }

    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || email.split('@')[0] || 'HostelIQ User';
    const users = await getUsersCollection(c.env as any);
    const existingUser = await users.findOne({ email });
    if (existingUser) return c.json({ error: 'Email already registered' }, 409);

    const now = new Date();
    const insertResult = await users.insertOne({
      name,
      email,
      passwordHash: await hashPassword(password),
      role,
      createdAt: now,
    });
    const createdUser: MongoUserDocument = { _id: insertResult.insertedId, name, email, passwordHash: '', role, createdAt: now };

    return c.json({
      success: true,
      sessionToken: await createSession(createdUser, c.env as any),
      user: toPublicAuthUser(createdUser),
    });
  } catch (error: unknown) {
    if (safeErrorMessage(error).includes('E11000')) return c.json({ error: 'Email already registered' }, 409);
    console.error('Mongo signup error:', error);
    return c.json({ error: 'Failed to create account', details: safeErrorMessage(error) }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({} as any));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!email || !password) return c.json({ error: 'Email and password are required' }, 400);

    const users = await getUsersCollection(c.env as any);
    const user = await users.findOne({ email });
    if (!user || !isUserRole(user.role) || !(await verifyPassword(password, user.passwordHash))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    return c.json({
      success: true,
      sessionToken: await createSession(user, c.env as any),
      user: toPublicAuthUser(user),
    });
  } catch (error: unknown) {
    console.error('Mongo login error:', error);
    return c.json({ error: 'Login failed', details: safeErrorMessage(error) }, 500);
  }
});

app.post('/api/auth/logout', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { sessionToken } = body as { sessionToken?: string };
    if (sessionToken) await destroySession(sessionToken, c.env as any);
    return c.json({ success: true });
  } catch (error: unknown) {
    console.error('Mongo logout error:', error);
    return c.json({ error: 'Logout failed', details: safeErrorMessage(error) }, 500);
  }
});

app.post('/api/auth/validate-session', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({} as any));
    const sessionToken = typeof body?.sessionToken === 'string' ? body.sessionToken : '';
    if (!sessionToken) return c.json({ error: 'No session token provided' }, 401);

    const user = await validateSession(sessionToken, c.env as any);
    if (!user || !isUserRole(user.role)) return c.json({ error: 'Invalid or expired session' }, 401);

    return c.json({ success: true, user: toPublicAuthUser(user as MongoUserDocument) });
  } catch (error: unknown) {
    console.error('Mongo session validation error:', error);
    return c.json({ error: 'Session validation failed', details: safeErrorMessage(error) }, 500);
  }
});

/* Forgot password */
app.post('/api/auth/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    const userResult = await sql`
      SELECT id, first_name FROM users WHERE email = ${email}
    `;

    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    if (userResult.length > 0) {
      console.log(`Password reset requested for ${email}. Token: ${resetToken}`);
    }

    return c.json({
      message: 'If an account with that email exists, a reset link has been sent.',
      resetToken: resetToken
    });

  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Internal server error', details: safeErrorMessage(error) }, 500);
  }
});

/* Itinerary generation endpoint — NO travel options */
app.post('/api/itinerary/generate', async (c) => {
  try {
    const env = c.env as any;
    const apiKey = (env?.OPENAI_API_KEY as string) || '';
    if (!apiKey) return c.json({ error: 'OpenAI API key not configured' }, 500);

    const body = await c.req.json().catch(() => ({} as any));
    const { prompt, formData } = body;

    if (!prompt || !formData) {
      return c.json({ error: 'Prompt and formData are required' }, 400);
    }

    // Generate itinerary with OpenAI (no travel search)
    const enhancedPrompt = `${prompt}

Generate a detailed itinerary based on the user's preferences and destination. Focus on cultural experiences, historical sites, and local recommendations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner specializing in Indian destinations. Generate detailed, realistic travel itineraries with accurate costs, authentic experiences, and practical information.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('OpenAI API error:', errorText);
      return c.json({ error: 'Failed to generate itinerary from AI' }, 500);
    }

    const aiResponse: any = await response.json().catch(() => null);
    const rawContent = aiResponse?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return c.json({ error: 'No content received from AI' }, 500);
    }

    let itineraryJson;
    try {
      itineraryJson = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        itineraryJson = JSON.parse(jsonMatch[1]);
      } else {
        const startBrace = rawContent.indexOf('{');
        const lastBrace = rawContent.lastIndexOf('}');
        if (startBrace !== -1 && lastBrace !== -1 && lastBrace > startBrace) {
          const jsonString = rawContent.substring(startBrace, lastBrace + 1);
          itineraryJson = JSON.parse(jsonString);
        } else {
          return c.json({ error: 'Could not parse itinerary JSON from AI response' }, 500);
        }
      }
    }

    if (!itineraryJson.title || !itineraryJson.dailyItinerary) {
      return c.json({ error: 'Invalid itinerary structure received from AI' }, 500);
    }

    // Return itinerary without travel options
    return c.json({
      itinerary: itineraryJson,
      generatedAt: new Date().toISOString(),
      formData: formData,
      travelDataFetched: false
    });

  } catch (error: unknown) {
    console.error('Itinerary generation error:', error);
    return c.json({
      error: 'Failed to generate itinerary',
      details: safeErrorMessage(error)
    }, 500);
  }
});

/* ---------- PHOTO API ENDPOINTS ---------- */

/* Get user's photos by user ID */
app.get('/api/photos/user/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    const photos = await sql`
      SELECT id, url, caption, date, place_name, created_at
      FROM user_photos
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // Return array directly, not wrapped in object
    return c.json(photos || []);
  } catch (error: unknown) {
    console.error('Error fetching user photos:', error);
    return c.json({ error: 'Failed to fetch photos', details: safeErrorMessage(error) }, 500);
  }
});

/* Upload photo */
app.post('/api/photos/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const userIdStr = formData.get('user_id') as string;
    const placeName = formData.get('place_name') as string;
    const caption = formData.get('caption') as string;
    const file = formData.get('photo') as File;

    console.log('Upload attempt:', { userIdStr, placeName, caption, file: file?.name });

    if (!userIdStr || !file || !placeName) {
      return c.json({ 
        error: 'Missing required fields', 
        details: `user_id: ${!!userIdStr}, photo: ${!!file}, place_name: ${!!placeName}` 
      }, 400);
    }

    const userId = parseInt(userIdStr);
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    // Convert file to base64 for storage (fixed version to avoid call stack issues)
    const arrayBuffer = await file.arrayBuffer();
    
    // Use chunked processing to avoid call stack overflow
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const chunkSize = 1024;
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const dataUrl = `data:${file.type};base64,${btoa(binary)}`;

    console.log('Inserting photo for user:', userId, 'place:', placeName);

    const result = await sql`
      INSERT INTO user_photos (user_id, url, caption, place_name, date, created_at)
      VALUES (${userId}, ${dataUrl}, ${caption || ''}, ${placeName}, NOW(), NOW())
      RETURNING id
    `;

    const photoId = result?.[0]?.id;
    console.log('Photo inserted with ID:', photoId);

    return c.json({ 
      success: true, 
      photoId,
      message: 'Photo uploaded successfully',
      url: dataUrl,
      caption: caption || '',
      place_name: placeName
    });
  } catch (error: unknown) {
    console.error('Error uploading photo:', error);
    return c.json({ 
      error: 'Failed to upload photo', 
      details: safeErrorMessage(error) 
    }, 500);
  }
});


/* Delete photo */
app.delete('/api/photos/:photoId', async (c) => {
  try {
    const photoId = parseInt(c.req.param('photoId'));
    if (isNaN(photoId)) {
      return c.json({ error: 'Invalid photo ID' }, 400);
    }

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    await sql`
      DELETE FROM user_photos WHERE id = ${photoId}
    `;

    return c.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting photo:', error);
    return c.json({ error: 'Failed to delete photo', details: safeErrorMessage(error) }, 500);
  }
});

/* Update photo caption */
app.put('/api/photos/:photoId', async (c) => {
  try {
    const photoId = parseInt(c.req.param('photoId'));
    const body = await c.req.json();
    const caption = body.caption;

    if (isNaN(photoId)) {
      return c.json({ error: 'Invalid photo ID' }, 400);
    }

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    await sql`
      UPDATE user_photos 
      SET caption = ${caption}, updated_at = NOW()
      WHERE id = ${photoId}
    `;

    return c.json({ success: true, message: 'Photo updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating photo:', error);
    return c.json({ error: 'Failed to update photo', details: safeErrorMessage(error) }, 500);
  }
});
// ... existing code ...

/* ---------- COMMUNITY API ENDPOINTS ---------- */

/* Get community feed - posts from followed users + trending reviews */
app.get('/api/community/feed', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { userId, page = 1, limit = 20 } = body;

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    const offset = (page - 1) * limit;

    // Get posts from followed users and trending reviews
    const feed = await sql`
      SELECT 
        pr.*,
        u.first_name,
        u.last_name,
        u.username,
        CASE WHEN uf.follower_id IS NOT NULL THEN true ELSE false END as is_following
      FROM place_reviews pr
      JOIN users u ON pr.user_id = u.id
      LEFT JOIN user_follows uf ON uf.following_id = pr.user_id AND uf.follower_id = ${userId}
      WHERE pr.user_id = ${userId} -- User's own posts
         OR uf.follower_id = ${userId} -- Posts from followed users
         OR pr.id IN ( -- Trending posts (most liked/reviewed in last 7 days)
           SELECT id FROM place_reviews 
           WHERE created_at > NOW() - INTERVAL '7 days'
           ORDER BY (SELECT COUNT(*) FROM place_reviews pr2 WHERE pr2.place_name = place_reviews.place_name) DESC
           LIMIT 10
         )
      ORDER BY pr.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return c.json({ feed: feed || [] });
  } catch (error: unknown) {
    console.error('Feed error:', error);
    return c.json({ error: 'Failed to load feed', details: safeErrorMessage(error) }, 500);
  }
});

app.post('/api/community/reviews', async (c) => {
  try {
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    // Handle FormData instead of JSON
    const formData = await c.req.formData();
    const userId = parseInt(formData.get('userId') as string);
    const placeName = formData.get('placeName') as string;
    const reviewText = formData.get('reviewText') as string;
    const rating = parseInt(formData.get('rating') as string);
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;

    // Handle photo upload if present
    let photoUrl = null;
    const photoFile = formData.get('photo') as File;
    if (photoFile) {
      // Convert file to base64 for storage
      const arrayBuffer = await photoFile.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      photoUrl = `data:${photoFile.type};base64,${base64}`;
    }

    console.log('Posting review:', { userId, placeName, rating, hasPhoto: !!photoFile });

    const result = await sql`
      INSERT INTO place_reviews (user_id, place_name, review_text, rating, photo_url, latitude, longitude, created_at)
      VALUES (${userId}, ${placeName}, ${reviewText}, ${rating}, ${photoUrl}, ${latitude}, ${longitude}, NOW())
      RETURNING id, created_at
    `;

    console.log('Review inserted with ID:', result[0].id);

    // Check for reward milestone (every 10 reviews)
    const reviewCount = await sql`
      SELECT COUNT(*) as count FROM place_reviews WHERE user_id = ${userId}
    `;

    console.log('Total reviews for user:', reviewCount[0].count);

    let reward = null;
    if (reviewCount[0].count % 10 === 0 && reviewCount[0].count > 0) {
      // Generate voucher code and create reward
      const voucherCode = `HERITAGE${userId}${Date.now()}`;
      
      const rewardResult = await sql`
        INSERT INTO user_rewards (user_id, reward_type, description, voucher_code, voucher_amount, status, created_at)
        VALUES (${userId}, 'review_milestone', 'Congratulations! You earned ₹500 for ${reviewCount[0].count} amazing reviews!', ${voucherCode}, 500.00, 'pending', NOW())
        RETURNING id
      `;
      
      reward = {
        id: rewardResult[0].id,
        voucherCode,
        amount: 500,
        message: `🎉 Milestone achieved! ₹500 voucher earned for ${reviewCount[0].count} reviews!`
      };

      console.log('Reward created:', reward);
    }

    return c.json({ 
      success: true, 
      reviewId: result[0].id,
      reward,
      message: 'Review shared successfully!' 
    });
  } catch (error: unknown) {
    console.error('Review error:', error);
    return c.json({ error: 'Failed to share review', details: safeErrorMessage(error) }, 500);
  }
});


/* Follow/Unfollow user */
app.post('/api/community/follow', async (c) => {
  try {
    const body = await c.req.json();
    const { followerId, followingId, action } = body; // action: 'follow' or 'unfollow'

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    if (action === 'follow') {
      await sql`
        INSERT INTO user_follows (follower_id, following_id)
        VALUES (${followerId}, ${followingId})
        ON CONFLICT (follower_id, following_id) DO NOTHING
      `;
    } else if (action === 'unfollow') {
      await sql`
        DELETE FROM user_follows 
        WHERE follower_id = ${followerId} AND following_id = ${followingId}
      `;
    }

    return c.json({ success: true });
  } catch (error: unknown) {
    console.error('Follow error:', error);
    return c.json({ error: 'Failed to update follow status', details: safeErrorMessage(error) }, 500);
  }
});

/* Get user's followers/following */
app.get('/api/community/connections/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    const followers = await sql`
      SELECT u.id, u.first_name, u.last_name, u.username, uf.created_at
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.id
      WHERE uf.following_id = ${userId}
    `;

    const following = await sql`
      SELECT u.id, u.first_name, u.last_name, u.username, uf.created_at
      FROM user_follows uf
      JOIN users u ON uf.following_id = u.id
      WHERE uf.follower_id = ${userId}
    `;

    return c.json({ followers: followers || [], following: following || [] });
  } catch (error: unknown) {
    console.error('Connections error:', error);
    return c.json({ error: 'Failed to load connections', details: safeErrorMessage(error) }, 500);
  }
});

/* Find like-minded users */
app.get('/api/community/discover/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    // Get user's interests
    const userInterests = await sql`
      SELECT interest FROM user_interests WHERE user_id = ${userId}
    `;

    if (userInterests.length === 0) {
      return c.json({ users: [] });
    }

    const interestList = userInterests.map((ui: any) => ui.interest);

    // Find users with similar interests (excluding self and already followed)
    const similarUsers = await sql`
      SELECT DISTINCT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.username,
        COUNT(ui.interest) as common_interests,
        CASE WHEN uf.follower_id IS NOT NULL THEN true ELSE false END as is_following
      FROM users u
      JOIN user_interests ui ON u.id = ui.user_id
      LEFT JOIN user_follows uf ON uf.following_id = u.id AND uf.follower_id = ${userId}
      WHERE u.id != ${userId}
        AND ui.interest = ANY(${interestList})
        AND uf.follower_id IS NULL
      GROUP BY u.id, u.first_name, u.last_name, u.username, uf.follower_id
      ORDER BY common_interests DESC, u.first_name
      LIMIT 20
    `;

    return c.json({ users: similarUsers || [] });
  } catch (error: unknown) {
    console.error('Discover error:', error);
    return c.json({ error: 'Failed to discover users', details: safeErrorMessage(error) }, 500);
  }
});

/* Get user rewards */
app.get('/api/community/rewards/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    const rewards = await sql`
      SELECT * FROM user_rewards 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    return c.json({ rewards: rewards || [] });
  } catch (error: unknown) {
    console.error('Rewards error:', error);
    return c.json({ error: 'Failed to load rewards', details: safeErrorMessage(error) }, 500);
  }
});

/* Claim reward (integrate with Razorpay UPI) */
app.post('/api/community/rewards/claim', async (c) => {
  try {
    const body = await c.req.json();
    const { rewardId, upiId } = body;

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) return c.json({ error: 'Database connection failed' }, 500);

    // Update reward status
    await sql`
      UPDATE user_rewards 
      SET status = 'claimed', claimed_at = NOW()
      WHERE id = ${rewardId}
    `;

    // Here you would integrate with Razorpay UPI to send the voucher
    // For now, we'll just mark it as claimed
    console.log(`Reward ${rewardId} claimed for UPI: ${upiId}`);

    return c.json({ 
      success: true, 
      message: 'Reward claimed successfully! Voucher will be credited to your UPI within 24 hours.' 
    });
  } catch (error: unknown) {
    console.error('Claim reward error:', error);
    return c.json({ error: 'Failed to claim reward', details: safeErrorMessage(error) }, 500);
  }
});



/* Get user's visited places */
app.get('/api/places/visited/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    const visitedPlaces = await sql`
      SELECT place_name, visited_at
      FROM user_visited_places
      WHERE user_id = ${userId}
    `;

    // Convert to simple object format
    const visitedMap: Record<string, boolean> = {};
    visitedPlaces.forEach((place: any) => {
      visitedMap[place.place_name] = true;
    });

    return c.json(visitedMap);
  } catch (error: unknown) {
    console.error('Error fetching visited places:', error);
    return c.json({ error: 'Failed to fetch visited places', details: safeErrorMessage(error) }, 500);
  }
});

/* Mark/unmark place as visited */
app.post('/api/places/visited', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, placeName, visited } = body;

    const sql = getNeonSql(c.env as any) as any;
    if (!sql) {
      return c.json({ error: 'Database connection failed' }, 500);
    }

    if (visited) {
      // Mark as visited
      await sql`
        INSERT INTO user_visited_places (user_id, place_name, visited_at)
        VALUES (${userId}, ${placeName}, NOW())
        ON CONFLICT (user_id, place_name) 
        DO UPDATE SET visited_at = NOW(), updated_at = NOW()
      `;
    } else {
      // Remove from visited
      await sql`
        DELETE FROM user_visited_places 
        WHERE user_id = ${userId} AND place_name = ${placeName}
      `;
    }

    return c.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating visited place:', error);
    return c.json({ error: 'Failed to update visited place', details: safeErrorMessage(error) }, 500);
  }
});


export default app;
