export const PRINCIPAL_DRAWER_TABS = ["about", "search"] as const;
export type TPrincipalDrawerTab = (typeof PRINCIPAL_DRAWER_TABS)[number];
