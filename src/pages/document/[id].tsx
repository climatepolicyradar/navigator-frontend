import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { FamilyPage as FamilyPageUI } from "@/components/pages/familyPage";
import { withEnvConfig } from "@/context/EnvConfig";
import { TTheme, TFamilyPresentationalResponse, TFamilyPresentationalData } from "@/types";
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

  const slug = context.params.id;

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  /* eslint-disable no-console */
  let familyData: TFamilyPresentationalData | null = null;
  try {
    const { data: response, status } = await axios.get<TFamilyPresentationalResponse>(`/api/family/${slug}`);

    if (status !== 200) {
      console.error("Failed to fetch family data from Next API endpoint. HTTP code: " + status);
      return { notFound: true };
    }
    response.errors.forEach(console.error);
    familyData = response.data;
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
  if (familyData === null) return { notFound: true };
  /* eslint-enable no-console */

  return {
    props: withEnvConfig({
      ...familyData,
      features,
      theme,
      themeConfig,
    }),
  };
}) satisfies GetServerSideProps;
