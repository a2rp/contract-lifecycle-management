import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/contract-lifecycle-management/",
  build: { sourcemap: false },
  plugins: [react()],
});
