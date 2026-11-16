import { TFeatures } from "@/types";

type TDirectLinkRedirectResult = { notFound: true } | { redirect: { destination: string; permanent: false } };
type TWithDirectLinkPolicy = { directLinkPolicy: { action: "not_found" } | { action: "redirect"; to: string } | null };

// FUS-722: direct-link 404/redirect only applies once new search is live, since search-exclude labels are a new-search concept
export const getDirectLinkRedirect = (data: TWithDirectLinkPolicy | null, slug: string, features: TFeatures): TDirectLinkRedirectResult | null => {
  if (!features["new-search"] || !data?.directLinkPolicy) return null;

  switch (data.directLinkPolicy.action) {
    case "not_found":
      return { notFound: true };
    case "redirect":
      return { redirect: { destination: data.directLinkPolicy.to.replace("{id}", slug), permanent: false } };
  }
};
