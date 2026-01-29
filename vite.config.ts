import { defineConfig } from 'vite';

const repo = 'rocket-parts-viz';

export default defineConfig({
  base: `/${repo}/`,
  server: { port: 5174, strictPort: true },
  build: { sourcemap: true }
});
