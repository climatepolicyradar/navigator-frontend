import Link from "next/link";

import { ExternalLink } from "@/components/ExternalLink";
import { EN_DASH } from "@/constants/chars";
import { TFAQ } from "@/types";

export const HOMEPAGE_FAQS: TFAQ[] = [
  {
    title: `The Climate Litigation Database looks different ${EN_DASH} what's changed?`,
    content: (
      <>
        <p>
          We have partnered with <ExternalLink url="https://climatepolicyradar.org">Climate Policy Radar</ExternalLink> (CPR) to merge the U.S. and
          Global Climate Litigation Databases into a single platform, redesigned to enable more comprehensive searches and improved access to climate
          litigation data. The new site allows you to:
        </p>
        <ul>
          <li>
            <strong>Search across all jurisdictions</strong> (including the U.S.) in a single query.
          </li>
          <li>
            <strong>Search the full text of all documents</strong> in the database.
          </li>
          <li>
            <strong>Conduct both "exact phrase" and "semantic” searches. Use semantic search to find phrases that are</strong> similar or related to
            your search terms (e.g., in a semantic search, looking for references to “electric vehicles” would also identify results including “EVs”).
          </li>
          <li>
            <strong>See highlighted text</strong> showing exactly where your search terms appear in documents.
          </li>
          <li>
            <strong>Export data files</strong> for search results or for the entire database, across all jurisdictions.
          </li>
        </ul>
        <p>
          More features are coming soon. Stay updated by{" "}
          <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">subscribing</ExternalLink> to our newsletter, and please send
          feedback to <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink> or by filling in this
          <ExternalLink url="https://form.jotform.com/252292443502350">template</ExternalLink>. We also will post updates about new features in this
          FAQ.
        </p>
      </>
    ),
  },
  {
    title: "What happened to the case categories from the “climate case charts”?",
    content: (
      <>
        <p>
          You can still view cases by the categories that appeared in the original charts on the landing pages of the former U.S. and Global Climate
          Change Litigation Databases. Click the arrow next to “Case categories” in the sidebar menu on the{" "}
          <Link href="/search#categories">search results page</Link> to view all available categories. Initially the new platform will use the
          separate case categories for U.S. cases and for non-U.S. cases that were used in the former U.S. and Global databases. In the future, an
          integrated set of case categories will be developed.
        </p>
      </>
    ),
  },
  {
    title: "Am I free to download and use the data?",
    content: (
      <>
        <p>
          Yes {EN_DASH} and we encourage you to do so. The Climate Litigation Database is licensed under a Creative Commons Attribution-Noncommercial
          4.0 International License (CC BY-NC 4.0). This means you are free to share and adapt the data for non-commercial purposes, provided you give
          appropriate credit. Please read the Terms of Use for more information on how to cite and credit the resources. If you wish to use, copy,
          redistribute, publish, or exploit information from the database for commercial purposes, please contact us by emailing{" "}
          <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink> to discuss the best way to address your
          specific needs.
        </p>
        <p>
          The database is intended to be a useful resource for research and does not constitute legal advice. No warranty of accuracy or completeness
          is made. You should consult with legal counsel to determine applicable legal requirements in a specific factual situation.{" "}
        </p>
        <p>
          If you wish to download data from the whole database as a .csv file, please fill out{" "}
          <ExternalLink url="https://form.jotform.com/252292116187356">our form</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: 'What are the "Jurisdictions" and "Geography" filters? How are they different from each other?',
    content: (
      <>
        <p>
          Jurisdiction refers to the legal authority (such as a court or tribunal) that is hearing and deciding a case. Use this filter to see all
          results associated with a specific legal authority. Geography refers to the physical location of events and you can use this filter to view
          what cases have been filed in a specific region, country, or geographical subdivision across different courts and court systems.
        </p>
        <p>
          If you are using the Jurisdiction filter to search for a U.S. court, use the Bluebook abbreviation to find the court (e.g., “S.D.N.Y.” for
          the U.S. District Court for the Southern District of New York).
        </p>
      </>
    ),
  },
  {
    title: "How can I find International cases?",
    content: (
      <>
        <p>
          To locate cases brought before international or regional courts or tribunals, use the Geography filter and select{" "}
          <Link href="/search?l=xab">"International”</Link> in the “Published Jurisdiction” section either by scrolling down or by typing
          “International” in the Quick search bar.
        </p>
      </>
    ),
  },
];

export const APP_FAQS: TFAQ[] = [
  {
    title: "What is The Climate Litigation Database?",
    content: (
      <>
        <p>
          The Climate Litigation Database, maintained by the Sabin Center for Climate Change Law in collaboration with Climate Policy Radar, is the
          most comprehensive resource tracking climate change litigation worldwide. It brings together the formerly separate U.S. and Global Climate
          Litigation Databases into a single platform, covering more than 3,000 cases where climate change law, policy, or science is a material
          issue.
        </p>
        <p>
          The database allows users to search across jurisdictions worldwide, explore case documents with advanced search tools, and download
          structured datasets for research and analysis. While it is designed to be as comprehensive as possible, coverage may vary across
          jurisdictions, and the database should be used as a research tool {EN_DASH} not as a substitute for legal advice.
        </p>
      </>
    ),
  },
  {
    title: `The Climate Litigation Database looks different ${EN_DASH} what's changed?`,
    content: (
      <>
        <p>
          We have partnered with <ExternalLink url="https://www.climatepolicyradar.org">Climate Policy Radar</ExternalLink> (CPR) to merge the U.S.
          and Global Climate Litigation Databases into a single platform, redesigned to enable more comprehensive searches and improved access to
          climate litigation data. The new site allows you to:
        </p>
        <ul>
          <li>
            <strong>Search across all jurisdictions</strong> (including the U.S.) in a single query.
          </li>
          <li>
            <strong>Search the full text of all documents</strong> in the database.
          </li>
          <li>
            <strong>Conduct both "exact phrase" and "semantic” searches. Use semantic search to find phrases that are</strong> similar or related to
            your search terms (e.g., in a semantic search, looking for references to “electric vehicles” would also identify results including “EVs”).
          </li>
          <li>
            <strong>See highlighted text</strong> showing exactly where your search terms appear in documents.
          </li>
          <li>
            <strong>Export data files</strong> for search results or for the entire database, across all jurisdictions.
          </li>
        </ul>
        <p>
          More features are coming soon. Stay updated by{" "}
          <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">subscribing</ExternalLink> to our newsletter, and please send
          feedback to <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink> or by filling in this
          <ExternalLink url="https://form.jotform.com/252292443502350">template</ExternalLink>. We also will post updates about new features in this
          FAQ.
        </p>
      </>
    ),
  },
  {
    title: "What happened to the case categories from the “climate case charts”?",
    content: (
      <>
        <p>
          You can still view cases by the categories that appeared in the original charts on the landing pages of the former U.S. and Global Climate
          Change Litigation Databases. Click the arrow next to “Case categories” in the sidebar menu on the{" "}
          <Link href="/search#categories">search results page</Link> to view all available categories. Initially the new platform will use the
          separate case categories for U.S. cases and for non-U.S. cases that were used in the former U.S. and Global databases. In the future, an
          integrated set of case categories will be developed.
        </p>
      </>
    ),
  },
  {
    title: "How up-to-date is the data?",
    content: (
      <>
        <p>
          The database is refreshed 4 times a week, on Mondays, Tuesdays, Wednesdays and Thursdays. Information is updated on a rolling basis, but
          completeness cannot be guaranteed. Twice a month, the Sabin Center publishes Climate Litigation Updates summarizing recent additions. You
          can <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">subscribe here</ExternalLink> to receive the twice-monthly
          Climate Litigation Newsletter. If you have updates to a case, please send them to{" "}
          <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "Am I free to download and use the data?",
    content: (
      <>
        <p>
          Yes {EN_DASH} and we encourage you to do so. The Climate Litigation Database is licensed under the Creative Commons Attribution Licence
          (CC-BY). You are free to share and adapt the data, provided you give appropriate credit and follow the license terms. Please read the Terms
          of Use for more information on how to cite and credit the resources. For commercial use of a substantial amount of information, please
          contact <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink> and{" "}
          <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink>.
        </p>
        <p>
          The database is intended as a research resource and does not constitute legal advice. No warranty of accuracy or completeness is made.
          Consult legal counsel for specific legal requirements.
        </p>
        <p>
          To download data from the whole database as a .csv file, please fill out{" "}
          <ExternalLink url="https://form.jotform.com/252292116187356">our form</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "How do I find an accurate case count?",
    content: (
      <p>
        Users seeking an accurate count of U.S. and non-U.S. cases across the Climate Litigation Database should use the full database download. The
        downloadable dataset includes information on related proceedings, collections, and jurisdictional distinctions that may affect case counts.
        For more detail on how cases are structured and counted in the dataset, please refer to the{" "}
        <ExternalLink url="https://climatepolicyradar.notion.site/Readme-for-Climate-Case-Chart-document-data-download-35f9109609a48003affdf86d97eb2ccd">
          Readme for Climate Case Chart document data download.
        </ExternalLink>
      </p>
    ),
  },
  {
    title: "What is the Sabin Center for Climate Change Law?",
    content: (
      <>
        <p>
          Since 2009, the Sabin Center for Climate Change Law at Columbia Law School has provided expertise, resources, and timely information on
          climate change law, environmental regulation, energy regulation, and natural resources law. Its mission is to develop legal techniques to
          combat the climate crisis, advance climate justice, and train future leaders. The Center is a partner and resource for climate change work,
          promoting accountability through information for academic and practitioner communities.
        </p>
        <p>The Sabin Center is affiliated with the Columbia Climate School and collaborates with their scientists on interdisciplinary research.</p>
      </>
    ),
  },
  {
    title: "What does the database include?",
    content: (
      <>
        <p>The database tracks cases worldwide where climate change law, policy, or science is a material issue. It covers:</p>
        <ul>
          <li>Judicial decisions, and selected administrative or investigatory proceedings.</li>
          <li>Investor-state disputes related to domestic climate measures.</li>
          <li>Certain proceedings before UN and regional human rights bodies.</li>
        </ul>
        <p>Cases that mention climate change in passing, or affect climate outcomes without raising climate arguments directly, are not included.</p>
      </>
    ),
  },
  {
    title: "Who maintains the database?",
    content: (
      <>
        <p>
          The Climate Litigation Database is maintained by the Sabin Center for Climate Change Law at Columbia Law School, in collaboration with
          partners.
        </p>
      </>
    ),
  },
  {
    title: "How should I cite the database?",
    content: (
      <>
        <p>
          <strong>Bluebook:</strong> Sabin Ctr. for Climate Change Law, Climate Litigation Database,{" "}
          <ExternalLink url="https://climatecasechart.com">https://climatecasechart.com</ExternalLink> (last visited [DATE]).
        </p>
        <p>
          <strong>OSCOLA:</strong> Sabin Center for Climate Change Law, Climate Litigation Database (rev September 2025){" "}
          <ExternalLink url="https://climatecasechart.com">https://climatecasechart.com</ExternalLink> accessed 29 August 2025.
        </p>
        <p>
          <strong>Short reference:</strong> (Sabin Center, Climate Litigation Database 2025).
        </p>
      </>
    ),
  },
  {
    title: "Where can I learn more about climate litigation trends?",
    content: (
      <>
        <p>
          The Sabin Center publishes reports, blog posts, and academic articles analyzing developments in climate litigation. Visit the{" "}
          <ExternalLink url="https://climate.law.columbia.edu/research-library">Sabin Center’s searchable library</ExternalLink> for links to recent
          publications.
        </p>
      </>
    ),
  },
];
