import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { Divider } from "@/components/dividers/Divider";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const Contact = () => {
  return (
    <Layout
      title="Contact"
      description="If you have questions or comments about the content of the database, use this page to get in touch with our team."
    >
      <BreadCrumbs label={"Contact"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12 color-text-primary">
              <Heading level={1} extraClasses="my-5">
                Contact
              </Heading>
              <p>
                If you would like to receive monthly updates to our climate litigation database, please subscribe to our{" "}
                <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">newsletter</ExternalLink>.
              </p>
              <p>
                For general enquiries or to submit updates or corrections, please get in touch with the Climate Litigation Database team by emailing{" "}
                <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink> or filling in{" "}
                <ExternalLink url="https://form.jotform.com/252302964707357">this</ExternalLink> contact form.
              </p>
              <p>
                Want to help us make the website better? Share your thoughts with the website team by filling out{" "}
                <ExternalLink url="https://form.jotform.com/252292443502350">this</ExternalLink> feedback form.
              </p>
              <div className="mt-8">
                <Divider />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <ExternalLink url="https://climate.law.columbia.edu/" className="color-text-tertiary hover:color-text-quaternary">
                    The Sabin Center for Climate Change Law
                  </ExternalLink>
                  <address className="color-text-secondary space-y-1">
                    Columbia Law School
                    <br />
                    435 West 116th Street
                    <br />
                    New York, NY 10027
                    <br />
                    United States
                  </address>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="font-semibold color-text-secondary min-w-[60px]">Phone:</span>
                      <a href="tel:+12128548213" className="color-text-tertiary hover:color-text-quaternary underline ml-2">
                        +1 212-854-8213
                      </a>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold color-text-secondary min-w-[60px]">Fax:</span>
                      <a href="tel:+12128547946" className="color-text-tertiary hover:color-text-quaternary underline ml-2">
                        +1 212-854-7946
                      </a>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold color-text-secondary min-w-[60px]">Email:</span>
                      <a
                        href="mailto:manager@climatecasechart.com"
                        className="color-text-tertiary hover:color-text-quaternary underline ml-2 break-all"
                      >
                        manager@climatecasechart.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default Contact;
