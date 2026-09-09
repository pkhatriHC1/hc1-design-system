import { defineConfig } from "tsup";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tokens/index": "src/tokens/index.ts",
    playground: "src/playground.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    /^@radix-ui\//,
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
  ],
  async onSuccess() {
    // Copy the CSS token bundle so consumers can `import "@hc1/design-system/styles"`.
    mkdirSync("dist/tokens/css", { recursive: true });
    cpSync("src/tokens/css", "dist/tokens/css", { recursive: true });
    // Flat entry re-exports variables.css (which chains theme.css + shadcn-bridge.css)
    writeFileSync("dist/styles.css", '@import "./tokens/css/variables.css";\n');
  },
});
