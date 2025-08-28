import { useContext } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { getThemeConfigLink } from "@/utils/getThemeConfigLink";

const Methodology = () => {
  const { themeConfig } = useContext(ThemePageFeaturesContext);

  return (
    <Layout
      title="Methodology"
      description="Find the definitions, scope and principles we use to collect and categorise the climate litigation cases."
    >
      <SubNav>
        <BreadCrumbs label={"Methodology"} />
      </SubNav>
      <section className="pt-8 color-text-primary">
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-8">
              <Heading level={1} extraClasses="custom-header mb-8">
                Methodology
              </Heading>
              <p>To fall within the scope of the Climate Change Litigation Database, cases must satisfy two key criteria.</p>
              <p>
                First, cases must generally be brought before judicial bodies (though in some exemplary instances matters brought before
                administrative or investigatory bodies are also included). Historically, the term “cases” in the U.S. database included more than
                judicial actions and proceedings. Other types of “cases” formerly contained in the database included quasi-judicial administrative
                proceedings, rulemaking petitions, requests for reconsideration of regulations, notices of intent to sue (in situations where lawsuits
                were not subsequently filed), and subpoenas. Since 2018, these other types of cases have not been added to the U.S. database, and
                approximately 100 older such cases were removed from the database in November 2021.
              </p>
              <p>
                Second, climate change law, policy, or science must be a material issue of law or fact in the case. Cases that make only a passing
                reference to climate change, but do not address climate-relevant laws, policies, or actions in a meaningful way are not included.
              </p>
              <p>
                In general, cases that may have a direct impact on climate change, but do not explicitly raise climate issues, are also not included
                in the database. Examples of such cases may include challenges to government inaction on local air pollution or challenges to the
                development of fossil fuel infrastructure on the basis of other types of harm to human health and/or the environment. The intent of
                the litigants with regard to the climate-related consequences of such cases is not considered during the assessment process.
              </p>
              <p>
                The Global database also includes a number of cases brought before arbitral tribunals under the terms of bilateral and multilateral
                investment agreements, commonly referred to as Investor-State Dispute Settlement (ISDS). Investor-state cases are considered to be
                within the scope of the database insofar as they relate directly to the enactment or withdrawal of a domestic measure explicitly
                adopted to meet a country's climate goals and objectives. More information on these cases and their inclusion in the database can be
                found here.
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Categorization in the Global Database
              </Heading>
              <p>Prior to addition to the Global database, cases are categorized according to:</p>
              <ul>
                <li>
                  Case categories, including the type of defendant (governments or corporations and individuals) and the main cause of action (e.g.,
                  greenhouse gas emissions reduction and trading, environmental assessment and permitting, human rights, etc.);
                </li>
                <li>Jurisdiction, including the court or tribunal before which the case was filed;</li>
                <li>The climate-relevant principal law to which the litigation relates (i.e., the main laws invoked in the case);</li>
                <li>The status of the case (e.g., whether the case is pending or decided).</li>
              </ul>
              <p>
                A single case may be categorized in multiple case categories, multiple jurisdictions (if the case is heard on appeal), and multiple
                principal laws. You can filter by case category, jurisdiction, principal law, and jurisdiction here.
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Categorization in the U.S. Database
              </Heading>
              <p>Prior to addition to the U.S. database, cases are categorized according to:</p>
              <ul>
                <li>Type of claim (e.g., federal statutory, constitutional, state law); and</li>
                <li>Principal law (e.g., specific statutes or doctrines).</li>
              </ul>
              <p>
                A single U.S. case may be categorized in multiple types of claim and principal laws. You can see all of the types (and sub-types) of
                claims here. You can filter by type of claim, principal law, filing year, and jurisdiction here.
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Data Collection Process
              </Heading>
              <p>
                Cases are identified on a rolling basis by the Sabin Center for Climate Change Law. Common sources of information relied on by
                researchers include media reports, legal databases, court websites and newsletters, social media, academic articles, and other online
                sources. We take a collaborative approach to data gathering, and many cases have been reported through networks of plaintiffs and
                defendants, academics and researchers, or crowdsourced through other channels.
              </p>
              <p>
                The Sabin Center's Peer Review Network of Climate Litigation ensures that the database is comprehensive and up to date. For some
                specific types of litigation, data is collected in partnership with other institutions and individuals. The Sabin Center regularly
                collaborates with researchers at the Grantham Research Institute on Climate Change and the Environment. The primary source of cases
                from Australia is the University of Melbourne, which maintains the Australian Climate Change Litigation Database. The primary source
                of cases from the Asia-Pacific region is the Asia Development Bank. The primary source of cases from Brazil is the Grupo de Pesquisa
                Direito, Ambiente e Justiça no Antropoceno, Pontifícia Universidade Católica do Rio de Janeiro (JUMA/NIMA/PUC-Rio). The Sabin Center
                also collaborates with the Interamerican Association for Environmental Defense (AIDA) on climate litigation cases in Latin America.
                The Peer Review Network receives financial support from the United Nations Environment Program.
              </p>
              <p>
                Data regarding ISDS cases is collected in partnership with Hasselt University, Centre for Government and Law, Faculty of Law. The
                primary source of cases is the UNCTAD Investment Policy Hub database, which collects over 1,000 existing ISDS cases worldwide. Another
                source of information is the ICSID database on its website. Full details of complaints, decisions, and arbitral awards in ISDS cases
                are not always made public, but original documents are included in the database where these have been identified.
              </p>
              <p>
                Once a case is identified, it is reviewed by researchers at the Sabin Center for Climate Change Law with relevant expertise in the
                field of environmental and climate change law. Researchers draft case summaries and categorize cases according to the categories
                described above prior to entry into the databases.
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Data Limitations
              </Heading>
              <p>
                The database has helped highlight and inform a global field of research and practice in climate change law. While we have sought to
                identify as many cases as possible that may fall within the scope outlined above, the database is not exhaustive. Key limitations
                include language barriers, levels of media coverage, and public availability of court documents. As a result, coverage in some
                jurisdictions is more comprehensive than in others. This may contribute to the wide discrepancy in the numbers of climate cases
                identified in different jurisdictions, although the legal culture in different jurisdictions should also be considered a key factor.
                In some instances, cases which are identical in subject matter may also have been recorded in the database in one entry. In the U.S.
                database, one case may involve multiple complaints or petitions that have been consolidated, and the entry for a single case may
                include multiple decisions at the trial and appellate levels. Similarly, the fact that no climate litigation has yet been identified
                in a given jurisdiction should not be taken as a certain indication that no such litigation has been filed or decided.
              </p>
              <p>
                At present, the categorization of cases is limited in scope. For example, in the Global database, the term “government” is used to
                identify a wide range of governments and institutions and may refer to national or subnational governments, or to specific government
                entities such as banks or other institutions. To mitigate this limitation, we do our best to specify the name of the government
                entities implicated in the litigation.
              </p>
              <p>
                The definition of climate change litigation found in some academic and practitioner-oriented literature may be broader than that used
                to determine whether a case falls within the scope of these databases. The criteria for inclusion set out above have been adopted to
                facilitate both the process of data collection and to emphasize the distinct nature and importance of cases where climate change is
                material to the outcome. Climate change touches on a vast range of law and policy issues in the fields of environment, energy, natural
                resources, land use, and securities and financial regulation, among others; these criteria provide meaningful limits on researchers'
                discretion to determine whether a case has climate relevance and help define climate litigation as a distinct field. While the dataset
                is sufficiently comprehensive and cross-cutting to provide wide-ranging insights, data-users should be aware that individual cases
                that meet these criteria may be missing and certain trends may not currently be captured in the database. In addition, cases that
                appear to meet these criteria at the outset may develop and evolve so that climate change is no longer material to their outcome. Some
                cases in the database are identified with the support of pro-climate litigants and their allies, which may mean that these cases are
                captured in more detail than cases seeking to challenge climate action. Our data collection processes are subject to continual
                evolution and may in the future be modified to include additional categories of cases or to better capture the volume of cases of a
                given type.
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Data Files
              </Heading>
              {getThemeConfigLink(themeConfig, "download-database") && (
                <>
                  <p>
                    Request a download of the Global Climate Change Litigation database{" "}
                    <ExternalLink url={getThemeConfigLink(themeConfig, "download-database").url} cy="download-entire-search-csv">
                      here
                    </ExternalLink>
                    . It contains information that appears on the case webpages outside the green frames. We currently cannot provide files with the
                    remainder of the U.S. data.
                  </p>
                </>
              )}

              <p>This work is licensed under a Creative Commons Attribution-Noncommercial 4.0 International License.</p>
              <p>
                The data file is intended to be a useful resource for research and does not constitute legal advice. No warranty of accuracy or
                completeness is made. You should consult with counsel to determine applicable legal requirements in a specific factual situation.
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Litigation Newsletter and Updates
              </Heading>
              <p>
                You can subscribe to the Sabin Center Climate Litigation Newsletter{" "}
                <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">here</ExternalLink> and view past newsletters{" "}
                <ExternalLink url="https://climate.law.columbia.edu/content/climate-litigation-newsletter">here</ExternalLink>. The newsletter was
                launched in March 2025. It will be sent twice a month and will include links to the Sabin Center's climate litigation updates, which
                will be published twice a month starting in March 2025. You can view litigation updates published since September 2021{" "}
                <ExternalLink url="https://climate.law.columbia.edu/node/1890">here</ExternalLink>. A document that includes monthly U.S. climate
                litigation updates from August 2008 to January 2025 is available{" "}
                <ExternalLink url="https://climatecasechart.com/wp-content/uploads/2025/01/climate-chart-email-update-list-reverse-chron.-order-2025-01.pdf">
                  here
                </ExternalLink>
                .
              </p>
            </div>
            <div className="text-content mb-8">
              <Heading level={2} extraClasses="custom-header">
                Other Information
              </Heading>
              <p>
                This site was developed by <ExternalLink url="https://www.climatepolicyradar.org/">Climate Policy Radar</ExternalLink>.
              </p>
              <p>
                The Sabin Center is grateful to the Asia Development Bank, the Grantham Institute, the University of Melbourne's Australia Climate
                Change Litigation Database, and the Asociación Interamericana para la Defensa del Ambiente (AIDA) for helping us identify climate
                change cases. We also appreciate our ongoing partnership with the United Nations Environment Programme in surveying and assessing
                cases. The Sabin Center's Global Climate Litigation Fellow is generously supported by the Foundation for International Law for the
                Environment (FILE).
              </p>
              <p>
                Information about new cases or updates or corrections for existing cases should be sent to{" "}
                <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink>. You may also submit information
                through <ExternalLink url="https://form.jotform.com/252302964707357">this online form</ExternalLink>.
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default Methodology;
