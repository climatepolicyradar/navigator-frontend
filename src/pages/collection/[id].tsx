import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { LuFileStack } from "react-icons/lu";

import { ApiClient } from "@/api/http-common";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import { MultiCol } from "@/components/panels/MultiCol";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";
import { TCollection, TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled } from "@/utils/features";

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const id = context.params.id;
  const client = new ApiClient(process.env.BACKEND_API_URL);

  if (!isLitigationEnabled(featureFlags)) {
    return { notFound: true };
  }

  let collection: TCollection;

  try {
    const { data: returnedData } = await client.get(`/collections/${id}`);
    collection = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }

  if (!collection) {
    return { notFound: true };
  }

  return {
    props: {
      collection,
      theme,
    },
  };
};

type TProps = {
  collection: TCollection;
  theme: TTheme;
};

const CollectionPage: InferGetStaticPropsType<typeof getServerSideProps> = ({ collection, theme }: TProps) => {
  const { families } = collection;
  const breadcrumbCategory = { label: "Search results", href: "/search" };

  return (
    <Layout title={collection.title} description={collection.description} theme={theme}>
      <section className="mb-8">
        <SubNav>
          <BreadCrumbs category={breadcrumbCategory} label={collection.title} />
        </SubNav>
        <MultiCol>
          <SingleCol extraClasses={`mt-8 px-5 w-full`}>
            <Heading level={1}>{collection.title}</Heading>
            <div className="flex flex-wrap text-sm gap-1 mt-2 items-center middot-between" data-cy="family-metadata">
              Collection
            </div>
            <section className="mt-6">
              <div className="text-content">{collection.description}</div>
            </section>

            {families.length > 0 && (
              <section className="mt-10">
                <Heading level={2}>Documents</Heading>
                {families.map((family) => (
                  <a
                    key={family.slug}
                    href={`/document/${family.slug}`}
                    className="family-document group mt-4 p-4 rounded-lg border bg-gray-25 border-gray-100 shadow-xs transition duration-300 flex flex-no-wrap cursor-pointer hover:border-blue-100 hover:bg-gray-50"
                  >
                    <div className="flex-0 mr-2 hidden md:block">
                      <LuFileStack size="20" className="mt-0.5 text-text-brand" />
                    </div>
                    <div className="flex-1">
                      <span dangerouslySetInnerHTML={{ __html: family.title }} />
                    </div>
                  </a>
                ))}
              </section>
            )}
          </SingleCol>
        </MultiCol>
      </section>
    </Layout>
  );
};

export default CollectionPage;
