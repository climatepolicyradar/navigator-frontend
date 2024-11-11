const DEFAULT_DESCRIPTION =
  "Use Climate Policy Radar’s data science and AI-powered platform to search and explore thousands of climate change laws, policies and legal cases worldwide";
const MCF_DESCRIPTION =
  "Climate Project Explorer is a single point of entry for navigating and exploring the MCF’s documents (including project documents and policies).";
const CCLW_DESCRIPTION =
  "The Climate Change Laws of the World database gives you access to national-level climate change legislation and policies from around the world.";

export default function getPageDescription(site: string): string {
  let title = DEFAULT_DESCRIPTION;
  switch (site) {
    case "cclw":
      title = CCLW_DESCRIPTION;
      break;
    case "mcf":
      title = MCF_DESCRIPTION;
      break;
  }
  return title;
}
