import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const Methodology = () => {
  return (
    <Layout
      title="Methodology"
      description="Find the definitions, scope and principles we use to collect and categorise the laws and policies."
      theme="mcf"
    >
      <BreadCrumbs label={"Methodology"} />
      <section className="pt-8">
        <SiteWidth>
          <SingleCol>
            <div>
              <Heading level={1} extraClasses="custom-header mb-2">
                What documents are included
              </Heading>
              <p className="text-content mb-12">
                The platform contains publicly available policies and project documents (such as concept notes, full proposals, implementation
                reports) of the four Multilateral Climate Funds.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Definitions and classifications that are currently in use
              </Heading>
              <div className="text-content mb-12">
                <p>
                  Each one of the four funds has its own nomenclature to indicate project status. To improve search results, we standardised the
                  project status list across all the funds (please see the list below):
                </p>
                <ul>
                  <li>Concept Approved</li>
                  <li>Project Approved</li>
                  <li>Under Implementation</li>
                  <li>Project Completed</li>
                  <li>Cancelled</li>
                </ul>
                <p>This table shows how standardised project status relates to each fund project status.</p>
              </div>
            </div>
            <div className="text-content mb-12">
              <table className="text-left text-content mb-12">
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th>Climate Project Explorer Status</th>
                    <th>Original Status</th>
                    <th>Approval FY Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Adaptation Fund</td>
                    <td>Project Approved</td>
                    <td>Grant submitted – Adaptation Fund Climate Innovation Accelerator (AFCIA), Proposal Approv</td>
                    <td>Approval FY</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>Project Approved</td>
                    <td>Proposal Approved</td>
                    <td>Approval FY</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Approved</td>
                    <td>Proposal Approved, South-south</td>
                    <td>Approval FY</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Approved</td>
                    <td>Grant approved – Adaptation Fund Climate Innovation Accelerator (AFCIA), Proposal Approved</td>
                    <td>Approval FY</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Under Implementation</td>
                    <td>Grant submitted – NIE Small Grants for Innovation, Project Under Implementation</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Under Implementation</td>
                    <td>Project Under Implementation</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Completed</td>
                    <td>Project Completed</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>GEF</td>
                    <td>Concept Approved</td>
                    <td>Concept Approved</td>
                    <td>Approval FY</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Approved</td>
                    <td>Project Approved</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Completed</td>
                    <td>Completed</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Cancelled</td>
                    <td>Cancelled</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>GCF</td>
                    <td>Project Approved</td>
                    <td>Approved</td>
                    <td>Approval FY</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Under Implementation</td>
                    <td>Under Implementation</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Completed</td>
                    <td>Completed</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>CIF</td>
                    <td>Under Implementation</td>
                    <td>MDB Board Approval</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Approved</td>
                    <td>Committee Approved</td>
                    <td>Approval FY</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Cancelled</td>
                    <td>Cancelled</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Project Completed</td>
                    <td>Closed</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <Heading level={2} extraClasses="custom-header">
                Data collection process and frequency of updates
              </Heading>
              <p className="text-content mb-12">
                We will publish new and relevant documents from the Multilateral Climate Funds’ individual public databases on the Climate Project
                Explorer. The Climate Project Explorer will be updated regularly based on the publication date of new or updated documents from
                individual MCFs. Each Climate Project Explorer project page will also be linked to the original project page on the MCFs’ website.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Country profile data
              </Heading>
              <p className="text-content mb-12">
                A country profile page is a snapshot view of all the projects across all 4 funds. Here, you can see the 5 most recent projects
                uploaded to the CPE platform. Click on ‘View more projects’ to see the complete list of all projects in a specific geography.
              </p>
              <Heading level={2} extraClasses="custom-header">
                Principles and limitations
              </Heading>
              <p className="text-content mb-12">
                You can find the most relevant project documentation on CPE. In some cases, you can find more information on the original project page
                on the MCFs’ website.
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default Methodology;
