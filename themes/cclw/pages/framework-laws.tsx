import Link from "next/link";

import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { QUERY_PARAMS } from "@/constants/queryParams";

const FrameworkLaws = () => {
  return (
    <Layout
      title="Climate Change Framework Laws"
      description="We assign a number of classifications and categories to laws and policies in the Climate Change Laws of the World database to enhance the usability and searchability of the data."
      theme="cclw"
    >
      <BreadCrumbs label="Climate Change Framework Laws" />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="my-5">
                Climate Change Framework Laws
              </Heading>
              <p>
                We assign a number of classifications and categories to laws and policies in the Climate Change Laws of the World database to enhance
                the usability and searchability of the data. The system of classifications has evolved to remain in step with developments in climate
                governance, the growth of the dataset, and the needs of our user community.
              </p>
              <p>
                We have identified a discrete class of laws which we refer to as <strong>'climate change framework laws'</strong>, a term that is
                applied with increasing frequency by the academic and policy community to laws that share some or all of the following
                characteristics:
              </p>
              <ul>
                <li>Set out the strategic direction of travel for national climate change policy</li>
                <li>Are passed by the legislative branch of government</li>
                <li>Contain national long-term and/or medium targets and/or pathways for change</li>
                <li>Set out institutional arrangements for climate governance at the national level</li>
                <li>Are multi-sectoral in scope</li>
                <li>Involve mechanisms for transparency and/or accountability.</li>
              </ul>
              <p>
                The laws are tagged to indicate the policy response area(s) to which they relate, whether mitigation, adaptation and/or disaster risk
                management.
              </p>
              <Link
                className="button inline-block !text-white !no-underline"
                href={{ pathname: "/search", query: { [QUERY_PARAMS.category]: "laws", [QUERY_PARAMS.framework_laws]: "true" } }}
              >
                Click here to view the list of Framework Laws
              </Link>
              <p>
                If you are interested to learn more about climate change framework laws, the Grantham Research Institute at the London School of
                Economics and others have published or contributed to the following open-access resources:
              </p>
              <ul>
                <li>
                  <strong>What are climate change framework laws?</strong>
                  <ul>
                    <li>
                      Sridhar A, Dubash N, Averchenkova A, Higham C, Rumble C and Gilder A (2022){" "}
                      <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/publication/climate-governance-functions-towards-context-specific-climate-laws/">
                        Climate Governance Functions: Towards Context-Specific Climate Laws
                      </ExternalLink>
                      . London: Centre for Policy Research, Grantham Research Institute on Climate Change and the Environment and Centre for Climate
                      Change Economics and Policy, London School of Economics and Political Science and Climate Legal.
                    </li>
                    <li>
                      Koehl A (2022){" "}
                      <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/explainers/what-is-climate-change-legislation/">
                        What is climate change legislation?
                      </ExternalLink>{" "}
                      London: Grantham Research Institute on Climate Change and the Environment, London School of Economics and Political Science.
                    </li>
                    <li>
                      Higham C, Averchenkova A, Setzer J and Koehl A (2021){" "}
                      <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/publication/accountability-mechanisms-in-climate-change-framework-laws/">
                        Accountability Mechanisms in Climate Change Framework Laws
                      </ExternalLink>
                      . London: Grantham Research Institute on Climate Change and the Environment, London School of Economics and Political Science.
                    </li>
                    <li>
                      <ExternalLink url="https://documents1.worldbank.org/curated/en/267111608646003221/pdf/World-Bank-Reference-Guide-to-Climate-Change-Framework-Legislation.pdf">
                        World Bank Reference Guide to Climate Change Framework Legislation
                      </ExternalLink>{" "}
                      (2020)
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>What are the impacts of climate change framework laws?</strong>
                  <ul>
                    <li>
                      Averchenkova A, Higham C, Chan T, Keuschnigg I (2024){" "}
                      <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/publication/impacts-of-climate-framework-laws/">
                        Impacts of Climate Framework Laws: lessons from Germany, Ireland and New Zealand
                      </ExternalLink>
                      , London: Grantham Research Institute on Climate Change and the Environment, London School of Economics and Political Science.
                    </li>
                    <li>
                      Averchenkova A, Fankhauser S and Finnegan JJ (2021){" "}
                      <ExternalLink url="https://doi.org/10.1080/14693062.2020.1819190">
                        The impact of strategic climate legislation: evidence from expert interviews on the UK Climate Change Act
                      </ExternalLink>
                      . Climate Policy, 21(2), pp.251-263.
                    </li>
                    <li>
                      Averchenkova A and Guzman Luna S (2018){" "}
                      <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/publication/mexicos-general-law-on-climate-change-key-achievements-and-challenges-ahead/">
                        Mexico's General Law on Climate Change: Key achievements and challenges ahead
                      </ExternalLink>
                      . London: Grantham Research Institute on Climate Change and the Environment, London School of Economics and Political Science.
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                We are developing ways for users to better search for climate change framework laws on the database. Please get in touch with the
                Climate Change Laws of the World team with any questions or comments by emailing{" "}
                <ExternalLink url="mailto:gri.cgl@lse.ac.uk">gri.cgl@lse.ac.uk</ExternalLink>. We particularly welcome comments and inputs about the
                content of the database, including climate change framework laws we may have missed. We are a small team, and rely on the
                collaboration of our global stakeholders to support our efforts to keep the database up to date.
              </p>
              <p>
                <em>This page was last updated on 10 December 2024</em>.
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default FrameworkLaws;
