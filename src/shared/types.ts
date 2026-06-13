import z from "zod";

export const HeritageSiteSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  historical_period: z.string().nullable(),
  location: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  is_featured: z.boolean(),
  model_url: z.string().nullable(),
  background_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SiteStorySchema = z.object({
  id: z.number(),
  site_id: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  audio_url: z.string().nullable(),
  position_x: z.number().nullable(),
  position_y: z.number().nullable(),
  position_z: z.number().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SiteArtifactSchema = z.object({
  id: z.number(),
  site_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  model_url: z.string().nullable(),
  position_x: z.number().nullable(),
  position_y: z.number().nullable(),
  position_z: z.number().nullable(),
  scale_factor: z.number(),
  is_interactive: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type HeritageSite = z.infer<typeof HeritageSiteSchema>;
export type SiteStory = z.infer<typeof SiteStorySchema>;
export type SiteArtifact = z.infer<typeof SiteArtifactSchema>;

export interface HeritageExploration {
  site: HeritageSite;
  stories: SiteStory[];
  artifacts: SiteArtifact[];
}
