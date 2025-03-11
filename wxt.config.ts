import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/auto-icons"],
  extensionApi: "chrome",
  manifest: {
    name: "QRYomi",
    description: "__MSG_manifest_description__",
    default_locale: "en",
  },
});
