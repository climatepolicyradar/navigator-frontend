import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const TermsOfUse = () => {
  return (
    <Layout title="Terms of use" theme="cpr">
      <BreadCrumbs label={"Terms of use"} />
      <section>
        <SiteWidth>
          <SingleCol extraClasses="mt-8">
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="mb-5">
                Terms of use
              </Heading>
              <Heading level={2}>Introduction</Heading>
              <p>Welcome to Climate Policy Radar, a leading resource on global climate law and policy. </p>
              <p>
                This website provides a user interface for the Climate Policy Radar Database and the Climate Policy Radar Application ("CPR Database
                and App"). The CPR Database builds on over a decade of work at the Grantham Research Institute to provide data and insights on climate
                change law and policy worldwide to support informed and ambitious climate change policymaking and research. The work is underpinned by
                a partnership between the Grantham Research Institute at the London School of Economics and Climate Policy Radar.
              </p>
              <p>
                The following Terms govern the use of the CPR Database and App and the ‘Climate Change Laws of the World’ interface for the Climate
                Policy Radar App (”CCLW Interface”).
              </p>
              <p>
                The CPR Database and App are operated by <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar CIC</ExternalLink>{" "}
                ("CPR"). The CCLW Interface is jointly operated by CPR and the Grantham Research Institute on Climate Change and the Environment at
                the London School of Economics (”GRI”), and hosted at{" "}
                <ExternalLink url="https://climate-laws.org/">https://climate-laws.org</ExternalLink>.
              </p>
              <p>
                To access the methodology and code book for the CPR Database and its third party data providers, please{" "}
                <ExternalLink url="https://github.com/climatepolicyradar/methodology">click here</ExternalLink>.
              </p>
              <Heading level={2}>Using the CPR Database and App</Heading>
              <ul>
                <li>
                  Climate Policy Radar actively encourages and supports the use of information from the CPR Database and App for a wide range of
                  purposes.
                </li>
                <li>
                  Climate Policy Radar, its collaborators, licensors, or authorised contributors to the CPR Database and App own the copyright,
                  database right and all other intellectual property rights (whether registered or unregistered and anywhere in the world) in the
                  selection, coordination, arrangement and enhancement of the CPR Database and App, as well as in the content original to it.
                </li>
              </ul>
              <Heading level={3}>Open data under the CC-BY Licence</Heading>
              <ul>
                <li>
                  Climate Policy Radar is pleased to make the content of the CPR Database available as open data under the Creative Commons
                  Attribution Licence 
                  <ExternalLink url="https://creativecommons.org/licenses/by/4.0/">(CC-BY)</ExternalLink>. Under this Creative Commons licence you are
                  free to:
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
                  license terms - see <ExternalLink url="https://creativecommons.org/licenses/by/4.0/legalcode">full legal code</ExternalLink>, which
                  include but are not limited to these key issues:
                  <ul>
                    <li>
                      <span className="font-medium">Attribution</span>: You must give CPR and its partners{" "}
                      <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">appropriate credit</ExternalLink>, provide a link to the
                      license, and <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">indicate if changes were made</ExternalLink>. You
                      may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. See suggested
                      citation below.
                    </li>
                    <li>
                      <span className="font-medium">No additional restrictions</span>: You may not apply legal terms or{" "}
                      <ExternalLink url="https://creativecommons.org/licenses/by/4.0/#">technological measures</ExternalLink> that legally restrict
                      others from doing anything the license permits.
                    </li>
                    <li>
                      <span className="font-medium">Exemptions and Limitations</span>: You do not have to comply with the license for elements of the
                      material in the public domain or where your use is permitted by an applicable{" "}
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
              <Heading level={3}>Recommended citation</Heading>
              <ul>
                <li>
                  <p>When citing use of the Database, you may use this text:</p>
                  <p className="italic">
                    "Sourced from the Climate Policy Radar Database, https://app.climatepolicyradar.org and made available under the Creative Commons
                    CC-BY licence. The data in this database was sourced primarily from the Grantham Research Institute at the London School of
                    Economics."
                  </p>
                </li>

                <li>
                  <p>
                    When citing a specific data point(s) (for example, if citing a summary of a document), please refer to Terms and Conditions by our{" "}
                    <a href="/terms-of-use#data-from-third-party-sources">third party data providers</a>.
                  </p>
                </li>
              </ul>

              <Heading level={2}>Commercial Licensing</Heading>
              <p>
                If you wish to use, copy, redistribute, publish, or exploit a substantial amount of the information from the CPR Database for
                commercial purposes, please contact us by emailing{" "}
                <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink> to discuss the best way to
                address your specific needs.
              </p>
              <Heading level={2}>Disclaimer</Heading>
              <ul>
                <li>
                  Climate Policy Radar gives no warranty or assurance about the content of the CPR Database. As the CPR Database is under constant
                  development its contents may be incorrect or out-of-date and are subject to change without notice. While Climate Policy Radar makes
                  every effort to ensure that the content of the CPR Database is accurate, CPR cannot accept liability for the accuracy of its content
                  at any given point in time. Any reliance that you may place on the information on the CPR Database is at your own risk.
                </li>
                <li>
                  The content in the CPR database, including any third party data, does not constitute legal advice. No warranty of accuracy or
                  completeness is made.
                </li>
                <li>
                  If you identify incomplete or inaccurate information please let us know by{" "}
                  <ExternalLink url="https://form.jotform.com/233294135296359">filling this form</ExternalLink> and Climate Policy Radar will
                  endeavour to complete or correct it, as soon as practicable.
                </li>
              </ul>
              <Heading level={2}>Our trade marks</Heading>
              <p>
                "Climate Policy Radar” and its associated logo are unregistered trade marks of Climate Policy Radar CIC. The use of these trade marks
                is strictly prohibited unless you have our prior written permission.
              </p>
              <Heading level={2}>Links to other sites</Heading>
              <p>
                The CPR Database and App may contain links to third-party sites that are not owned or controlled by Climate Policy Radar. Climate
                Policy Radar has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party
                sites or services. Climate Policy Radar strongly advises you to read the terms and conditions and privacy policy of any third-party
                site that you visit.
              </p>
              <Heading level={3} id="data-from-third-party-sources">
                Data from Third Party Sources
              </Heading>
              <p>
                The CPR Database and App contains data that were created by third parties. The data includes document summaries that were written by
                third parties and/or information about the documents (”meta-data”) assigned by third parties, e.g. classifications to sector or legal
                principle.
              </p>
              <p>
                Data that are sourced from third parties are clearly marked on the CPR Database and App. Climate Policy Radar strongly advises you to
                read the terms and conditions and privacy policy of any third-party data providers, noting they change from time to time. Below are
                listed data sources for third party data on the CPR Database and App:
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
                    <td>Grantham Research Institute, LSE</td>
                    <td>Law and policy document summaries; selected document metadata</td>
                    <td>October 2022</td>
                    <td>
                      <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/cclw-terms-and-conditions">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://unfccc.int/topics/global-stocktake/information-portal?field_document_topic_target_id=All&field_document_type_target_id=4174&field_calculated_author_type_target_id=All&field_document_ca_target_id=">
                        Global Stocktake Information Portal
                      </ExternalLink>
                    </td>
                    <td>Submissions to the first Global Stocktake by parties and non-Party stakeholders </td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://unfccc.int/this-site/terms-of-use">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://unfccc.int/NDCREG">NDC Registry</ExternalLink>
                    </td>
                    <td>Nationally Determined Contributions</td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://unfccc.int/this-site/terms-of-use">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://unfccc.int/ACR">Adaptation Communications Registry</ExternalLink>
                    </td>
                    <td>Adaptation Communications</td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://unfccc.int/this-site/terms-of-use">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://napcentral.org/submitted-naps">NAP Central Portal</ExternalLink>
                    </td>
                    <td>National Adaptation Plans</td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://unfccc.int/this-site/terms-of-use">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://unfccc.int/ttclear/tna/reports.html">TNA Portal</ExternalLink>
                    </td>
                    <td>Technology Needs Assessments</td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://unfccc.int/this-site/terms-of-use">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://unfccc.int/climatefinance?submissions">Fast-Start Finance Country Reports</ExternalLink>
                    </td>
                    <td>Country Finance reports</td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://unfccc.int/this-site/terms-of-use">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.ipcc.ch/reports/">IPCC Website</ExternalLink>
                    </td>
                    <td>IPCC reports from 2015</td>
                    <td>23 May 2023</td>
                    <td>
                      <ExternalLink url="https://www.ipcc.ch/copyright/">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://climatepolicydatabase.org/">Climate Policy Database</ExternalLink>
                    </td>
                    <td>
                      Law and Policy document curation and summaries; document metadata from Climate Policy Database has been adapted by Climate
                      Policy Radar and the Grantham Research Institute LSE
                    </td>
                    <td>04 July 2024</td>
                    <td>
                      <ExternalLink url="https://newclimate.org/about-us/legal-notice">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.adaptation-fund.org/">Adaption Fund</ExternalLink>
                    </td>
                    <td>Adaptation Fund (AF) projects and guidance</td>
                    <td>November 2024</td>
                    <td>
                      <ExternalLink url="https://www.adaptation-fund.org/legal/">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.cif.org/">Climate Investment Funds</ExternalLink>
                    </td>
                    <td>Climate Investment Funds (CIF) projects and guidance</td>
                    <td>November 2024</td>
                    <td>
                      <ExternalLink url="https://www.cif.org/disclaimer">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.greenclimate.fund/">Green Climate Fund</ExternalLink>
                    </td>
                    <td>Green Climate Fund (GCF) projects and guidance</td>
                    <td>November 2024</td>
                    <td>
                      <ExternalLink url="https://www.greenclimate.fund/terms-and-conditions">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.thegef.org/">Global Environment Facility (GEF)</ExternalLink>
                    </td>
                    <td>Global Environment Facility (GEF) projects and guidance</td>
                    <td>November 2024</td>
                    <td>
                      <ExternalLink url="https://www.thegef.org/legal">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.preventionweb.net/">PreventionWeb</ExternalLink>
                    </td>
                    <td>Climate disaster risk reduction and management policies</td>
                    <td>December 2024</td>
                    <td>
                      <ExternalLink url="https://www.preventionweb.net/terms-and-conditions-use-preventionweb">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.oceanenergypathway.org">Ocean Energy Pathway</ExternalLink>
                    </td>
                    <td>Offshore Wind Reports</td>
                    <td>January 2025</td>
                    <td>
                      <ExternalLink url="https://oceanenergypathway.org/terms-conditions/">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ExternalLink url="https://www.lseg.com/en">LSEG</ExternalLink>
                    </td>
                    <td>
                      <ExternalLink url="https://permid.org/">PermID</ExternalLink> Uniform Resource Identifier (URI)
                    </td>
                    <td>May 2025</td>
                    <td>
                      <ExternalLink url="https://permid.org/terms">View</ExternalLink>
                    </td>
                  </tr>
                  <tr>
                    <td>Additional data sources will be added here as they are added to the CPR database and app</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <Heading level={2}>Changes To This Agreement</Heading>
              <p>
                Climate Policy Radar reserves the right, at our sole discretion, to modify or replace these Terms and Conditions by posting the
                updated terms on the Site. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms and
                Conditions.
              </p>
              <p>
                Please review this Agreement periodically for changes. If you do not agree to any of this Agreement or any changes to this Agreement,
                do not use, access or continue to access the Site or discontinue any use of the Site immediately.
              </p>
              <Heading level={2}>Questions?</Heading>
              <p>If you have any questions about this Agreement, please send an email to support@climatepolicyradar.org</p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default TermsOfUse;
