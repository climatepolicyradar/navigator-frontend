import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
};

export const FAQS: TFAQ[] = [
  {
    title: "Your site looks different, what's changed?",
    content: (
      <>
        <p>
          We’ve been working with our partners, <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar</ExternalLink>, to redesign
          and upgrade our legislation database, bringing you a better experience and new features to help you explore and interact with the data. You
          can now:
        </p>
        <ul>
          <li>Conduct searches in the full text of documents in the database. This improves the comprehensiveness of your search results.</li>
          <li>
            Find relevant information more easily. The new search function looks for similar and related phrases to search queries (‘semantic
            search’). Previously, results were based on finding exact matches to your query within document titles, summaries, and document metadata
            (keywords).
          </li>
          <li>
            See where a search term or relevant text appears in a document, with relevant passages of text automatically highlighted in yellow to help
            you identify important information more quickly.
          </li>
          <li>
            Search and explore documents from various UNFCCC data portals, including Nationally Determined Contributions, National Communications,
            Adaptation Communications, IPCC reports, and submissions by Parties and non-Party stakeholders to the first Global Stocktake, and more.
          </li>
        </ul>
        <p>
          More features are coming soon. <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/mailing-list/">Stay updated</ExternalLink> to find
          out when we launch them.
        </p>
      </>
    ),
  },
  {
    title: "What is 'Climate Change Laws of the World'?",
    content: (
      <>
        <p>
          Climate Change Laws of the World is a database covering national-level climate change legislation and policies from around the world. These
          laws and policies address policy areas directly relevant to climate change mitigation, adaptation, loss and damage or disaster risk
          management. More specifically, the database includes laws and policies that establish rules and procedures related to the transition to
          low-carbon economies, enhancing adaptation capabilities, and disaster risk management.
        </p>
        <p>
          As of June 2023, the database includes documents submitted by Parties and non-Party stakeholders to the UNFCCC, including, among others,
          Nationally Determined Contributions (NDCs), National Communications and Adaptation Communications, IPCC reports, and submissions to the
          first Global Stocktake (hereinafter: Submissions to the UNFCCC). (see FAQ ‘What UNFCCC documents are included?’). For more information
          please visit our <LinkWithQuery href="/methodology">Methodology section</LinkWithQuery>.
        </p>
        <p>
          This database originates from a collaboration between the Grantham Research Institute and GLOBE International on a series of Climate
          Legislation Studies. Since then, Climate Change Laws of the World has transformed into one of the Grantham Research Institute’s core
          strategic projects, underpinning much of the Institute’s work on our governance and legislation theme.
        </p>
        <p>
          The database is now powered and operated by our partner{" "}
          <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "What can I do with your tool?",
    content: (
      <>
        <ul>
          <li>
            Find climate and climate-related laws, policies, strategies and action plans from every country and submissions to the UNFCCC relevant to
            country level action
          </li>
          <li>Search for keywords and policy concepts (like ‘electric vehicles’ or ‘gender equality’) across the full text of all documents</li>
          <li>View your search term (and related phrases) highlighted in search results</li>
          <li>Browse country profiles to find and compare their climate laws, policies and strategies</li>
          <li>
            Access the raw data: you just need to <ExternalLink url="https://form.jotform.com/233131638610347">fill out this form</ExternalLink> to
            request a copy of the entire dataset
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "What’s the difference between Climate Change Laws of the World and Climate Policy Radar?",
    content: (
      <>
        <p>
          These resources have the same data, features and functionality. The Grantham Research Institute and Climate Policy Radar are delivering
          these resources in partnership, using Climate Policy Radar's technology to help you get more out of Climate Change Laws of the World's data.
        </p>
      </>
    ),
  },
  {
    title: "Am I free to download and use the data?",
    content: (
      <>
        <p>
          Yes - and we encourage you to do so! The content of our database is available under the Creative Commons Attribution Licence{" "}
          <ExternalLink url="https://creativecommons.org/licenses/by/4.0/">(CC-BY)</ExternalLink>. Before doing so, you should read our Terms of Use
          for more information and to find out how to cite and credit the resources. If you wish to download the data as a .csv file, please{" "}
          <ExternalLink url="https://form.jotform.com/233131638610347">fill out our form</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "How up-to-date is the data?",
    content: (
      <>
        <p>
          New data, and updates to existing data, are collected from official sources such as government websites, parliamentary records and court
          documents. We add these to the database on a rolling basis. Submissions to the UNFCCC portals were first added on the 23rd of May 2023, and
          are checked for updates regularly. If you’re aware of documents that are missing, please let us know using our{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359">data contributors form</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "How many laws and policies do you have in your database?",
    content: (
      <>
        <p>
          As of June 2023, the data includes 3,100 laws and policies in the database and over 1,700 Submissions to the UNFCCC portals. This number is
          regularly updated as new data is entered.
        </p>
      </>
    ),
  },
  {
    title: "Which Submissions to the UNFCCC are included?",
    id: "unfccc-docs",
    content: (
      <>
        <p>The database has over 1,700 Submissions to the UNFCCC that have been sourced from the following UNFCCC and related websites:</p>
        <ul>
          <li>
            <ExternalLink url="https://unfccc.int/topics/global-stocktake/information-portal?field_document_topic_target_id=All&field_document_type_target_id=4174&field_calculated_author_type_target_id=All&field_document_ca_target_id=">
              Global Stocktake Information Portal
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://unfccc.int/NDCREG">NDC Registry</ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://unfccc.int/ACR">Adaptation Communications Registry</ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://napcentral.org/submitted-naps">NAP Central Portal</ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://unfccc.int/ttclear/tna/reports.html">TNA Portal</ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://unfccc.int/climatefinance?submissions">Fast-Start Finance Country Reports</ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://www.ipcc.ch/reports/">IPCC Website</ExternalLink>
          </li>
        </ul>
        <p>These include the following documents:</p>
        <ul>
          <li>Nationally Determined Contributions (NDCs)</li>
          <li>IPCC Assessment Reports (from 2015 onwards)</li>
          <li>Fast-Start Finance Reports</li>
          <li>National Communications</li>
          <li>Biennial Reports</li>
          <li>Biennial Update Reports</li>
          <li>Annual Compilation and Accounting Reports</li>
          <li>Facilitative Sharing of Views Reports</li>
          <li>Global Stocktake Synthesis Reports</li>
          <li>Intersessional Documents</li>
          <li>Long-Term Low Greenhouse Gas Development Strategies</li>
          <li>National Inventory Reports</li>
          <li>Pre-Session Documents</li>
          <li>Progress Reports</li>
          <li>Publications submitted via the Global Stocktake Information Portal</li>
          <li>Reports submitted via the Global Stocktake Information Portal</li>
          <li>Statements submitted via the Global Stocktake Information Portal</li>
          <li>Submissions to the Global Stocktake</li>
          <li>Summary Reports</li>
          <li>Synthesis Reports</li>
          <li>Technical Analysis Summary Reports</li>
          <li>Adaptation Communications</li>
          <li>National Adaptation Plans</li>
          <li>Technology Needs Assessments</li>
        </ul>
      </>
    ),
  },
  {
    title: "How do I find Submissions to the UNFCCC that were submitted by multiple Parties?",
    content: (
      <>
        <p>
          Documents that have been written by multiple Parties, or by one Party on behalf of a coalition/negotiating block, are given the geography
          profile label "International", which you can search for using the search bar. The specific countries that contributed to the document are
          captured in the ‘author’ field.
        </p>
      </>
    ),
  },
  {
    title: "How do I find documents not submitted by countries?",
    content: (
      <>
        <p>
          Some documents are submitted to the UNFCCC by non-state actors (also called non-Party stakeholders (labelled in the app as 'non-party').
          These documents currently have no country assigned, and will be excluded from results when geography and region filters are applied. We will
          explore including location filters for non-state actors in the future.
        </p>
      </>
    ),
  },
  {
    id: "litigation-data",
    title: "Where can I find climate litigation data?",
    content: (
      <>
        <p>
          The litigation data previously accessible through Climate Change Laws of the World stemmed from our ongoing partnership with{" "}
          <ExternalLink url="https://climate.law.columbia.edu/">The Sabin Center for Climate Change Law</ExternalLink>. The Sabin Center has been
          leading efforts to collect global litigation data since 2011. We are now working together to launch an enhanced version of the litigation
          database, with new features similar to our legislation database. The data will be available through an integrated global resource in the
          coming months. <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/mailing-list/">Sign up for our newsletter</ExternalLink> to hear
          about this update. In the meantime, you can access climate case documents at the Sabin Center’s{" "}
          <ExternalLink url="http://www.climatecasechart.com">Climate Change Litigation Databases</ExternalLink> website.
        </p>
      </>
    ),
  },
  {
    title: "How do I find climate change framework laws?",
    content: (
      <>
        <p>
          Climate Change framework laws are a subset of all laws and policies in the database. We have added a new{" "}
          <LinkWithQuery href="/framework-laws">framework laws page</LinkWithQuery> where these are listed.
        </p>
      </>
    ),
  },
  {
    title: "How do I download all your data?",
    content: (
      <>
        <p>
          You’ll need to <ExternalLink url="https://form.jotform.com/233131638610347">fill out this form</ExternalLink> to request our entire dataset.
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
  // {
  //   title: "How do I download the data from my search result?",
  //   content: (
  //     <>
  //       <p>You can download the data from your search result by clicking ‘download search result as csv’.</p>
  //     </>
  //   ),
  // },
  {
    title: "What does ‘exact phrase only’ mean?",
    content: (
      <>
        <p>
          ‘Toggling’ (or clicking on) this option in the sidebar will narrow down your search to only show documents that include the exact words you
          typed in the search bar. However, this means a search for ‘electric vehicles’ wouldn’t pick up ‘EVs’ in the text, for example.
        </p>
      </>
    ),
  },
  {
    title: "What am I seeing if I don’t toggle ‘exact phrase only’?",
    content: (
      <>
        <p>
          If you don’t toggle (or click on) ‘exact phrase only’, our new search feature searches the database for similar and related terms to the
          query you typed into the search bar. This means you’ll get a richer search experience, as often climate or policy concepts are described in
          different ways by the government actors and policymakers producing the documents (such as petrol cars, internal combustion engine vehicles,
          gasoline-powered cars, etc). This feature relies on a technique called{" "}
          <ExternalLink url="https://climatepolicyradar.org/latest/building-natural-language-search-for-climate-change-laws-and-policies">
            natural language processing
          </ExternalLink>
          , which trains computers to understand text and the meaning of words and phrases in context. Climate Policy Radar’s team of policy experts
          is working to continually improve the performance and accuracy of the models, and to make them more domain-specific.
        </p>
      </>
    ),
  },
  {
    title: "How do I use the sidebar features to create filters for my results?",
    content: (
      <>
        <p>
          After conducting a search in the search bar, you can click on various features in the sidebar to the left of the page to narrow down your
          results. These features include showing ‘only exact matches’ (i.e. only searching the database for the precise words entered into the search
          bar), regions of the world where laws and policies have been published, specific jurisdictions (or countries), and date ranges for when
          documents have been published. This can help you narrow down and find accurate results more quickly.
        </p>
      </>
    ),
  },
  {
    title: "What are the document matches?",
    content: (
      <>
        <p>
          This feature shows you where your search term or relevant text appears in a document. For PDF documents, you’ll see the passage of text
          highlighted in yellow. We are currently working on developing this for HTML.
        </p>
        <p>
          This feature is made possible thanks to technology developed by Climate Policy Radar, which uses an AI technique called natural language
          processing to identify similar and related words and phrases. This means you can find information relevant to your search query even if it’s
          described in a slightly different way in the text of documents. Find out more about how{" "}
          <ExternalLink url="https://climatepolicyradar.org/latest/building-natural-language-search-for-climate-change-laws-and-policies">
            natural language processing
          </ExternalLink>{" "}
          works.
        </p>
      </>
    ),
  },
  {
    title: "What do matches: title, summary, document, mean?",
    content: (
      <>
        <p>
          Our search feature looks for where your search term, or related phrases, appear in the text of documents. It looks across the title,
          summary, and the body text of the document. This feature tells you where our search tool has found your query in relevant documents.
        </p>
      </>
    ),
  },
  {
    title: "Why can’t I see matches in some documents?",
    content: (
      <>
        <p>
          We’re working on making all documents in our database fully searchable - meaning our tool will scan all of the documents’ text to find
          references to your search query. For those published in different languages and HTML sources, this will take longer, which is why some don't
          yet allow full text search. For these documents, search is available on the title and summary. This will be resolved very soon.
        </p>
      </>
    ),
  },
  {
    title: "Why am I being redirected to an external site for some documents?",
    content: (
      <>
        <p>
          A small minority of our documents aren't yet machine-readable, meaning our tool can’t extract their text and make it searchable. In these
          instances our tool will look for matches to your search term in the documents’ title and summary. To access the full text you’ll be taken to
          the document’s source. We’re working to resolve this soon.
        </p>
      </>
    ),
  },
  {
    title: "What are the limitations of our search?",
    content: (
      <>
        <p>
          The database is not exhaustive. We don’t have access to some law and policy documents, while others aren’t currently machine-readable,
          meaning we can’t extract the text from them. We’re working to improve this so that you can search through the full text of more documents in
          the database. If you think we’re missing some data, you can tell us about it using the{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359">data contribution form</ExternalLink>.
        </p>
        <p>
          We also limit the number of matches you can see in a document to 500, so that you get the best performance from the tool. This means that
          for very long documents or very broad search terms, you might miss some matches. We’re working to remove this limit.
        </p>
      </>
    ),
  },
  {
    title: "How do I share a link to one of your documents?",
    content: (
      <>
        <p>While we work on developing shareable links, the best way to share documents is by using the URL of a document page.</p>
        <p>
          You can also share documents by downloading and then attaching them to an email. To download a document, click the ‘download’ button when
          viewing the document on our tool. You can also click the three horizontal dots on the top right of a document view, and download the PDF
          from there.
        </p>
      </>
    ),
  },
  {
    title: "I’ve spotted a bug, how do I report it?",
    content: (
      <>
        <p>
          You can get in touch with the Climate Policy Radar team via email at{" "}
          <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>. We appreciate you taking the time
          to do this!
        </p>
      </>
    ),
  },
  {
    title: "I think you’re missing some data, how do I tell you about it?",
    content: (
      <>
        <p>
          We’d love to hear about this! Please tell us using our{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359">data contribution form</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "What does ‘targets’ mean?",
    content: (
      <>
        <p>
          Quantified policy targets included in laws and policies (such as ‘reduce emissions by X% by year 2030), have been manually identified for
          most laws and policies in the database. These include various targets, including greenhouse gas emissions reduction targets, renewables
          targets, adaptation-related stargets, and more. Targets for individual documents are displayed on the document page. You can also see all
          targets identified in the laws and policies of any given country on the country page. Climate Policy Radar is developing automated
          algorithms for identification and display of targets. While we do this, we have paused the manual identification of targets in new laws and
          policies. We still identify “net zero” targets and climate neutrality targets. You can request to download the dataset by clicking the
          ‘Request to download all target data (.csv)’ button at the top of any list of targets, and filling out the form.
        </p>
      </>
    ),
  },
  {
    title: "Do you have subnational or city-level data?",
    content: (
      <>
        <p>
          Our current database includes documents from every national government. Including subnational and city-level data is part of our planned
          expansion. So if you’re aware of datasets you think we should include as part of this, please let us know using our{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359">data contribution form</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    title: "How are the documents translated to English?",
    content: (
      <>
        <p>
          Documents are translated to English using Google’s Cloud Translation API. While the quality of auto-translation does not always capture full
          meaning and nuance from the original language, we hope it serves as a first step to improve accessibility. We are planning to add
          auto-translation to other languages in the future, as well as to improve the quality of translation using other, potentially domain
          specific, models.
        </p>
      </>
    ),
  },
  {
    title: "How do I download search results?",
    content: (
      <>
        <p>You can download a csv of data for "this search" or the "whole database" from the top right of the search results page.</p>
        <p>
          If you download a csv for “this search” it will contain all documents related to the top 500 entries returned by your search. Note that the
          actual number of entries returned may be 1 or 2 below the total indicated on the search results page.
        </p>
      </>
    ),
  },
  {
    title: "What map and boundaries are used?",
    content: (
      <p>
        This map was made with the{" "}
        <ExternalLink url="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/">
          Admin o - Countries
        </ExternalLink>{" "}
        map package by <ExternalLink url="https://www.naturalearthdata.com/">Natural Earth</ExternalLink>. Climate Policy Radar's usage of this World
        map does not represent an opinion on any disputed boundaries.
      </p>
    ),
  },
  {
    title: "Why do some documents say “This entry and summary were provided by the Climate Policy Database”?",
    content: (
      <p>
        Since July 2024, the Climate Change Laws of the World interface has displayed law and policy entries originally collected and summarised by
        the NewClimate Institute and its partners for the{" "}
        <ExternalLink url="https://climatepolicydatabase.org/">Climate Policy Database</ExternalLink> project. Prior to their ingest into the
        database, documents were reviewed by researchers at Climate Policy Radar to ensure that no duplicate entries were added and that entries fell
        within the scope of the Climate Change Laws of the World 
        <LinkWithQuery href="/methodology">methodology</LinkWithQuery>. This data has been ingested with permission from NewClimate Institute, in
        order to advance efforts by Climate Policy Radar and LSE to provide users with the most comprehensive dataset possible.
      </p>
    ),
  },
];
