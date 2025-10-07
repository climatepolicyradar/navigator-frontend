import { Legislation, WithContext } from "schema-dts";

import { TCollectionPublicWithFamilies } from "@/types";

import { getHostnameForJSONLD } from "./helpers";

/**
 * Generates JSON-LD structured data for a litigation collection.
 * @param collection - The case collection data.
 * @returns JSON-LD object for the litigation collection.
 */

/*
 * IMPORTANT READING: https://schema.org/Legislation
 * We've taken the schema for legislation as a base for litigation collections.
 * This is because collections are a grouping of litigation cases and this is the best fit schema
 * The schema can be validated here: https://validator.schema.org/
 */

export const getLitigationCollectionJSONLD = (collection: TCollectionPublicWithFamilies) => {
  const { families } = collection;

  // There should be at least one family. Some data needs to be inferred from one of the families
  if (families.length === 0) return {};

  const hostname = getHostnameForJSONLD();

  // Default JSON-LD legislation structure
  const jsonLd: WithContext<Legislation> = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    "@id": `${hostname}/collections/${collection.slug}`,
    url: `${hostname}/collections/${collection.slug}`,
    isAccessibleForFree: true,
    name: `${collection.title}`,
    description: `${collection.description}`,
    dateCreated: families.map((family) => family.published_date).sort()[0], // Oldest
    dateModified: families
      .map((family) => family.last_updated_date)
      .sort()
      .reverse()[0], // Newest
  };

  if (families[0].corpus?.organisation) {
    jsonLd.publisher = {
      "@type": "Organization",
      name: `${families[0].corpus.organisation.name}`,
      url: `${families[0].corpus.attribution_url}`,
    };
  }

  // Cases as work examples
  jsonLd.workExample = families.map((family) => ({
    "@type": "Legislation",
    "@id": `${hostname}/document/${family.slug}`,
    url: `${hostname}/document/${family.slug}`,
    isAccessibleForFree: true,
    name: family.title,
    description: `${family.summary}`,
    legislationDate: `${family.published_date}`,
  }));

  return jsonLd;
};
