import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const TermsOfUse = () => {
  return (
    <Layout title="Terms of use" theme="mcf">
      <BreadCrumbs label={"Terms of use"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div>
              <Heading level={1} extraClasses="my-5 custom-header">
                Terms of use
              </Heading>
              <Heading level={2} extraClasses="custom-header">
                Introduction
              </Heading>
              <div className="text-content mb-12">
                <p>
                  Welcome to Climate Project Explorer, a platform from the four Multilateral Climate Funds (MCFs) - Adaptation Fund (AF), Funds (CIF),
                  Global Environment Facility (GEF) and Green Climate Fund (GCF), in partnership with Climate Policy Radar CIC (“CPR”).The following
                  Terms govern the use of the CPR Database, the CPR App infrastructure, the Climate Project Explorer and data from the MCFs published
                  in the App.
                </p>
                <p>
                  The CPR Database and App are operated by <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar CIC</ExternalLink>{" "}
                  ("CPR"). The MCF App is operated by CPR using data supplied by the MCFs, and is hosted at
                  <ExternalLink url="https://climateprojectexplorer.org"> https://climateprojectexplorer.org</ExternalLink>.
                </p>
                <p>
                  To access the methodology, code book, and third party data providers for the CPR Database, see the Terms & Conditions of each of the
                  MCFs in the table below (see ‘Data from Third Party Sources’).
                </p>
              </div>

              <Heading level={2} extraClasses="custom-header">
                Using the CPR Database and App
              </Heading>
              <div className="text-content mb-12">
                <ul>
                  <li>
                    Climate Policy Radar actively encourages and supports the use of information from the CPR Database and App via the CCLW Interface
                    for a wide range of purposes.
                  </li>
                  <li>
                    Climate Policy Radar, its collaborators, licensors, or authorised contributors to the CPR Database and App own the copyright,
                    database right and all other intellectual property rights (whether registered or unregistered and anywhere in the world) in the
                    selection, coordination, arrangement and enhancement of the CPR Database and App, as well as in the content original to it.
                  </li>
                </ul>
              </div>
              <Heading level={2} extraClasses="custom-header">
                Open data under the CC-BY Licence
              </Heading>
              <div className="text-content mb-12">
                <ul>
                  <li>
                    Climate Policy Radar is pleased to make the content of the CPR Database available as open data under the Creative Commons
                    Attribution Licence 
                    <ExternalLink url="https://creativecommons.org/licenses/by/4.0/">(CC-BY)</ExternalLink>. Under this Creative Commons licence you
                    are free to:
                    <ul>
                      <li>
                        <span className="font-medium">Adapt</span> — remix, transform, and build upon the material
                      </li>
                      <li>
                        <span className="font-medium">Share</span> — copy and redistribute the CPR material in any medium or format{" "}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">Licence terms</span>: Climate Policy Radar will not revoke these freedoms as long as you follow the
                    license terms - see <ExternalLink url="https://creativecommons.org/licenses/by/4.0/legalcode">full legal code</ExternalLink>,
                    which include but are not limited to these key issues:
                    <ul>
                      <li>
                        <span className="font-medium">Attribution</span>: You must give CPR and its partners{" "}
                        <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">appropriate credit</ExternalLink>, provide a link to the
                        license, and <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">indicate if changes were made</ExternalLink>.
                        You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. See suggested
                        citation below.
                      </li>
                      <li>
                        <span className="font-medium">No additional restrictions</span>: You may not apply legal terms or{" "}
                        <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">technological measures</ExternalLink> that legally restrict
                        others from doing anything the license permits.
                      </li>
                      <li>
                        <span className="font-medium">Exemptions and Limitations</span>: You do not have to comply with the license for elements of
                        the material in the public domain or where your use is permitted by an applicable{" "}
                        <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">exception or limitation</ExternalLink>.
                      </li>
                      <li>
                        <span className="font-medium">No warranties</span>: The license may not give you all of the permissions necessary for your
                        intended use. For example, other rights such as{" "}
                        <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">publicity, privacy, or moral rights</ExternalLink> may limit
                        how you use the material.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <Heading level={2} extraClasses="custom-header">
                Recommended citation
              </Heading>
              <div className="text-content mb-12">
                <ul>
                  <li>
                    <p>When citing use of the Database, you may use this text:</p>
                    <p className="italic">
                      "Sourced from the Climate Project Explorer, https://climateprojectexplorer.org, and made available under the Creative Commons
                      CC-BY licence. The data in this database was sourced primarily from the Multilateral Climate Funds, and is published by Climate
                      Policy Radar."
                    </p>
                  </li>
                  <li>
                    <p>When citing a specific data point(s), for example, if citing a summary of a document, please use the following citation:</p>
                    <p className="italic">
                      “This summary was provided by the Multilateral Climate Funds, sourced from [name of individual fund], and made available under
                      and under the Creative Commons CC-BY licence”
                    </p>
                  </li>
                </ul>
              </div>
              <Heading level={2} extraClasses="custom-header">
                Commercial Licensing
              </Heading>
              <p className="text-content mb-12">
                If you wish to use, copy, redistribute, publish, or exploit a substantial amount of the information from the CPR Database for
                commercial purposes, please contact us by emailing{" "}
                <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink> to discuss the best way to
                address your specific needs.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Disclaimer
              </Heading>
              <div className="text-content mb-12">
                <ul>
                  <li>
                    Climate Policy Radar gives no warranty or assurance about the content of the CPR Database. As the CPR Database is under constant
                    development, its contents may be incorrect or out-of-date. It is subject to change without notice. While Climate Policy Radar
                    makes every effort to ensure that the content of the CPR Database is accurate, CPR cannot accept liability for the accuracy of its
                    content at any given point in time. Any reliance on the information on the CPR Database is at your own risk.
                  </li>
                  <li>
                    The content in the CPR database, including any third party data, does not constitute legal advice. No warranty of accuracy or
                    completeness is made.
                  </li>
                </ul>
              </div>
              <Heading level={2} extraClasses="custom-header">
                Our trade marks
              </Heading>
              <p className="text-content mb-12">
                "Climate Policy Radar” and its associated logo are unregistered trade marks of Climate Policy Radar CIC. The use of these trade marks
                is strictly prohibited unless you have our prior written permission.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Links to other sites
              </Heading>
              <p className="text-content mb-12">
                The CPR Database and App may contain links to third-party sites that are not owned or controlled by Climate Policy Radar. Climate
                Policy Radar has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party
                sites or services. Climate Policy Radar strongly advises you to read the terms and conditions and privacy policy of any third-party
                site that you visit.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Data from Third Party Sources
              </Heading>
              <div className="text-content mb-12">
                <p>
                  The Climate Project Explorer contains data provided by the MCFs. The data includes document summaries that were written by third
                  parties and/or information about the documents (”meta-data”) assigned by third parties, e.g. classifications to sector or legal
                  principle.
                </p>
                <p>
                  Data that are sourced from third parties are clearly marked on the CPR Database and App. Climate Policy Radar strongly advises you
                  to read the terms and conditions and privacy policy of any third-party data providers, noting they change from time to time. Below
                  are listed data sources for third party data on the CPR Database and App:
                </p>
                <table className="text-left">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Data</th>
                      <th>Date first added</th>
                      <th>Third party terms and conditions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <ExternalLink url="https://www.adaptation-fund.org/">https://www.adaptation-fund.org/</ExternalLink>
                      </td>
                      <td>Adaptation Fund (AF) projects and guidance</td>
                      <td>November 2024</td>
                      <td>
                        <ExternalLink url="https://www.adaptation-fund.org/legal/">Terms and Conditions</ExternalLink> <br />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <ExternalLink url="https://www.cif.org/">https://www.cif.org/</ExternalLink>
                      </td>
                      <td>Climate Investment Funds (CIF) projects and guidance</td>
                      <td>November 2024</td>
                      <td>
                        <ExternalLink url="https://www.cif.org/disclaimer">Disclaimer</ExternalLink>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <ExternalLink url="https://www.greenclimate.fund/">https://www.greenclimate.fund/</ExternalLink>
                      </td>
                      <td>Green Climate Fund (GCF) projects and guidance</td>
                      <td>November 2024</td>
                      <td>
                        <ExternalLink url="https://www.greenclimate.fund/terms-and-conditions">Terms and Conditions</ExternalLink>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <ExternalLink url="https://www.thegef.org/">https://www.thegef.org/</ExternalLink>
                      </td>
                      <td>Global Environment Facility (GEF) projects and guidance</td>
                      <td>November 2024</td>
                      <td>
                        <ExternalLink url="https://www.thegef.org/legal">Terms and Conditions</ExternalLink>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Heading level={2} extraClasses="custom-header">
                Changes To This Agreement
              </Heading>
              <p className="text-content mb-12">
                Climate Policy Radar reserves the right, at our sole discretion, to modify or replace these Terms of Use by posting the updated terms
                on the site. Your continued use of the site after any such changes constitutes your acceptance of the new Terms of Use. <br /> <br />{" "}
                Please review this Agreement periodically for changes. If you disagree with it, or any future changes,do not use, access or continue
                to access the site, and discontinue any use of the Site immediately.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Questions?
              </Heading>
              <p className="text-content mb-12">
                If you have any questions about this agreement, please contact us by
                <ExternalLink url="https://form.jotform.com/242902819253357"> filling out our form</ExternalLink>.
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default TermsOfUse;
