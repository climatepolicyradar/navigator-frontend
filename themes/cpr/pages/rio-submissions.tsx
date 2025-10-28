import Link from "next/link";

import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";

const RioSubmissions = () => {
  return (
    <>
      <Layout title="Rio Submissions" description="Rio Policy Radar - a shared tool for climate, nature and land" theme="cpr">
        <section className="pt-8 text-content">
          <SingleCol>
            <Heading level={1} extraClasses="mb-6">
              Coming Soon: Rio Policy Radar - a shared tool for climate, nature and land
            </Heading>
            <p>
              It is increasingly being recognised that climate change, biodiversity loss and land degradation are all closely linked and that dealing
              with them as separate issues won't work. However, policymakers face barriers finding information on how these issues are being
              approached, as this information remains siloed in disparate locations, leaving many to make decisions with missing data.
            </p>
            <p>
              To date at Climate Policy Radar we have focused more on climate and climate-related documents but we are now actively broadening our
              horizons.
            </p>
            <p>
              Launching for COP30, <i>Rio Policy Radar</i> will be a shared space for country submissions to the three “Rio” Conventions (adopted at
              the 1992 Rio Earth Summit) - the UNCBD (biodiversity), the UNCCD (land degradation) and the UNFCCC (climate). This tool will allow users
              to easily explore how countries are addressing the three interlinked issues, and their co-benefits, opportunities or trade-offs. For
              example, users will be able to discover how strategies to address nature loss are also addressing climate adaptation, or identify how
              different countries around the world are using nature-based solutions in their drought plans.
            </p>
            <p>
              For this first step we are focusing on national submissions. Going forward we will go deeper, collecting and opening up policies and
              laws that address biodiversity loss, land degradation and climate change.
            </p>
          </SingleCol>
        </section>
      </Layout>
    </>
  );
};

export default RioSubmissions;
