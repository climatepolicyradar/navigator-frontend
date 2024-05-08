/* eslint-disable no-console */
import { TOrganisation, TOrganisationDictionary } from "@types";

type TProps = {
  organisations?: TOrganisationDictionary;
  organisation?: string;
  corpus_id?: string;
};

export const getCorpusInfo = ({ organisations, organisation, corpus_id }: TProps) => {
  if (!organisations) {
    // No organisations means we're not yet ready
    return { corpusImage: null, corpusAltImage: null, corpusNote: null };
  }
  const defaultResult = {
    corpusImage: null,
    corpusAltImage: "No corpus image found",
    corpusNote: "No corpus note found",
  };

  if (!organisations || !organisation || !corpus_id) {
    console.error(`getCorpusInfo(): Something isn't set - Organisation: ${organisation}, Corpus_id: ${corpus_id}`);
    return defaultResult;
  }

  const orgConfig: TOrganisation = organisations[organisation];
  const corpusFound = orgConfig?.corpora.filter((c) => c.corpus_import_id === corpus_id);

  if (!corpusFound) {
    console.error(`getCorpusInfo(): Couldn't find corpus - Organisation: ${organisation}, Corpus_id: ${corpus_id}`);
    return defaultResult;
  }
  const corpusConfig = corpusFound[0];

  return {
    corpusImage: corpusConfig?.image_url,
    corpusAltImage: corpusConfig?.description,
    corpusNote: corpusConfig?.text,
  };
};
