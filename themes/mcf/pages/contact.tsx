import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const Contact = () => {
  return (
    <Layout
      title="Contact"
      description="Get in touch with us for inquiries, support, or feedback regarding our climate change resources and initiatives."
      theme="mcf"
    >
      <BreadCrumbs label={"Contact us"} />
      <section className="pt-8">
        <SiteWidth>
          <SingleCol>
            <Heading level={1} extraClasses="custom-header">
              Contact
            </Heading>
            <div className="text-content mb-12">
              <p>
                If you have any questions or need further information, don't hesitate to reach out to us by{" "}
                <ExternalLink className="text-blue-600 underline hover:text-blue-800" url="https://form.jotform.com/242955027856365">
                  filling out this form
                </ExternalLink>
                .
              </p>
              <p>For more details on global climate initiatives, please explore the following resources:</p>
              <p>
                <ExternalLink className="text-blue-600 underline hover:text-blue-800" url="https://www.adaptation-fund.org/">
                  Adaptation Fund
                </ExternalLink>{" "}
                <br />
                <ExternalLink className="text-blue-600 underline hover:text-blue-800" url="https://www.cif.org/">
                  Climate Investment Funds
                </ExternalLink>
                <br />
                <ExternalLink className="text-blue-600 underline hover:text-blue-800" url="https://www.thegef.org/">
                  Global Environment Facility
                </ExternalLink>
                <br />
                <ExternalLink className="text-blue-600 underline hover:text-blue-800" url="https://www.greenclimate.fund/">
                  Green Climate Fund
                </ExternalLink>
                <br />
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default Contact;
