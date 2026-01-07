import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const Methodology = () => {
  return (
    <Layout
      title="Methodology"
      description="Find the definitions, scope and principles we use to collect and categorise the climate litigation cases."
      theme="ccc"
    >
      <BreadCrumbs label={"Methodology"} />
      <section className="pt-8">
        <SiteWidth>
          <SingleCol>
            <div>
              <Heading level={1} extraClasses="custom-header mb-8">
                Methodology
              </Heading>
              <Heading level={2} extraClasses="custom-header">
                Methodology at a Glance
              </Heading>
              <p className="text-content mb-12">
                The Sabin Center's Climate Litigation Database tracks cases where climate change law, policy, or science is a{" "}
                <strong>material issue</strong>.
                <ul className="ml-6 mb-4">
                  <li>
                    <strong>Scope:</strong> Judicial cases, selected administrative and investigatory proceedings, investor-state disputes, and
                    certain proceedings before UN and regional bodies.
                  </li>
                  <li>
                    <strong>Exclusions:</strong> Cases that only mention climate change in passing, or that affect climate outcomes without raising
                    climate arguments directly.
                  </li>
                  <li>
                    <strong>Categorization:</strong> Each case is tagged by case category, principal laws invoked, jurisdiction, geography, and filing
                    year. Some cases are also tagged by status.
                  </li>
                  <li>
                    <strong>Sources:</strong> Court documents, media, academic literature, legal databases, and partnerships with global research
                    networks.
                  </li>
                  <li>
                    <strong>Limitations:</strong> Coverage is not exhaustive; some cases may be missing due to language barriers, document
                    availability, or limited reporting.
                  </li>
                </ul>
              </p>
              <Heading level={2} extraClasses="custom-header">
                Suggested Language when referencing the database
              </Heading>
              <p className="text-content mb-8">
                The Sabin Center's Climate Litigation Database compiles judicial and certain quasi-judicial cases worldwide where climate change law,
                policy, or science is materially at issue. It provides searchable information on case type, principal laws, jurisdiction, and
                geography. While comprehensive, the database is not exhaustive, and coverage varies across jurisdictions.
              </p>
              <Heading level={3} extraClasses="custom-header">
                Suggested Citation
              </Heading>
              <Heading level={4} extraClasses="custom-header">
                Bluebook style
              </Heading>
              <p className="text-content mb-8">
                Sabin Ctr. for Climate Change Law, <em>Climate Litigation Database</em>, <br />
                <ExternalLink url="https://climatecasechart.com">https://climatecasechart.com</ExternalLink> (last visited [DATE]).
              </p>
              <Heading level={4} extraClasses="custom-header">
                OSCOLA style
              </Heading>
              <p className="text-content mb-12">
                Sabin Center for Climate Change Law, <em>Climate Litigation Database</em> (rev [ADD DATE]){" "}
                <ExternalLink url="https://climatecasechart.com">https://climatecasechart.com</ExternalLink> accessed [ADD DATE].
                <br />
                <br />
                Short reference: (Sabin Center, Climate Litigation Database 2025).
              </p>
              <Heading level={2} extraClasses="custom-header">
                Detailed Methodology
              </Heading>
              <Heading level={3} extraClasses="custom-header">
                What counts as a climate case?
              </Heading>
              <div className="text-content mb-12">
                <p>To fall within the scope of the Sabin Center's Climate Litigation Database, cases must satisfy two key criteria:</p>
                <p>
                  <strong>1. Judicial or quasi-judicial proceedings</strong>. Cases must generally be brought before judicial bodies. However, in
                  certain instances, matters brought before administrative or investigatory bodies and arbitral tribunals are also included. In
                  addition, the database includes certain proceedings before international or regional bodies where climate change is materially at
                  issue. These include, for example, proceedings before United Nations human rights treaty bodies, compliance committees established
                  under multilateral environmental agreements, or other UN mechanisms addressing climate-related obligations.
                </p>
                <p>
                  <strong>2. Material climate relevance</strong>. Climate change law, policy, and/or science must be a material issue of law or fact
                  in the case. Cases that make only a passing reference to climate change, without addressing climate-relevant laws, policies, or
                  actions in a meaningful way, are excluded.
                </p>
                <p>
                  In general, cases that may affect climate change outcomes but do not explicitly raise climate-related issues are also excluded.
                  Examples include challenges to government inaction on local air pollution or challenges to the development of fossil fuel
                  infrastructure based solely on non-climate harm (e.g., public health and/or environmental harm associated with the infrastructure).
                  The intent of the litigants regarding the climate-related consequences of such cases is not considered when assessing whether a case
                  falls within the database's scope. Notably, such cases could be added later if climate issues become central (for example, if a
                  ruling explicitly addresses climate change).
                </p>
                <p>
                  The database also includes a number of cases before arbitral tribunals under bilateral and multilateral investment agreements
                  (commonly referred to as Investor-State Dispute Settlement, or ISDS). Investor-state cases are included when they relate directly to
                  the enactment or withdrawal of a domestic measure explicitly adopted to meet a country's climate goals and objectives. For more
                  information on these cases and their inclusion in the database, please visit{" "}
                  <ExternalLink url="https://blogs.law.columbia.edu/climatechange/2021/06/02/investor-state-dispute-settlement-as-a-new-avenue-for-climate-change-litigation/">
                    this link
                  </ExternalLink>
                  .
                </p>
                <p>
                  Until September 2025, the Sabin Center maintained separate U.S. and Global climate litigation databases. These differed in scope. In
                  the U.S. database, "cases" historically included quasi-judicial proceedings, rulemaking petitions, requests for reconsideration of
                  regulations, notices of intent to sue (even in situations where lawsuits were not subsequently filed), and subpoenas. Since 2018,
                  these other types of U.S. cases generally have not been added to the database, and approximately 135 older entries of this type have
                  been removed. As of September 2025, all such entries had been removed.
                </p>
              </div>
            </div>
            <div>
              <Heading level={3} extraClasses="custom-header">
                How are cases organized?
              </Heading>
              <div className="text-content mb-12">
                <p>
                  <em>Categorization</em> refers to the way cases are organized in the database through a set of descriptive tags. These tags capture
                  key features of each case — such as the type of claim, the laws invoked, the jurisdiction, and — in some cases — its status — so
                  that users can filter, compare, and analyze cases across jurisdictions. Because the U.S. and Global databases were originally
                  developed separately, the tagging systems are not yet fully harmonized. The categorization processes involved similar but slightly
                  different components. The lists below describe the categorization systems currently applied for cases outside the U.S. and for U.S.
                  cases, pending full integration.
                </p>
                <p>For cases outside the U.S., categorization considers:</p>
                <ol className="ml-6 mb-4">
                  <li>
                    <strong>Case category</strong>, including the type of defendant (governments or corporations and individuals) and the main cause
                    of action (e.g., greenhouse gas emissions reduction and trading, environmental assessment and permitting, human rights).
                  </li>
                  <li>
                    <strong>Jurisdiction</strong>, including the court, tribunal, or other adjudicatory body before which the case was filed.
                  </li>
                  <li>
                    <strong>Geography</strong>, including country, region, Global North or Global South (for analytical purposes).
                  </li>
                  <li>
                    <strong>Principal law</strong>, i.e., the main climate-relevant laws invoked.
                  </li>
                  <li>
                    <strong>Case status</strong>, such as pending or decided.
                  </li>
                </ol>
                <p>For U.S. cases, categorization considers:</p>
                <ol className="ml-6 mb-4">
                  <li>
                    <strong>Case category</strong>, e.g., federal statutory claims, constitutional claims, state law claims, adaptation, carbon
                    offsets and credits.
                  </li>
                  <li>
                    <strong>Principal law</strong>, e.g., relevant statutes or doctrines.
                  </li>
                  <li>
                    <strong>Jurisdiction</strong>, (i.e., the court in which the case was filed.
                  </li>
                  <li>
                    <strong>Geography</strong>, i.e., the U.S. state where filed, or "Federal" for cases originating in a federal court not tied to a
                    specific U.S. state (e.g., regional federal circuit courts of appeal).
                  </li>
                </ol>
                <p>
                  A single case may be included in multiple case categories, jurisdictions, or principal laws. Appeals and transfers are linked to the
                  same case entry for consistency.
                </p>
              </div>
            </div>
            <div>
              <Heading level={3} extraClasses="custom-header">
                Where do the cases come from?
              </Heading>
              <div className="text-content mb-12">
                <p>Cases are identified on a rolling basis by researchers at the Sabin Center for Climate Change Law. Sources include:</p>
                <ul className="ml-6 mb-4">
                  <li>Primary sources such as court websites, legal databases, and official documents.</li>
                  <li>
                    Secondary sources such as media reports, press releases, newsletters, social media, academic articles, NGO reports, and other
                    online sources.
                  </li>
                </ul>
                <p>
                  Data collection is collaborative. Many cases are reported through networks of plaintiffs, defendants, academics, and researchers, or
                  crowdsourced through other channels.
                </p>
                <p>
                  The{" "}
                  <ExternalLink url="https://climate.law.columbia.edu/content/global-network-peer-reviewers-climate-litigation">
                    Sabin Center's Peer Review Network of Climate Litigation
                  </ExternalLink>{" "}
                  helps ensure comprehensiveness and accuracy. As of June 2025, the Network includes 175 practitioners and scholars who serve as
                  national rapporteurs for 198 jurisdictions, as well as for international and regional courts, tribunals, quasi-judicial bodies, and
                  other adjudicatory bodies.
                </p>
                <p>For some specific regions, the Sabin Center collaborates with:</p>
                <ul className="ml-6 mb-4">
                  <li>
                    The{" "}
                    <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/">
                      Grantham Research Institute on Climate Change and the Environment
                    </ExternalLink>
                    .
                  </li>
                  <li>
                    The University of Melbourne, which maintains the{" "}
                    <ExternalLink url="https://law.app.unimelb.edu.au/climate-change/index.php">
                      Australian and Pacific Climate Change Litigation Database
                    </ExternalLink>
                    .
                  </li>
                  <li>
                    The{" "}
                    <ExternalLink url="https://litigancia.biobd.inf.puc-rio.br/">
                      Grupo de Pesquisa Direito, Ambiente e Justiça no Antropoceno, Pontifícia Universidade Católica do Rio de Janeiro
                    </ExternalLink>{" "}
                    (JUMA/NIMA/PUC-Rio), for Brazil.
                  </li>
                  <li>
                    The <ExternalLink url="https://aida-americas.org/en">Interamerican Association for Environmental Defense</ExternalLink> (AIDA),
                    for Latin America and the Caribbean.
                  </li>
                  <li>
                    The{" "}
                    <ExternalLink url="https://www.ucc.ie/en/youthclimatejustice/caselawdatabase/">
                      University College Cork's Youth Climate Justice Program
                    </ExternalLink>
                    , for cases involving children and youth.
                  </li>
                </ul>
                <p>
                  For ISDS cases, the primary sources are the{" "}
                  <ExternalLink url="https://investmentpolicy.unctad.org/investment-dispute-settlement">
                    UNCTAD Investment Policy Hub database
                  </ExternalLink>{" "}
                  and the <ExternalLink url="https://icsid.worldbank.org/cases/case-database">ICSID database</ExternalLink>. Because many arbitral
                  awards and decisions are not public, coverage may be incomplete. Original documents are included when available.
                </p>
                <p>
                  All cases are reviewed by Sabin Center researchers with relevant expertise. Summaries are drafted and cases categorized prior to
                  entry into the database.
                </p>
              </div>
            </div>
            <div>
              <Heading level={3} extraClasses="custom-header">
                What are the limits of the database?
              </Heading>
              <div className="text-content mb-12">
                <p>
                  The database highlights and informs a growing field of climate litigation. While we aim for broad coverage, several limitations
                  remain:
                </p>
                <ul className="ml-6 mb-4">
                  <li>
                    <strong>Incomplete global coverage.</strong> Language barriers, uneven media reporting, and limited access to court documents mean
                    some jurisdictions are better represented than others. Absence of cases in a jurisdiction does not necessarily mean no litigation
                    has occurred.
                  </li>
                  <li>
                    <strong>Consolidation.</strong> In some instances, multiple complaints or petitions have been consolidated into a single entry.
                    For U.S. cases, complaints or petitions that have been consolidated can be viewed together as part of a "collection" or "bundle."
                  </li>
                  <li>
                    <strong>Categorization limits.</strong> Categories such as "government" cover a wide range of actors (national, subnational,
                    agencies, state-owned entities, banks, etc.). We aim to specify implicated institutions wherever possible and may introduce
                    further sub-categories in future.
                  </li>
                  <li>
                    <strong>Scope of "climate litigation."</strong> Our definition is narrower than in some academic and practitioner literature.
                    These criteria were adopted to ensure consistency, to emphasize cases where climate issues are material to the outcome, and to
                    maintain the distinct field of climate litigation.
                  </li>
                  <li>
                    <strong>Potential bias.</strong> Some cases are identified with the assistance of pro-climate litigants and allies. These may be
                    documented in greater detail than cases challenging climate action. The Sabin Center is actively working to improve balance.
                  </li>
                  <li>
                    <strong>Evolving cases.</strong> Some cases that initially meet the inclusion criteria may later evolve so that climate issues are
                    no longer material; these cases remain in the database. Conversely, excluded cases may become relevant if climate issues emerge
                    and will be added to the database.
                  </li>
                  <li>
                    <strong>Ongoing evolution.</strong> Our data collection and categorization processes are continually reviewed and may be modified
                    to capture additional types of litigation. Users will be notified of major methodological updates.
                  </li>
                </ul>
              </div>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default Methodology;
