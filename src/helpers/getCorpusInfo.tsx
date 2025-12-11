import { TCorpusTypeDictionary } from "@/types";

interface IProps {
  corpus_types: TCorpusTypeDictionary;
  corpus_id: string;
}

interface ICorpusInfo {
  corpusImage: string | null;
  corpusAltImage: string;
  corpusNote: string;
}

export const getCorpusInfo = ({ corpus_types, corpus_id }: IProps): ICorpusInfo => {
  const corpora = Object.values(corpus_types).flatMap((corpus_type) => corpus_type.corpora);
  const selectedCorpus = corpora.find((corpus) => corpus.corpus_import_id === corpus_id);
  const defaultCorpus: ICorpusInfo = {
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
