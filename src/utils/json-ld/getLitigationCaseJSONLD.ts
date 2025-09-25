import sortBy from "lodash/sortBy";
import { Legislation, WithContext } from "schema-dts";

import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";

/**
 * Generates JSON-LD structured data for a litigation case.
 * @param familyCase - The family case data.
 * @param countries - List of countries for geography mapping.
 * @param subdivisions - List of subdivisions for geography mapping.
 * @returns JSON-LD object for the litigation case.
 */

/*
 * IMPORTANT READING: https://schema.org/Legislation
 * We've taken the schema for legislation as a base for litigation cases.
 * This is because litigation cases are often treated as legal documents and can be structured similarly.
 * The schema can be validated here: https://validator.schema.org/
 */

export const getLitigationJSONLD = (familyCase: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]) => {
  const geosOrdered = sortBy(familyCase.geographies, [(geo) => geo.length !== 3, (geo) => geo.toLowerCase()]);

  // Default JSON-LD legislation structure

  // Ensure no trailing slash on hostname - no guarantee that it will be present. Better to not assume either way.
  const hostname = process.env.HOSTNAME?.replace(/\/$/, "") || "";

  let jsonLd: WithContext<Legislation> = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    "@id": `${hostname}/document/${familyCase.slug}`,
    url: `${hostname}/document/${familyCase.slug}`,
    isAccessibleForFree: true,
    name: `${familyCase.title}`,
    description: `${familyCase.summary}`,
    dateCreated: `${familyCase.published_date}`,
    dateModified: `${familyCase.last_updated_date}`,
  };

  if (familyCase.corpus?.organisation) {
    jsonLd.publisher = {
      "@type": "Organization",
      name: `${familyCase.corpus.organisation.name}`,
      url: `${familyCase.corpus.organisation.attribution_url}`,
    };
  }

  // Case metadata for JSON-LD
  if (familyCase.metadata?.case_number?.length) {
    jsonLd.legislationIdentifier = familyCase.metadata.case_number;
  }

  // Geography related JSON-LD
  if (geosOrdered.length > 0) {
    let spatialCoverage = [];
    geosOrdered.forEach((geo) => {
      const countryName = getCountryName(geo, countries);
      if (countryName) {
        spatialCoverage.push({
          "@type": "Place",
          name: countryName,
          url: `${hostname}/geographies/${getCountrySlug(geo, countries)}`,
        });
      } else {
        const subdivision = subdivisions.find((sub) => sub.code === geo);
        if (subdivision) {
          spatialCoverage.push({
            "@type": "Place",
            name: subdivision.name,
            url: `${hostname}/geographies/${subdivision.code}`,
          });
        }
      }
    });
    if (spatialCoverage.length > 0) {
      jsonLd.spatialCoverage = spatialCoverage;
    }
  }

  // Translating concepts into JSON-LD attributes
  if (familyCase.concepts.length > 0) {
    // Add any concepts of principal laws as keywords
    const keywords = familyCase.concepts.filter((concept) => concept.type === "law");
    jsonLd.keywords = keywords.map((keyword) => keyword.preferred_label);

    // Add legal entities as jurisdictions
    const jurisdictions = familyCase.concepts.filter((concept) => concept.type === "legal_entity");
    if (jurisdictions.length > 0) {
      jsonLd.jurisdiction = jurisdictions.map((jurisdiction) => ({
        "@type": "AdministrativeArea",
        name: jurisdiction.preferred_label,
      }));
    }

    // Add legal categories as about
    const legalCategories = familyCase.concepts.filter((concept) => concept.type === "legal_category");
    if (legalCategories.length > 0) {
      jsonLd.about = legalCategories.map((category) => ({
        "@type": "Thing",
        name: category.preferred_label,
      }));
    }
  }

  // Documents as work examples
  if (familyCase.documents && familyCase.documents.length > 0) {
    jsonLd.workExample = familyCase.documents.map((doc) => ({
      "@type": "Legislation",
      "@id": `${hostname}/documents/${doc.slug}`,
      url: `${hostname}/documents/${doc.slug}`,
      isAccessibleForFree: true,
      name: doc.title,
      description: doc.events[0]?.metadata?.description || "",
      legislationDate: doc.events[0]?.date,
    }));
  }

  return jsonLd;
};
