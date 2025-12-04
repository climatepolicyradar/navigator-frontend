import orderBy from "lodash/orderBy";

import { ORDERED_ROOT_TOPIC_IDS } from "@/constants/topics";
import { TConcept } from "@/types";

export const sortData = (data, prop) => {
  var myData = data.sort((a, b) => {
    if (a[prop] < b[prop]) {
      return -1;
    }
    if (a[prop] > b[prop]) {
      return 1;
    }
    return 0;
  });

  return myData;
};

export const sortRootTopics = (concepts: TConcept[]) =>
  orderBy(
    concepts,
    [
      (concept) => {
        const index = ORDERED_ROOT_TOPIC_IDS.findIndex((wikibaseId) => wikibaseId === concept.wikibase_id);
        return index === -1 ? null : index;
      },
      "preferred_label",
    ],
    ["asc", "asc"]
  );
