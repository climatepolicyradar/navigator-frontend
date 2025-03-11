import { TCorpusTypeDictionary } from "@/types";

type TProps = {
  corpus_types: TCorpusTypeDictionary;
  corpus_id: string;
};

export const getCorpusInfo = ({ corpus_types, corpus_id }: TProps) => {
  const corpora = Object.values(corpus_types).flatMap((corpus_type) => corpus_type.corpora);
  const selectedCorpus = corpora.find((corpus) => corpus.corpus_import_id === corpus_id);
  const defaultCorpus = {
    corpusImage: null,
    corpusAltImage: "No corpus image found",
    corpusNote: "No corpus note found",
  };

  return selectedCorpus
    ? {
        corpusImage: selectedCorpus.image_url,
        corpusAltImage: selectedCorpus.title,
        corpusNote: selectedCorpus.text,
      }
    : defaultCorpus;
};
