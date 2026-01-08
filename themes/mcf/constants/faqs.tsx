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
    title: "What happened to the individual fund websites?",
    content: (
      <>
        <p>
          The Multilateral Climate Funds (MCFs) have created this joint platform as a single-entry point to access and explore the MCFs project
          documents and policies. It is designed to enhance your experience and provide new features to help you navigate and interact with the data
          from all the funds in one place. This platform is not intended to replace the MCFs’ respective websites and databases, which remain
          operational.
        </p>
        <p>Key features of the platform:</p>
        <ul>
          <li>Conduct searches in the database using the full text of documents. This improves the comprehensiveness of your search results.</li>
          <li>
            Find relevant information more easily. The new search function looks for similar and related phrases to search queries (semantic search).
          </li>
          <li>
            See where a search term or relevant text appears in a document, with relevant passages of text automatically highlighted in yellow to help
            you quickly identify important information.
          </li>
          <li>
            Search for and explore documents from various MCF websites, including the Adaptation Fund, Climate Investment Funds, Global Environment
            Facility and Green Climate Fund.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "What is Climate Project Explorer?",
    content: (
      <>
        <p>
          The Multilateral Climate Funds (MCFs) Climate Project Explorer (CPE) is a publicly accessible platform that consolidates data from the four
          multilateral climate funds into a comprehensive knowledge resource. It aims to raise awareness of the MCFs’ efforts, value, and impact and
          facilitate the exchange of information to enhance access to the funds and promote transparency. Explore the platform to gain valuable
          insights into climate projects and programmes and their significance.
        </p>
      </>
    ),
  },
  {
    title: "What is the difference between the Climate Project Explorer and Climate Policy Radar?",
    content: (
      <>
        <p>
          Climate Policy Radar (CPR) is a UK not-for-profit, which is organising, analysing and democratising data for climate action, who publish the
          Climate Policy Radar app. CPR has partnered with the Multilateral Climate Funds to launch the Climate Project Explorer, using CPR’s
          technology to help you get more out of MCF’s data. These resources have the same data, features and functionality.
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
          <ExternalLink url="https://form.jotform.com/242902819253357">fill out our form</ExternalLink>.
        </p>
        <p>When using or sharing the data, please ensure that the original authors (i.e., MCF(s)) are properly credited as sources of information.</p>
        <p>For more information on the terms and conditions of the individual MCFs, please visit these sites:</p>
        <ul>
          <li>
            Adaptation Fund:{" "}
            <ExternalLink url="https://www.adaptation-fund.org/documents-publications/legal-documents/">
              https://www.adaptation-fund.org/documents-publications/legal-documents/
            </ExternalLink>
            and{" "}
            <ExternalLink url="https://www.worldbank.org/en/about/legal/terms-and-conditions">
              https://www.worldbank.org/en/about/legal/terms-and-conditions
            </ExternalLink>
          </li>
          <li>
            Climate Investment Funds: <ExternalLink url="https://www.cif.org/disclaimer">https://www.cif.org/disclaimer</ExternalLink>
          </li>
          <li>
            Global Environment Facility: <ExternalLink url="https://www.thegef.org/legal">https://www.thegef.org/legal</ExternalLink>
          </li>
          <li>
            Green Climate Fund:{" "}
            <ExternalLink url="https://www.greenclimate.fund/terms-and-conditions">https://www.greenclimate.fund/terms-and-conditions </ExternalLink>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How up-to-date is the data?",
    content: (
      <>
        <p>The platform's data is regularly updated based on the publication date of new or updated documents from individual MCFs.</p>
      </>
    ),
  },
  {
    title: "What kind of projects do you have in your database?",
    content: (
      <>
        <p>
          The Climate Project Explorer platform contains all publicly available project documents (e.g., concept notes, full proposal and
          implementation reports) and policies of the four Multilateral Climate Funds. The platform is regularly updated based on the publication of
          new or updated documents from the individual MCFs.
        </p>
      </>
    ),
  },
];

export const PLATFORM_FAQS: TFAQ[] = [
  {
    title: "What can I do with the Climate Project Explorer?",
    content: (
      <>
        <p>The Climate Project Explorer makes it easier for you to:</p>
        <ul>
          <li>Find data from all 4 MCF funds, including project summaries, implementation documents and project guidance.</li>
          <li>Search for keywords and focus areas across the full text of documents from all 4 funds.</li>
          <li>See where your search terms show up in your results.</li>
          <li>Browse country profiles to find and compare initiatives from all 4 funds.</li>
          <li>
            Contact CPR for a copy of the raw data by{" "}
            <ExternalLink url="https://form.jotform.com/242902819253357">filling out this form</ExternalLink>
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
          Please <ExternalLink url="https://form.jotform.com/242902819253357">fill out this form </ExternalLink>
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
          The database is not exhaustive. We don't have access to some MCF documents. Others aren't currently machine-readable: we can't yet extract
          the text from them. We also limit the number of matches you can see in a document to 500, so you get quickest, most accurate results. For
          very long documents, or very broad search terms, you might miss some matches.
        </p>
      </>
    ),
  },
  ...GENERIC_PLATFORM_FAQS,
];
