import { defineConfig } from "tsup";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tokens/index": "src/tokens/index.ts",
    "patterns/index": "src/patterns/index.ts",
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
    "react-hook-form",
    "recharts",
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
    // AND declares @source so the consumer's Tailwind v4 scanner picks up
    // arbitrary utility classes baked into our compiled JS (e.g. bg-[linear-gradient(...)]).
    // Without @source, HC1-authored components render unstyled in the consumer
    // because Tailwind never sees the class strings inside dist/*.js.
    // Component stylesheets (plain CSS, not Tailwind classes). The JS
    // entries import them, but tsup only extracts them to dist/index.css,
    // which consumers never load, so EmptyState, Skeleton and Gauge
    // rendered unstyled. Ship them next to styles.css and import them.
    const componentCss = [
      "empty-state/EmptyState.css",
      "skeleton/Skeleton.css",
      "gauge/Gauge.css",
    ];
    mkdirSync("dist/components", { recursive: true });
    for (const file of componentCss) {
      cpSync(`src/components/${file}`, `dist/components/${file.split("/")[1]}`);
    }
    writeFileSync(
      "dist/styles.css",
      [
        '@import "./tokens/css/variables.css";',
        ...componentCss.map(file => `@import "./components/${file.split("/")[1]}";`),
        '@source "./index.js";',
        '@source "./index.cjs";',
        '@source "./patterns/index.js";',
        '@source "./patterns/index.cjs";',
        '',
      ].join("\n"),
    );
  },
});
