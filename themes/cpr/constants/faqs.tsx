import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { EN_DASH } from "@/constants/chars";
import { TFAQ } from "@/types";

export const APP_FAQS: TFAQ[] = [
  {
    title: "What can I do with your tool?",
    content: (
      <ul>
        <li>Find climate and climate-related laws, policies, UN submissions, finance projects and reports from every country.</li>
        <li>Search all documents at once, or narrow to the categories that most interest you - document type, geography, Topics, and more.</li>
        <li>Search the full text of all documents, with highlights showing exactly where your search terms and related phrases appear.</li>
        <li>
          Find documents from all languages translated to English, increasing accessibility. Browse country profiles to find and compare their climate
          and nature laws, policies, and strategies.
        </li>
        <li>Find mentions of key Topics like targets, adaptation, and finance flows in the text of documents.</li>
        <li>Export data files for search results or for the entire database.</li>
        <li>Connect it directly into your own systems via API and MCP. Get in touch for early access: partners@climatepolicyradar.org</li>
      </ul>
    ),
  },
  {
    title: "Who is Climate Policy Radar?",
    content: (
      <p>
        Climate Policy Radar is an independent non-profit building open, credible databases and responsible AI tools to support informed action on
        climate and nature. Our data and tools help governments, researchers, international institutions, and the private sector to understand and
        strengthen action on climate and nature worldwide.{" "}
      </p>
    ),
  },
  {
    title: "Am I free to download and use the data?",
    content: (
      <p>
        Yes {EN_DASH} and we encourage you to do so! The content of our database is available under the Creative Commons Attribution Licence{" "}
        <PageLink external href="https://creativecommons.org/licenses/by/4.0/">
          (CC-BY)
        </PageLink>
        . Before doing so, please read our Terms of Use for more information and to find out how to cite and credit our tools. If you wish to download
        the full database as a csv file, please{" "}
        <PageLink external href="https://form.jotform.com/250202141318339">
          fill out this form
        </PageLink>
        .
      </p>
    ),
  },
  {
    title: "What data do you include?",
    content: (
      <p>
        Our data is sourced from, and kept up to date by, an expert network of partners across academia, research institutes, NGOs, and international
        institutions.{" "}
        <PageLink external href="https://www.climatepolicyradar.org/what-we-do#data">
          Explore our data partners here
        </PageLink>
        , or read our{" "}
        <PageLink external href="https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md">
          methodology
        </PageLink>{" "}
        to learn more about our data.
      </p>
    ),
  },
  {
    title: "How up-to-date is the data?",
    content: (
      <p>
        New data, and updates to existing data, are collected from official sources including government websites, parliamentary records, court
        documents, and UN portals. Our data partners update the database on a rolling basis.. We update the documents in our app and our CSV download
        every day. If you’re aware of documents that are missing, please let us know using our{" "}
        <PageLink external href="https://form.jotform.com/250974303048355">
          data contributors form
        </PageLink>
        .
      </p>
    ),
  },
  {
    title:
      "What is the difference between Climate Policy Radar, Climate Change Laws of the World, the Climate Litigation Database, and Climate Project Explorer?",
    content: (
      <>
        <p>
          Climate Policy Radar powers{" "}
          <PageLink external href="https://www.climatepolicyradar.org/what-we-do#tools">
            tools
          </PageLink>{" "}
          from different communities:
        </p>
        <ul>
          <li>Climate Change Laws of the World: How governments plan and act on climate change {EN_DASH} laws, policies, NDCs, and more.</li>
          <li>Climate Litigation Database: Search and analyse the court cases shaping climate accountability worldwide.</li>
          <li>Climate Project Explorer: Projects and funding flows across the four largest multilateral climate funds.</li>
        </ul>
        Climate Policy Radar enables you to search everything {EN_DASH} laws, policies, finance projects, and more {EN_DASH} in one place.
      </>
    ),
  },
  {
    title: "How should I cite the database?",
    content: (
      <>
        <p>When citing use of the Database, you may use this text:</p>
        <p>
          <em>"Sourced from Climate Policy Radar (app.climatepolicyradar.org). Accessed [DATE]."</em>
        </p>
        <p>
          When citing a specific data point(s) (for example, if citing a summary of a document), please refer to Terms and Conditions by our{" "}
          <PageLink external href="https://app.climatepolicyradar.org/terms-of-use#data-from-third-party-sources">
            third party data providers
          </PageLink>
          .
        </p>
      </>
    ),
  },
];
