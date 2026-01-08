import { JSX } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { PLATFORM_FAQS as GENERIC_PLATFORM_FAQS } from "@/constants/platformFaqs";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
};

export const FAQS: TFAQ[] = [
  {
    title: "What is Climate Policy Radar?",
    content: (
      <>
        <p>
          Climate Policy Radar builds responsible AI tools for climate action. A UK-based not-for-profit, our data and tools support governments,
          researchers, international organisations, civil society, and the private sector in their decision-making pertaining to climate policy, law
          and/or finance.
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
          <ExternalLink url="https://form.jotform.com/250202141318339">fill out our form</ExternalLink>.
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
          documents. We add these to the database on a rolling basis. Submissions to the UN portals were first added on the 23rd of May 2023, and are
          checked for updates regularly. If you're aware of documents that are missing, please let us know using our{" "}
          <ExternalLink url="https://form.jotform.com/250974303048355">data contributors form</ExternalLink>.
        </p>
      </>
    ),
  },
];

export const PLATFORM_FAQS: TFAQ[] = [
  {
    title: "What can I do with your tool?",
    content: (
      <>
        <ul>
          <li>
            Find climate and climate-related laws, policies, strategies and action plans from every country and submissions to UN Conventions relevant
            to country level action
          </li>
          <li>Find data from 4 biggest Multilateral Climate Funds, including project summaries, implementation documents and project guidance</li>
          <li>Search for keywords and policy topics (like 'electric vehicles' or 'gender equality') across the full text of all documents</li>
          <li>View your search term (and related phrases) highlighted in search results</li>
          <li>Browse country profiles to find and compare their climate laws, policies and strategies</li>
          <li>
            Access the raw data: you just need to fill out <ExternalLink url="https://form.jotform.com/250202141318339">this form</ExternalLink> to
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
          Please <ExternalLink url="https://form.jotform.com/250202141318339">fill out this form </ExternalLink>
          to request our entire dataset.
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
          yet extract the text from them. We also limit the number of matches you can see in a document to 500, so you get quickest, most accurate
          results. For very long documents, or very broad search terms, you might miss some matches.
        </p>
      </>
    ),
  },
  ...GENERIC_PLATFORM_FAQS,
];
