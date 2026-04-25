import { readFile } from "node:fs/promises";
import vm from "node:vm";

const SCRIPT_PATHS = [
  "../../js/data/content.js",
  "../../js/data/resultAssets.js",
  "../../js/core/engine.js",
  "../../js/core/state.js",
  "../../js/ui/templates.js",
  "../../js/ui/shareCard.js"
];

export async function loadAppScripts(scriptPaths = SCRIPT_PATHS) {
  const previousNamespace = globalThis.MaoBTI;
  globalThis.MaoBTI = {};

  for (const scriptPath of scriptPaths) {
    const source = await readFile(new URL(scriptPath, import.meta.url), "utf8");
    vm.runInThisContext(source, { filename: scriptPath });
  }

  const namespace = globalThis.MaoBTI;
  globalThis.MaoBTI = previousNamespace;
  return namespace;
}
