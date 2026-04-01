import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { FamilyPage as FamilyPageUI } from "@/components/pages/familyPage";
import { ROBOTS_BLOCKED_SLUGS, X_ROBOTS_TAG_NOINDEX_VALUE } from "@/constants/robots";
import { withEnvConfig } from "@/context/EnvConfig";
import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

import { getFamilyData } from "../../bff/methods/getFamilyData";

/*
  # DEV NOTES
  - This page displays a single document family and its associated documents, meta data, targets, and events.
  - Families can contain multiple documents, often referred to as 'physical documents'.
  - The 'physical document' view is within the folder: src/pages/documents/[id].tsx.
*/

const FamilyPage = ({ ...props }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <FamilyPageUI {...props} />;
};

export default FamilyPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const slug = context.params.id as string;
  if ((ROBOTS_BLOCKED_SLUGS as readonly string[]).includes(slug)) {
    context.res.setHeader("X-Robots-Tag", X_ROBOTS_TAG_NOINDEX_VALUE);
  }

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const { data: familyData, errors } = await getFamilyData(slug, features);
  errors.forEach((err) => console.error(err));
  if (familyData === null) return { notFound: true };
  if (!features.debug) delete familyData.debug;

  return {
    props: withEnvConfig({
      ...familyData,
      errors: errors.map((error) => JSON.stringify(error, Object.getOwnPropertyNames(error))),
      features,
      theme,
      themeConfig,
    }),
  };
}) satisfies GetServerSideProps;
