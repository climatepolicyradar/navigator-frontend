import { TAttributionCategory, TCategory } from "@/types";

type TAnyCategory = Lowercase<TCategory | TAttributionCategory>;

type TTaxonomyMatch = {
  taxonomy: string;
  category: TAnyCategory[]; // Must match at least one of these categories
  provider?: string[]; // If provided must also match at least one of these providers
  corpusId?: string; // Optional exact corpus ID match. Overrides above matches
};

const TAXONOMY_MATCHES: TTaxonomyMatch[] = [
  /* UNFCCC */
  {
    taxonomy: "CBD Submission",
    corpusId: "UN.corpus.UNCBD.n0000",
    category: ["un submission", "unfccc"],
    provider: ["UNCBD"],
  },
  {
    taxonomy: "UNCCD submission",
    corpusId: "UN.corpus.UNCCD.n0000",
    category: ["un submission", "unfccc"],
    provider: ["UNCCD"],
  },
  {
    taxonomy: "UNFCCC submission",
    corpusId: "UNFCCC.corpus.i00000001.n0000",
    category: ["un submission", "unfccc"],
    provider: ["UNFCCC"],
  },
  /* Reports */
  {
    taxonomy: "Offshore Wind Report",
    category: ["report", "reports"],
    provider: ["OEP", "Ocean Energy Pathways"],
  },
  {
    taxonomy: "Guidance",
    category: ["report", "reports"],
    provider: ["AF", "Adaptation Fund", "CIF", "The Climate Investment Funds", "GCF", "Green Climate Fund", "GEF", "Global Environment Facility"],
  },
  {
    taxonomy: "Report",
    category: ["report", "reports"],
  },
  /* MCF */
  {
    taxonomy: "Adaptation Fund",
    category: ["mcf", "multilateral climate fund project"],
    provider: ["AF", "Adaptation Fund"],
  },
  {
    taxonomy: "Climate Investment Fund",
    category: ["mcf", "multilateral climate fund project"],
    provider: ["CIF", "The Climate Investment Funds"],
  },
  {
    taxonomy: "Green Climate Fund",
    category: ["mcf", "multilateral climate fund project"],
    provider: ["GCF", "Green Climate Fund"],
  },
  {
    taxonomy: "Global Environment Facility",
    category: ["mcf", "multilateral climate fund project"],
    provider: ["GEF", "Global Environment Facility"],
  },
  /* Everything else */
  {
    taxonomy: "Litigation",
    category: ["litigation"],
  },
  {
    taxonomy: "Legislative",
    category: ["law", "legislative"],
  },
  {
    taxonomy: "Policy",
    category: ["executive", "policy"],
  },
  {
    taxonomy: "UN Submission",
    category: ["un submission", "unfccc"],
  },
  {
    taxonomy: "MCF",
    category: ["mcf"],
  },
];

export const getTaxonomy = (category: TAnyCategory, provider: string, corpusId?: string): string => {
  const taxonomyMatch = TAXONOMY_MATCHES.find((match) => {
    if (match.corpusId && match.corpusId === corpusId) return true;
    if (!match.category.some((cat) => cat === category)) return false;

    if (match.provider) {
      return match.provider.some((prov) => prov === provider);
    } else {
      return true;
    }
  });

  return taxonomyMatch?.taxonomy ?? category;
};
