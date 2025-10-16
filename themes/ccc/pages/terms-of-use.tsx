import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const TermsOfUse = () => {
  return (
    <Layout title="Terms of use" theme="ccc">
      <BreadCrumbs label={"Terms of use"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="my-5">
                Terms of use
              </Heading>
              <Heading level={2}>Introduction</Heading>
              <p>Welcome to the Climate Litigation Database.</p>
              <p>The following Terms govern the use of the Climate Litigation Database (Formerly “Climate Case Chart”).</p>
              <p>
                The Climate Litigation Database content is authored and curated by the Sabin Center for Climate Change Law ("Sabin Center"), and is
                hosted at <ExternalLink url="https://climatecasechart.com/">https://climatecasechart.com/</ExternalLink>. The application
                infrastructure and interface that presents this content are operated by Climate Policy Radar CIC (CPR).
              </p>
              <p>
                To access the Sabin Center’s methodology, see{" "}
                <ExternalLink url="https://www.climatecasechart.com/methodology">https://www.climatecasechart.com/methodology</ExternalLink>.
              </p>
              <p>
                To access the CPR methodology, see{" "}
                <ExternalLink url="https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md">
                  https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md
                </ExternalLink>
                .
              </p>
              <Heading level={2} extraClasses="mt-4">
                Using the Climate Litigation Database Interface
              </Heading>
              <p>
                The Sabin Center and Climate Policy Radar actively encourage and support the use of information from the Climate Litigation Database
                for a wide range of public-interest purposes.
              </p>
              <p>
                The Sabin Center retains all rights over the case summaries and metadata it authors. Climate Policy Radar retains rights to the
                application infrastructure, including the design, filters, search tools, and any value-added enhancements it provides.
              </p>
              <Heading level={3} extraClasses="mt-4">
                Open Data under Creative Commons Attribution (CC-BY) Licence
              </Heading>
              <p>This database and its interface are available under the Creative Commons Attribution (CC-BY 4.0) licence.</p>
              <p>
                Full legal code:{" "}
                <ExternalLink url="https://creativecommons.org/licenses/by/4.0/legalcode">
                  https://creativecommons.org/licenses/by/4.0/legalcode
                </ExternalLink>
              </p>
              <p>
                Plain-language summary:{" "}
                <ExternalLink url="https://creativecommons.org/licenses/by/4.0/">https://creativecommons.org/licenses/by/4.0/</ExternalLink>
              </p>
              <p>Under this licence, you are free to:</p>
              <ul>
                <li>
                  <span className="font-medium">Share</span> — copy and redistribute the material in any medium or format
                </li>
                <li>
                  <span className="font-medium">Adapt</span> — remix, transform, and build upon the material for any purpose
                </li>
              </ul>
              <p>As long as you follow these terms:</p>
              <ul>
                <li>
                  <span className="font-medium">Attribution</span> — you must give appropriate credit to the Sabin Center and CPR, provide a link to
                  the licence, and indicate if changes were made.
                </li>
                <li>
                  <span className="font-medium">No implied endorsement</span> — your use of the material must not suggest that the Sabin Center or CPR
                  endorses you, your use, or your product.
                </li>
                <li>
                  <span className="font-medium">No additional restrictions</span> — you may not apply legal terms or technological measures that
                  legally restrict others from doing anything the licence permits.
                </li>
              </ul>
              <p>
                For the avoidance of doubt: nothing in this licence affects rights such as privacy, publicity, or moral rights that may limit how you
                use the material.
              </p>
              <Heading level={3} extraClasses="mt-4">
                Recommended Citations
              </Heading>
              <ul>
                <li>General use:</li>
                <p>"Data provided by the Sabin Center for Climate Change Law. Platform operated by Climate Policy Radar."</p>
                <li>Specific content:</li>
                <p>"This summary is from the Sabin Center’s Climate Litigation Database. Platform enhancements provided by Climate Policy Radar."</p>
              </ul>
              <p>
                CPR may, in the future, make additional enhancements (e.g., APIs, knowledge graph embeddings, or other AI-driven annotations)
                available under separate terms, which may differ from CC-BY.
              </p>
              <p>
                If you wish to use, copy, redistribute, publish, or exploit a substantial amount of the information from the Climate Litigation
                Database for commercial purposes, please contact us by emailing partners@climatepolicyradar.org and manager@climatecasechart.com to
                discuss the best way to address your specific needs.
              </p>
              <Heading level={2} extraClasses="mt-4">
                Disclaimer
              </Heading>
              <p>
                The Sabin Center and Climate Policy Radar give no warranty or assurance about the accuracy or completeness of the database or
                interface. Content may change at any time. Use is at your own risk and does not constitute legal advice.
              </p>
              <Heading level={2} extraClasses="mt-4">
                Trademarks
              </Heading>
              <p>
                "Climate Policy Radar" and its associated logo are unregistered trademarks of Climate Policy Radar CIC. Their use is prohibited
                without prior written permission.
              </p>
              <Heading level={2} extraClasses="mt-4">
                Links to Other Sites
              </Heading>
              <p>This platform may contain links to third-party sites. CPR is not responsible for their content or policies.</p>
              <Heading level={2} extraClasses="mt-4">
                Changes to These Terms
              </Heading>
              <p>These Terms may be updated from time to time. Continued use of the platform constitutes acceptance of the current Terms.</p>
              <Heading level={2} extraClasses="mt-4">
                Questions?
              </Heading>
              <p>Contact: manager@climatecasechart.com and partners@climatepolicyradar.org</p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default TermsOfUse;
