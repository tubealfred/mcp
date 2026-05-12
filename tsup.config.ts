import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  shims: true,
  minify: false,
  splitting: false,
  noExternal: [/^@modelcontextprotocol\//],
  banner: {
    js: "#!/usr/bin/env node",
  },
});
