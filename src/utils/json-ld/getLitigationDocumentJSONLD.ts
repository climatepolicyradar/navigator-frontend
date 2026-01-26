import sortBy from "lodash/sortBy";
import { Legislation, WithContext } from "schema-dts";

import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { TDocumentPage, TFamilyPublic, TGeography } from "@/types";

import { getHostnameForJSONLD } from "./helpers";

/**
 * Generates JSON-LD structured data for a litigation collection.
 * @param collection - The case collection data.
 * @returns JSON-LD object for the litigation collection.
 */

/*
 * IMPORTANT READING: https://schema.org/Legislation
 * We've taken the schema for legislation as a base for litigation documents.
 * This is because litigation documents are legal documents and can be structured similarly
 * The schema can be validated here: https://validator.schema.org/
 */

export const getLitigationDocumentJSONLD = (document: TDocumentPage, family: TFamilyPublic, countries: TGeography[]) => {
  const hostname = getHostnameForJSONLD();

  // Default JSON-LD legislation structure
  const jsonLd: WithContext<Legislation> = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    "@id": `${hostname}/documents/${document.slug}`,
    url: `${hostname}/documents/${document.slug}`,
    isAccessibleForFree: true,
    name: `${document.title}`,
    // Work example of parent case
    exampleOfWork: {
      "@type": "Legislation",
      "@id": `${hostname}/document/${family.slug}`,
      url: `${hostname}/document/${family.slug}`,
      isAccessibleForFree: true,
      name: `${family.title}`,
      description: `${family.summary}`,
      dateCreated: `${family.published_date}`,
      dateModified: `${family.last_updated_date}`,
    },
  };

  if (family.corpus?.organisation) {
    jsonLd.publisher = {
      "@type": "Organization",
      name: `${family.corpus.organisation.name}`,
      url: `${family.corpus.attribution_url}`,
    };
  }

  // Case metadata for JSON-LD
  if (family.metadata?.case_number?.length) {
    jsonLd.legislationIdentifier = family.metadata.case_number;
  }

  // Geography related JSON-LD
  const geosOrdered = sortBy(family.geographies, [(geo) => geo.length !== 3, (geo) => geo.toLowerCase()]);

  if (geosOrdered.length > 0) {
    let spatialCoverage: any[] = []; // TODO: improve typing using schema-dts
    geosOrdered.forEach((geo) => {
      const countryName = getCountryName(geo, countries);
      if (countryName) {
        spatialCoverage.push({
          "@type": "Place",
          name: countryName,
          url: `${hostname}/geographies/${getCountrySlug(geo, countries)}`,
        });
      }
      // TODO add subdivisions once document page references them
    });
    if (spatialCoverage.length > 0) {
      jsonLd.spatialCoverage = spatialCoverage;
    }
  }

  return jsonLd;
};
