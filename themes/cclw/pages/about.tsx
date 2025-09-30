import Image from "next/image";

import { Acknowledgements } from "@/cclw/components/Acknowledgements";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const About = () => {
  return (
    <Layout
      title="About"
      description="Climate Change Laws of the World is a database of national-level climate change legislation and policies globally, led by the Grantham Research Institute at LSE."
      theme="cclw"
    >
      <BreadCrumbs label={"About"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="mt-5">
                About
              </Heading>
              <div className="mb-12">
                <div>
                  <p>
                    The Climate Change Laws of the World database builds on more than a decade of data collection by the Grantham Research Institute
                    at LSE and the Sabin Center at Columbia Law School. The database is powered by machine learning and natural language processing
                    technology developed by Climate Policy Radar.
                  </p>
                  <p>
                    Climate Change Laws of the World covers national-level climate change legislation and policies globally. The database covers
                    climate and climate-related laws, as well as laws and policies promoting low carbon transitions, which reflects the relevance of
                    climate policy in areas including energy, transport, land use, and climate resilience. This database originates from a
                    collaboration between the Grantham Research Institute and GLOBE International on a series of Climate Legislation Studies.
                  </p>
                  <div className="flex flex-wrap lg:flex-nowrap items-end gap-4 mb-8 xl:gap-8">
                    <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
                      <span className="flex" data-cy="gri-logo">
                        <Image src="/images/cclw/partners/gri-logo.png" alt="Grantham Research Institute logo" width={275} height={52} />
                      </span>
                    </ExternalLink>
                    <ExternalLink className="flex" url="https://www.lse.ac.uk/">
                      <span className="flex" data-cy="lse-logo">
                        <Image src="/images/partners/lse-logo.png" alt="London School of Economics logo" width={51} height={52} />
                      </span>
                    </ExternalLink>
                    <div>
                      <p className="text-sm !m-0">Powered by</p>
                      <ExternalLink className="flex justify-center" url="https://www.climatepolicyradar.org">
                        <span className="flex" data-cy="cpr-logo">
                          <Image src="/images/cclw/partners/cpr-logo.png" alt="Climate Policy Radar logo" width={287} height={52} />
                        </span>
                      </ExternalLink>
                    </div>
                  </div>
                </div>
                <div className="max-w-full overflow-clip">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/rgOHHasg88c?si=t9Lqckm550hA-8lx"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <Heading level={2}>Contribute to our dataset</Heading>
              <p>
                We aim for the datasets to be as comprehensive and accurate as possible. However, there is no claim to have identified every relevant
                law, policy or court case in the countries covered. We invite anyone to draw our attention to any information we may have missed or
                any errors or updates to existing data. Please{" "}
                <ExternalLink url="https://form.jotform.com/233294135296359">fill out our form</ExternalLink> or email{" "}
                <ExternalLink url="mailto:gri.cgl@lse.ac.uk">gri.cgl@lse.ac.uk</ExternalLink> to contribute.
              </p>
              <p>
                For information about using and referencing the data, please see our <LinkWithQuery href="/terms-of-use">Terms of Use</LinkWithQuery>.
              </p>
            </div>
            <Acknowledgements />
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default About;
