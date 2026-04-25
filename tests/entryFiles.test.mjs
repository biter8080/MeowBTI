import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

test("index.html loads app scripts without module-only entry points", async () => {
  const indexHtml = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8"
  );

  assert.doesNotMatch(indexHtml, /type="module"/);
  assert.match(indexHtml, /<script src="\.\/js\/data\/content\.js"><\/script>/);
  assert.match(indexHtml, /<script src="\.\/js\/main\.js"><\/script>/);
});

test("index.html script stack renders the home view when opened directly", async () => {
  const indexHtml = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8"
  );
  const scriptSources = [...indexHtml.matchAll(/<script src="([^"]+)"><\/script>/g)]
    .map((match) => match[1]);

  const app = { innerHTML: "" };
  const canvasContext = {
    arc() {},
    beginPath() {},
    clearRect() {},
    closePath() {},
    fill() {},
    fillRect() {},
    fillText() {},
    lineTo() {},
    moveTo() {},
    restore() {},
    save() {},
    setTransform() {},
    translate() {}
  };
  const canvas = {
    getContext: () => canvasContext
  };
  const context = {
    console,
    document: {
      addEventListener() {},
      body: {
        insertAdjacentHTML() {}
      },
      querySelector: (selector) => {
        if (selector === "#app") {
          return app;
        }

        if (selector === "#bg-canvas" || selector === "#share-canvas") {
          return canvas;
        }

        return null;
      }
    },
    Image: function Image() {},
    localStorage: {
      getItem: () => null,
      removeItem() {},
      setItem() {}
    },
    window: null,
    devicePixelRatio: 1,
    innerHeight: 800,
    innerWidth: 1280,
    addEventListener() {},
    cancelAnimationFrame() {},
    requestAnimationFrame: () => 1
  };
  context.globalThis = context;
  context.window = context;

  const vmContext = vm.createContext(context);

  for (const sourcePath of scriptSources) {
    const source = await readFile(new URL(`../${sourcePath}`, import.meta.url), "utf8");
    vm.runInContext(source, vmContext, { filename: sourcePath });
  }

  assert.match(app.innerHTML, /测测今天的喵BTI/);
});
