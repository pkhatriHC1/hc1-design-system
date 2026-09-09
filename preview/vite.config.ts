import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/hc1-design-system/",
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "lucide-react",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
});
