import { TOrganisationDictionary } from "@types";

export const calculateTotalDocuments = (organsations: TOrganisationDictionary) => {
  const totals = {
    laws: 0,
    policies: 0,
    unfccc: 0,
  };

  if (!organsations) return totals;

  Object.values(organsations).forEach((org) => {
    if (!org.count_by_category) return;

    totals.laws += org.count_by_category?.Legislative || 0;
    totals.policies += org.count_by_category?.Executive || 0;
    totals.unfccc += org.count_by_category?.UNFCCC || 0;
  });

  return totals;
};
