import { build } from "esbuild";

await build({
  entryPoints: ["./js/main.js"],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  outfile: "./js/app.bundle.js",
  legalComments: "none"
});
