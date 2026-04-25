import test from "node:test";
import assert from "node:assert/strict";
import { buildShareCardModel } from "../js/ui/shareCard.js";

test("buildShareCardModel returns share-safe lines and theme", () => {
  const model = buildShareCardModel({
    result: {
      name: "学习猫",
      tagline: "认真生长、稳定进步的自律小猫",
      shareText: "测出学习猫，合理，我的人生主线果然是默默升级。",
      accentColor: "#ffd54a"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。"
  });

  assert.equal(model.title, "学习猫");
  assert.equal(model.theme.accent, "#ffd54a");
  assert.ok(model.lines.length >= 3);
});
