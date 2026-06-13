import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [
    ...mochaPlugins(process.env as any),
    react(),
    cloudflare(),
    {
      name: 'unity-compressed-assets-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const raw = req.url || '';
          const url = raw.split('?')[0];
          if (url.startsWith('/temple-tour/Build/')) {
            if (url.endsWith('.data.gz')) {
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Encoding', 'gzip');
            } else if (url.endsWith('.wasm.gz')) {
              res.setHeader('Content-Type', 'application/wasm');
              res.setHeader('Content-Encoding', 'gzip');
            } else if (url.endsWith('.js.gz')) {
              res.setHeader('Content-Type', 'application/javascript');
              res.setHeader('Content-Encoding', 'gzip');
            } else if (url.endsWith('.symbols.json.gz')) {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Content-Encoding', 'gzip');
            } else if (url.endsWith('.data.br')) {
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Encoding', 'br');
            } else if (url.endsWith('.wasm.br')) {
              res.setHeader('Content-Type', 'application/wasm');
              res.setHeader('Content-Encoding', 'br');
            } else if (url.endsWith('.js.br')) {
              res.setHeader('Content-Type', 'application/javascript');
              res.setHeader('Content-Encoding', 'br');
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  optimizeDeps: {
    exclude: ["ai", "@ai-sdk/openai", "@xenova/transformers"],
  },
  ssr: {
    noExternal: ["ai", "@ai-sdk/openai"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["ai", "@ai-sdk/openai"],
  },
});