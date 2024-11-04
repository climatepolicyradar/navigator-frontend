const DEFAULT_DESCRIPTION =
  "Use Climate Policy Radar’s data science and AI-powered platform to search and explore thousands of climate change laws, policies and legal cases worldwide";

export default function getPageDescription(description?: string): string {
  if (description) return description;
  return DEFAULT_DESCRIPTION;
}
