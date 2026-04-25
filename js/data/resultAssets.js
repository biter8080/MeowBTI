const RESULT_IMAGE_MAP = {
  "01": "./resources/personalities-main/11 权威猫.png",
  "02": "./resources/personalities-main/05 打工猫.png",
  "03": "./resources/personalities-main/14 土豪猫.png",
  "04": "./resources/personalities-main/08 巴拿拿猫.png",
  "05": "./resources/personalities-main/06 超级无敌宇宙大美猫.png",
  "06": "./resources/personalities-main/04 学习猫.png",
  "07": "./resources/personalities-main/03 我说我是猫.png",
  "08": "./resources/personalities-main/16 可爱喵.png",
  "09": "./resources/personalities-main/02 邪恶银渐层.png",
  "10": "./resources/personalities-main/12 哈气猫.png",
  "11": "./resources/personalities-main/13 嘲讽猫.png",
  "12": "./resources/personalities-main/10 命苦猫.png",
  "13": "./resources/personalities-main/01 西格玛猫.png",
  "14": "./resources/personalities-main/07 念念叨叨气猫猫.png",
  "15": "./resources/personalities-main/09 huh 猫.png",
  "16": "./resources/personalities-main/15 落汤喵.png"
};

export function getResultImagePath(result) {
  return RESULT_IMAGE_MAP[result?.id] ?? "";
}
