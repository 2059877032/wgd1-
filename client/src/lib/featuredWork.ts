export type FeaturedWork = {
  id: "tank" | "ppt" | "stellar";
  index: string;
  title: string;
  kind: string;
  summary: string;
  action: string;
  target: "external" | "archive";
};

export const featuredWork: FeaturedWork[] = [
  {
    id: "tank",
    index: "01 / LIVE",
    title: "WGD 校园防线",
    kind: "AI CODING / GAME",
    summary: "五关主线 · 俯视战术 · 独立试玩",
    action: "打开游戏",
    target: "external",
  },
  {
    id: "ppt",
    index: "20 PAGES",
    title: "秸约未来",
    kind: "PPT DESIGN / EDITORIAL",
    summary: "20 页项目叙事 · 档案放映册",
    action: "开始翻阅",
    target: "archive",
  },
  {
    id: "stellar",
    index: "02 / ARCADE",
    title: "星际之怒",
    kind: "AI CODING / WEB GAME",
    summary: "即时操控 · 飞行战斗 · 在线试玩",
    action: "打开游戏",
    target: "external",
  },
];
