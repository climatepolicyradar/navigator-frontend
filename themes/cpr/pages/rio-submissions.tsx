import Link from "next/link";

import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";

const RioSubmissions = () => {
  return (
    <>
      <Layout title="Rio Submissions" description="" theme="cpr">
        <section className="pt-8 text-content">
          <SingleCol>
            <Heading level={1} extraClasses="mb-6">
              COMING SOON: Rio Policy Radar - a shared tool for climate, nature and land
            </Heading>
            <p>
              Increasingly, policymakers working across environmental issues need to make informed decisions that straddle climate, biodiversity and
              land use. But national policy information on these remains siloed in disparate locations, leaving many to make decisions with missing
              data.
            </p>
            <p>
              Currently, our Climate Policy Radar tool houses all national <Link href="/search?c=UNFCCC">UNFCCC submissions</Link>. However, CPR will
              soon become a shared space for submissions from the two other "Rio Conventions" - the CBD (biodiversity) and the UNCCD (land
              degradation).
            </p>
            <p>
              Launching at COP30, <i>Rio Policy Radar</i> will allow users to readily explore synergies amongst national plans that address the three
              interlinked issues. For example, users will be able to discover how strategies to address nature loss are also addressing climate
              adaptation, or identify how different countries around the world are using nature-based solutions in their drought plans.
            </p>
            <p>
              CPR will continue to expand this collection to bring in historical submissions, other relevant planning documents and eventually
              sub-national documents.
            </p>
            <p>More information will be added to this site soon.</p>
          </SingleCol>
        </section>
      </Layout>
    </>
  );
};

export default RioSubmissions;
