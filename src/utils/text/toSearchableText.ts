// Cannot be automatically converted but searching for these Latin-only should still match
const NON_DECOMPOSABLE_REPLACEMENTS: Record<string, string> = {
  æ: "ae",
  œ: "oe",
  ø: "o",
  ð: "d",
  þ: "th",
  ł: "l",
  ß: "ss",
  ı: "i",
};

export const toSearchableText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[æœøðþłßı]/g, (char) => NON_DECOMPOSABLE_REPLACEMENTS[char]);
