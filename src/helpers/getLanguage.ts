const LANGUAGE_NAME_OVERRIDES: Record<string, string> = {
  // trunk-ignore(typos)
  aas: "Aasáx",
  aig: "Antigua and Barbuda Creole English",
  aiw: "Aari",
  arb: "Standard Arabic",
  bxm: "Mongolia Buriat",
  cmn: "Mandarin Chinese",
  hbs: "Serbo-Croatian",
  kbt: "Abadi",
  mgt: "Mongol",
  pes: "Iranian Persian",
  psr: "Portuguese Sign Language",
  zsm: "Standard Malay",
};

const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
const ISO_639_CODE = /^[a-z]{2,3}$/;

const displayName = (languageKey: string): string | undefined => {
  if (!ISO_639_CODE.test(languageKey)) return undefined;

  try {
    return displayNames.of(languageKey);
  } catch {
    return undefined;
  }
};

export const getLanguage = (languageKey: string): string => {
  return LANGUAGE_NAME_OVERRIDES[languageKey] ?? displayName(languageKey) ?? languageKey;
};
