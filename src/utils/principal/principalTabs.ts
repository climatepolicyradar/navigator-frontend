import { COOKIE_PRINCIPAL_TAB_NAME } from "@/constants/cookies";
import { PRINCIPAL_DRAWER_TABS, TPrincipalDrawerTab } from "@/types";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

const isPrincipalDrawerTab = (value: string): value is TPrincipalDrawerTab => PRINCIPAL_DRAWER_TABS.includes(value as TPrincipalDrawerTab);

export const getPersistedPrincipalDrawerTab = (): TPrincipalDrawerTab => {
  const value = getCookie(COOKIE_PRINCIPAL_TAB_NAME);
  return isPrincipalDrawerTab(value) ? value : "about";
};

export const persistPrincipalDrawerTab = (tab: TPrincipalDrawerTab) => setCookie(COOKIE_PRINCIPAL_TAB_NAME, tab, getDomain());
