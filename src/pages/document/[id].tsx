import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { getFamilyData } from "@/bff/methods/getFamilyData";
import { FamilyPage as FamilyPageUI } from "@/components/pages/familyPage";
import { withEnvConfig } from "@/context/EnvConfig";
import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

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

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const { data: familyData, errors } = await getFamilyData(slug, features);
  errors.forEach(console.error); // eslint-disable-line no-console
  if (familyData === null) return { notFound: true };

  return {
    props: withEnvConfig({
      ...familyData,
      features,
      theme,
      themeConfig,
    }),
  };
}) satisfies GetServerSideProps;
