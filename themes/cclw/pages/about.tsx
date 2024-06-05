import Layout from "@components/layouts/Main";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { Acknowledgements } from "@cclw/components/acknowledgements";

const About = () => {
  return (
    <Layout
      title="About"
      description="Climate Change Laws of the World is a database of national-level climate change legislation and policies globally, led by the Grantham Research Institute at LSE."
    >
      <section>
        <div className="container px-4">
          <BreadCrumbs label={"About"} />
          <div className="text-content mb-12">
            <h1 className="my-8">About</h1>
            <p>
              The Climate Change Laws of the World database builds on more than a decade of data collection by the Grantham Research Institute at LSE
              and the Sabin Center at Columbia Law School. The database is powered by machine learning and natural language processing technology
              developed by Climate Policy Radar.
            </p>
            <p>
              Climate Change Laws of the World covers national-level climate change legislation and policies globally. The database covers climate and
              climate-related laws, as well as laws and policies promoting low carbon transitions, which reflects the relevance of climate policy in
              areas including energy, transport, land use, and climate resilience. This database originates from a collaboration between the Grantham
              Research Institute and GLOBE International on a series of Climate Legislation Studies.
            </p>
            <h2>Contribute to our dataset</h2>
            <p>
              We aim for the datasets to be as comprehensive and accurate as possible. However, there is no claim to have identified every relevant
              law, policy or court case in the countries covered. We invite anyone to draw our attention to any information we may have missed or any
              errors or updates to existing data. Please <ExternalLink url="https://form.jotform.com/233294135296359">fill out our form</ExternalLink>{" "}
              or email <ExternalLink url="mailto:gri.cgl@lse.co.uk">gri.cgl@lse.ac.uk</ExternalLink> to contribute.
            </p>
            <p>
              For information about using and referencing the data, please see our <LinkWithQuery href="/terms-of-use">Terms of Use</LinkWithQuery>.
            </p>
          </div>
          <Acknowledgements />
        </div>
      </section>
    </Layout>
  );
};

export default About;
