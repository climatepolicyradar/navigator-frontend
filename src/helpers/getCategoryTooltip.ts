export const getCategoryTooltip = (category: string): string => {
  switch (category) {
    case "All":
      return "";
    case "Laws":
      return "For example: Laws, Acts, Constitutions (legislative branch)";
    case "Policies":
      return "For example: Policies, strategies, decrees, action plans (from executive branch)";
    case "Litigation":
      return "For example: Court cases and tribunal proceedings";
    case "UN Submissions":
      return "Documents submitted to UN Conventions (including NDCs)";
    case "Climate Finance Projects":
      return "Multilateral climate fund projects and policies";
    case "Offshore Wind Reports":
      return "For example: Documents from national bodies, corporations, NGOs, and academia";
    default:
      return "";
  }
};
