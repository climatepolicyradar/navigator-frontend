const CPR_DESCRIPTION =
  "Use Climate Policy Radar’s data science and AI-powered platform to search and explore thousands of climate change laws, policies and legal cases worldwide";
const CCLW_DESCRIPTION =
  "The Climate Change Laws of the World database gives you access to national-level climate change legislation and policies from around the world.";

export default function getPageDescription(site: string): string {
  let title = CPR_DESCRIPTION;
  switch (site) {
    case "cclw":
      title = CCLW_DESCRIPTION;
      break;
  }
  return title;
}
