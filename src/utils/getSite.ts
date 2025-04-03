import { config } from "../config";

export default function getSite(): string | "cpr" {
  return process.env.THEME || "cpr";
}

export async function getSiteAsync() {
  const theme = localStorage.getItem("theme");
  if (theme) return theme;
  const themeResponse = config.theme;
  // Only store the theme if have one set
  if (themeResponse) {
    localStorage.setItem("theme", themeResponse);
  }
  // Will return null if not found
  return themeResponse;
}
