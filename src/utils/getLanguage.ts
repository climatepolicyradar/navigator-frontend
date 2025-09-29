export const getLanguage = (acceptLanguageHeader: string | undefined): string => {
  if (!acceptLanguageHeader) {
    return "en-US"; // default language
  }
  const header = Array.isArray(acceptLanguageHeader) ? acceptLanguageHeader[0] : acceptLanguageHeader;
  return header.split(",")[0].trim();
};
