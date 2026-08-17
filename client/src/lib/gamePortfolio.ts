export const gamePortfolio = [
  {
    id: "tank-defense",
    order: 1,
    title: "WGD 校园防线：坦克大战",
    url: "https://2059877032.github.io/wgd-campus-defense/",
    status: "已上线",
  },
  {
    id: "stellar-fury",
    order: 2,
    title: "星际之怒",
    url: "https://comforting-tiramisu-1b5156.netlify.app/",
    status: "作品归档",
  },
] as const;

export function isIndependentGameUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}
