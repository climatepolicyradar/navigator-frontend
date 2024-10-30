import { ExternalLink } from "@components/ExternalLink";

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
            Find relevant information more easily. The new search function looks for similar and related phrases to search queries (‘semantic
            search’).
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

export const PLATFORMFAQS: TFAQ[] = [
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
    title: "What happens if I choose ‘exact phrase only’?",
    content: (
      <>
        <p>
          Toggling (or clicking on) this option in the sidebar will narrow down your search to only show documents that include the exact words you
          typed in the search bar. However, doing this can mean you will miss out on relevant content, as a search for ‘electric vehicles’ wouldn’t
          pick up ‘EVs’ in the text.
        </p>
      </>
    ),
  },
  {
    title: "What happens if I don’t choose ‘exact phrase only’?",
    content: (
      <>
        <p>
          If you don’t toggle (or click on) ‘exact phrase only’, our new search feature searches the database for similar and related terms to the
          query you typed into the search bar. You will get a richer search experience. Often climate or policy concepts are described in different
          ways by the government actors and policymakers producing the documents (such as petrol cars, internal combustion engine vehicles,
          gasoline-powered cars, etc). This feature uses a technique called natural language processing, which trains computers to understand text and
          the meaning of words and phrases in context. Climate Policy Radar’s team of policy experts is continually working to improve the performance
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
          After typing your search terms into the search bar, narrow down your results by using the sidebar on the left side of the page. . You can
          filter for ‘only exact matches’, regions of the world, specific jurisdictions (or countries), and date ranges.
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
          Processing, which identifies related words and phrases..
        </p>
      </>
    ),
  },
  {
    title: "What do matches: title, summary, document, mean?",
    content: (
      <>
        <p>
          This shows you where your search term, or related phrases, appear in the document: in the title, the summary or the main text of the
          document.
        </p>
      </>
    ),
  },
  {
    title: "Why can’t I see matches in some documents?",
    content: (
      <>
        <p>
          In the future, our tools will scan all the text of all of the documents to highlight references to your search query. At the moment, this
          takes a long time for documents published in different languages and HTML sources, which is why we have chosen to only allow search on the
          title and summary.
        </p>
      </>
    ),
  },
  {
    title: "Why am I being redirected to an external site for some documents?",
    content: (
      <>
        <p>
          Some of our documents aren't yet machine-readable:our tool can’t extract their text and make it searchable. When this happens, our tool will
          look for matches to your search term in the documents’ title and summary. To access the full text you’ll be taken to the document’s source.
        </p>
      </>
    ),
  },
  {
    title: "What are the limitations of our search?",
    content: (
      <>
        <p>
          The database is not exhaustive. We don’t have access to some MCFs documents. Others aren’t currently machine-readable:we can’t yet extract
          the text from them. We also limit the number of matches you can see in a document to 500, so you get quickest, most accurate results. For
          very long documents, or very broad search terms, you might miss some matches.
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
          to an email. Click the ‘download’ button when viewing the document on our tool. Or click the three horizontal dots on the top right of a
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
          Get in touch with the Climate Policy Radar team via email at support@climatepolicyradar.org. We appreciate you taking the time to do this!
        </p>
      </>
    ),
  },
  {
    title: "How are the documents translated to English?",
    content: (
      <>
        <p>
          Documents are translated to English using Google’s Cloud Translation API. Auto-translation does not always capture full meaning and nuance
          from the original language, but we hope it is a useful first step to making documents available to more people.
        </p>
      </>
    ),
  },
  {
    title: "How do I download search results?",
    content: (
      <>
        <p>
          You can download a csv file for "this search" or the "whole database" from the top right of the search results page. A csv file for “this
          search”will contain all documents related to the top 500 entries returned by your search. (The actual number of entries may be 1 or 2 below
          the total indicated on the search results page.)
        </p>
      </>
    ),
  },
  {
    title: "What map and boundaries are used?",
    content: (
      <>
        <p>
          This map was made with the Admin 0 - Countries map package by Natural Earth. Climate Policy Radar's use of this map does not represent an
          opinion on any disputed boundaries.
        </p>
      </>
    ),
  },
];