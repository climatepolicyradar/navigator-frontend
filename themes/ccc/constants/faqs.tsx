import Link from "next/link";

import { ExternalLink } from "@/components/ExternalLink";
import { PLATFORM_FAQS as GENERIC_PLATFORM_FAQS } from "@/constants/platformFaqs";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
};

export const HOMEPAGE_FAQS: TFAQ[] = [
  {
    title: "The Climate Litigation Database looks different — what's changed?",
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
          Yes—and we encourage you to do so. The Climate Litigation Database is licensed under a Creative Commons Attribution-Noncommercial 4.0
          International License (CC BY-NC 4.0). This means you are free to share and adapt the data for non-commercial purposes, provided you give
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

export const FAQS: TFAQ[] = [...HOMEPAGE_FAQS];

export const PLATFORM_FAQS: TFAQ[] = [...GENERIC_PLATFORM_FAQS];
