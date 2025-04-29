import { ApiClient } from "@/api/http-common";
import { withEnvConfig } from "@/context/EnvConfig";
import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { GetServerSideProps, InferGetStaticPropsType } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = await getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const id = context.params.id;
  const client = new ApiClient(process.env.BACKEND_API_URL);

  // if (!featureFlags["litigation"]) {
  //   return { notFound: true };
  // }

  try {
    const { data: returnedData } = await client.get(`/collections/${id}`);
    console.log({ returnedData });
  } catch (error) {
    // TODO: handle error more elegantly
  }

  return {
    props: withEnvConfig({
      id: `${id}`, // TODO remove
      theme,
    }),
  };
};

type TProps = {
  id: string; // TODO remove
  theme: TTheme;
};

const CollectionPage: InferGetStaticPropsType<typeof getServerSideProps> = ({ id, theme }: TProps) => (
  <div>
    <h1>Collection</h1>
    <p>ID: {id}</p>
    <p>Theme: {theme}</p>
  </div>
);

export default CollectionPage;
