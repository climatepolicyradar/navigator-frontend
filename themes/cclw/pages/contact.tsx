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
      description="If you have questions or comments about the content of the database, use this page to get in touch with our team."
      theme="cclw"
    >
      <BreadCrumbs label={"Contact"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="my-5">
                Contact
              </Heading>
              <p>
                Please get in touch with the Climate Change Laws of the World team with any questions or comments by emailing{" "}
                <ExternalLink url="mailto:gri.cgl@lse.ac.uk">gri.cgl@lse.ac.uk</ExternalLink>
              </p>
              <p>
                We particularly welcome comments and inputs about the content of the database, including laws and policies we may have missed. We are
                a small team, and rely on the collaboration of our global stakeholders to support our efforts to keep the database up to date.
              </p>
              <Heading level={2}>Correspondence address, telephone number and email</Heading>
              <p>As many of our staff regularly work remotely, the best way to contact us is by email.</p>
              <div className="md:grid grid-cols-2 mb-6">
                <address>
                  LSE Houghton Street
                  <br />
                  London
                  <br />
                  WC2A 2AE
                  <br />
                  UK
                </address>
                <div>
                  <p>
                    <ExternalLink url="tel:+44 (0)20 7107 5865">+44 (0)20 7107 5865</ExternalLink>
                  </p>
                  <p>
                    Email for general enquiries: <ExternalLink url="mailto:Gri@lse.ac.uk">Gri@lse.ac.uk</ExternalLink>
                  </p>
                </div>
              </div>
              <Heading level={2}>Media enquiries</Heading>
              <p>
                <ExternalLink url="tel:+44 (0)20 7107 5442">+44 (0)20 7107 5442</ExternalLink>
              </p>
              <p>
                Email: <ExternalLink url="mailto:gri.cgl@lse.ac.uk">gri.cgl@lse.ac.uk</ExternalLink>
              </p>
              <Heading level={2}>Finding specific contact information</Heading>
              <p>
                For details of individual staff members working at the Grantham Research Institute check our{" "}
                <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/people/institute-staff/">staff directory.</ExternalLink>
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default Contact;
