import Link from "next/link";

import { ExternalLink } from "@/components/ExternalLink";

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

export const FAQS: TFAQ[] = [
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
          jurisdictions, and the database should be used as a research tool—not as a substitute for legal advice.
        </p>
      </>
    ),
  },
  {
    title: "The Climate Litigation Database looks different — what's changed?",
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
          The database is refreshed twice a week, on Mondays and Wednesdays. Information is updated on a rolling basis, but completeness cannot be
          guaranteed. Twice a month, the Sabin Center publishes Climate Litigation Updates summarizing recent additions. You can{" "}
          <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">subscribe here</ExternalLink> to receive the twice-monthly
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
          Yes—and we encourage you to do so. The Climate Litigation Database is licensed under the Creative Commons Attribution Licence (CC-BY). You
          are free to share and adapt the data, provided you give appropriate credit and follow the license terms. Please read the Terms of Use for
          more information on how to cite and credit the resources. For commercial use of a substantial amount of information, please contact{" "}
          <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink> and{" "}
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
          <li>Investor–state disputes related to domestic climate measures.</li>
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

export const PLATFORM_FAQS: TFAQ[] = [
  {
    title: "What is Climate Policy Radar?",
    content: (
      <>
        <p>
          Climate Policy Radar is a non-profit organisation building open databases and research tools so people can discover and understand complex
          information, especially long-text documents, on climate, nature and development. Our data and tools help governments, researchers,
          international organisations, civil society, and the private sector to understand and advance effective climate policies and deploy climate
          finance. Harnessing data science and AI, and pioneering the application of natural language processing to this domain, our work renders
          previously unstructured, siloed data more readable and accessible.
        </p>
      </>
    ),
  },
  {
    title: "What can I do with this website?",
    content: (
      <>
        <p>
          This website provides the world’s most comprehensive database of climate change litigation. It brings together two previously separate
          resources maintained by the Sabin Center for Climate Change Law (the U.S. Climate Change Litigation database and the Global Climate Change
          Litigation database) into a single, unified platform.
        </p>
        <ul>
          <li>Search for keywords across the full text of all documents</li>
          <li>View your search term (and related phrases) highlighted in search results</li>
          <li>Browse country profiles to find climate change litigation in a specific geography</li>
          <li>
            Access the raw data: you just need to fill out this <ExternalLink url="https://form.jotform.com/252292116187356">form</ExternalLink> to
            request a copy of the entire dataset
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How do I download all your data?",
    content: (
      <>
        <p>
          Please fill out this <ExternalLink url="https://form.jotform.com/252292116187356">form</ExternalLink> to request our entire dataset.
        </p>
      </>
    ),
  },
  {
    title: "How do I download search results?",
    content: (
      <>
        <p>
          You will shortly be able to download a CSV file for "this search" or the "whole database" from the top right of the search results page. A
          CSV file for “this search” will contain all documents related to the top 500 entries returned by your search. (The actual number of entries
          may be 1 or 2 below the total indicated on the search results page.)
        </p>
        <p>
          Please fill out this <ExternalLink url="https://form.jotform.com/252292116187356">form</ExternalLink> to request our entire dataset.
        </p>
        <p>
          Please note, the ‘this search’ download feature is temporarily unavailable. We expect it to be back in the next few days. Thanks for your
          patience while we make sure the data you download is accurate.
        </p>
      </>
    ),
  },
  {
    title: "What is in the download files?",
    content: (
      <>
        <p>
          Data downloads are at the document level. Each record represents a single case document. Every document comes with its full set of metadata
          (for example: title, filing date, court, principal law, case category and other key details).
        </p>
        <p>
          Each document is also part of a case, and for United States cases, those cases are further grouped into collections. If you’d like to pull
          together all the documents that belong to a specific case or a whole collection of cases, you can use their unique IDs to find and filter
          them.
        </p>
      </>
    ),
  },
  {
    title: "What are the limitations of our search?",
    content: (
      <>
        <p>
          The database is not exhaustive and we are continuously looking for new documents. Some documents aren't currently machine-readable: we can't
          yet extract the text from them. We also limit the number of matches you can see in a document to 500, so you get the quickest, most accurate
          results. For very long documents, or very broad search terms, you might miss some matches.
        </p>
      </>
    ),
  },
  {
    title: "Why is the number of search results limited?",
    content: (
      <>
        <p>
          The number of search results is currently limited to 500 to optimise system performance. We’re working to remove this limit. Please note
          that the actual number of entries returned may be 1 or 2 below the total indicated on the search results page.
        </p>
      </>
    ),
  },
  {
    title: "What happens if I choose 'exact phrase' only?",
    content: (
      <>
        <p>
          Toggling (or clicking on) this option in the sidebar will narrow down your search to only show documents that include the exact words you
          typed in the search bar. However, doing this can mean you will miss out on relevant content, as a search for ‘electric vehicles’ wouldn't
          pick up 'EVs' in the text.
        </p>
      </>
    ),
  },
  {
    title: "What happens if I don't choose 'exact phrase only'?",
    content: (
      <>
        <p>
          If you don't toggle (or click on) 'exact phrase only', our new search feature searches the database for similar and related terms to the
          query you typed into the search bar. You will get a richer search experience. Often climate or policy topics are described in different ways
          by the government actors and policymakers producing the documents (such as petrol cars, internal combustion engine vehicles,
          gasoline-powered cars, etc). This feature uses a technique called natural language processing, which trains computers to understand text and
          the meaning of words and phrases in context. Climate Policy Radar's team of policy experts is continually working to improve the performance
          and accuracy of the models.
        </p>
      </>
    ),
  },
  {
    title: "How do I filter my results?",
    content: (
      <>
        <p>
          After typing your search terms into the search bar, narrow down your results by using the sidebar on the left side of the page. You can
          filter for 'only exact matches', case categories, principal laws, jurisdictions, regions of the world, countries, their sub-divisions, and
          filing date ranges.
        </p>
        <p>
          We’re still aligning the taxonomy of jurisdictions and principal laws between the US and global databases. While this work is in progress,
          you may notice some laws or jurisdictions appearing out of order in our filters. If you can’t find a jurisdiction under its country, check
          its alphabetical position instead. For example, US 'Federal Courts' appear under F rather than under 'United States' and the ‘Clean Air Act’
          currently appears both under the United States and as a stand-alone entry in the Principal Laws filter.
        </p>
      </>
    ),
  },
  {
    title: "What are document matches?",
    content: (
      <>
        <p>
          This highlights where in the document your search term or relevant text appears. It uses a subfield of AI called Natural Language
          Processing, which identifies related words and phrases.
        </p>
      </>
    ),
  },
  {
    title: "Why can't I see matches in some documents?",
    content: (
      <>
        <p>
          In the future, our tools will scan all of the text of all of the documents to highlight references to your search query. At the moment, this
          takes a long time for documents published in different languages and HTML sources, which is why we have chosen to only allow search on the
          title and summary of those materials.
        </p>
      </>
    ),
  },
  {
    title: "How do I link to one of your documents?",
    content: (
      <>
        <p>
          The best way to share documents is by using the URL of a document page. You can also share documents by downloading and then attaching them
          to an email. Click the 'download' button when viewing the document on our tool. Or click the three horizontal dots on the top right of a
          document view, and download the PDF from there.
        </p>
      </>
    ),
  },
  {
    title: "How do I report bugs?",
    content: (
      <>
        <p>
          Get in touch with the Climate Policy Radar team via email at{" "}
          <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>. We appreciate you taking the time
          to do this!
        </p>
      </>
    ),
  },
  {
    title: "How are the documents translated to English?",
    content: (
      <>
        <p>
          Documents are translated to English using Google's Cloud Translation API. Auto-translation does not always capture the full meaning and
          nuance of the original language, but we hope it is a useful first step in making documents available to more people.
        </p>
      </>
    ),
  },
  {
    title: "What geographical map and boundaries are used?",
    content: (
      <>
        <p>
          This map was made with the Admin 0 - Countries map package by Natural Earth. Climate Policy Radar's use of this map does not represent an
          opinion on any disputed boundaries.
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
          results associated with a specific legal authority. Geography refers to the physical location of events, and you can use this filter to view
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
          To locate cases brought before international or regional courts or tribunals, you can (1) use the Geography filter and select{" "}
          <strong>International</strong> in the “Published Jurisdiction” section either by scrolling down or by typing in the Quick search bar or (2)
          use the Jurisdiction filter and select <strong>International Courts & Tribunals</strong> either by scrolling down or by typing in the Quick
          search bar.
        </p>
      </>
    ),
  },
  {
    title: "Why do there appear to be more cases in the relaunched Climate Litigation Database than there were on the old platform?",
    content: (
      <>
        <p>
          On the old platform, when a case in the U.S. database involved (1) multiple complaints or petitions that had been consolidated and/or (2)
          proceedings at both the trial and appellate levels, all such proceedings would be bundled and counted as one case. On the new platform, each
          of these proceedings is counted as a separate case. You can see these related proceedings together in the "Collection" view by clicking the
          link below the phrase "Part of" on each U.S. case page. The number of Collections in the Climate Litigation Database would correspond to the
          number of U.S. cases on the old platform.
        </p>
      </>
    ),
  },
  {
    title: 'What is a "Collection"?',
    content: (
      <>
        <p>
          All cases from the United States are part of a "Collection." A Collection comprises cases that have been consolidated before a single court
          and includes both trial and appellate court proceedings. You can view a Collection by clicking the link below the phrase "Part of" on each
          U.S. case page. Some Collections include only one case. The "Procedural History" tab on a Collection page shows a single consolidated
          history of all of the events from the collected cases that are documented in the database. The "Cases" tab on a Collection page shows a list
          of all the cases included in the Collection.
        </p>
      </>
    ),
  },
  {
    title: 'How are cases identified for the listing of "Latest" cases on the landing page?',
    content: (
      <>
        <p>
          Cases shown on the home page are the most recent cases added to the database. The date displayed above each case name is the date it was
          added to the database. The actual filing year may differ, and you can view it on the individual case page. Click on a case to explore the
          latest entries in detail.
        </p>
      </>
    ),
  },
];
