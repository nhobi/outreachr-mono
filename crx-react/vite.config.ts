import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import crx from "vite-plugin-crx-mv3";
import zipPack from "vite-plugin-zip-pack";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const stage = process.env.VITE_STAGE;
  return {
    plugins: [
      react(),
      sentryVitePlugin({
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN_CONTENT,
        org: "hirejs",
        project: "outreachr-chrome",
      }),
      crx({
        manifest: `./src/assets/${stage}/manifest.json`,
      }),
      zipPack(),
    ],
    build: {
      sourcemap: "inline",
    },
  };
});
