import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { systemGeoNames } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  foo: boolean;
}

export const GeographyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ foo }: IProps) => {
  return <div />;
};

export default GeographyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  const countryId = context.params.country;

  if (!isLitigationEnabled(featureFlags, themeConfig) || systemGeoNames.includes(countryId as string)) {
    return { notFound: true };
  }

  const backendApiClient = new ApiClient(process.env.BACKEND_API_URL);
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  return {
    props: withEnvConfig({
      foo: true,
    }),
  };
};
