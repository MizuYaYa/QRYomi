import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    name: "QRYomi",
    description: "__MSG_manifest_description__",
    default_locale: "en",
    icons: {
      "16": "QRYomi_icons/QRYomi_icon_16.png",
      "32": "QRYomi_icons/QRYomi_icon_32.png",
      "48": "QRYomi_icons/QRYomi_icon_48.png",
      "128": "QRYomi_icons/QRYomi_icon_128.png",
    },
  },
});

// {
// 	"manifest_version": 3,
// 	"name": "QRYomi",
// 	"version": "0.2.0",
// 	"action": {
// 		"default_icon": {
// 			"16": "images/QRYomi_icons/QRYomi_icon_16.png",
// 			"32": "images/QRYomi_icons/QRYomi_icon_32.png",
// 			"48": "images/QRYomi_icons/QRYomi_icon_48.png",
// 			"128": "images/QRYomi_icons/QRYomi_icon_128.png"
// 		},
//         "default_title": "QRYomi",
//         "default_popup": "popup/popup.html"
//     },
// 	"default_locale": "en",
// 	"description": "__MSG_manifest_description__",
// 	"icons": {
// 		"16": "images/QRYomi_icons/QRYomi_icon_16.png",
// 		"32": "images/QRYomi_icons/QRYomi_icon_32.png",
// 		"48": "images/QRYomi_icons/QRYomi_icon_48.png",
// 		"128": "images/QRYomi_icons/QRYomi_icon_128.png"
// 	},
// 	"options_ui": {
// 		"page": "settings/settings.html",
// 		"open_in_tab": false
// 	}
// }
