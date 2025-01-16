import Layout from "@components/layouts/Main";
import { SiteWidth } from "@components/panels/SiteWidth";
import { SingleCol } from "@components/panels/SingleCol";
import { SubNav } from "@components/nav/SubNav";

import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { Heading } from "@components/typography/Heading";

const OceanEnergyPathwayPage = () => {
  return (
    <Layout title="Ocean Energy Pathway">
      <SubNav>
        <BreadCrumbs label={"Ocean Energy Pathway"} />
      </SubNav>
      <section>
        <SiteWidth>
          <SingleCol extraClasses="mt-8">
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="mb-5">
                Ocean Energy Pathway
              </Heading>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default OceanEnergyPathwayPage;
