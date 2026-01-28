import { JSX } from "react";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
};

export const PLATFORM_FAQS: TFAQ[] = [
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
          filter for 'only exact matches', regions of the world, specific jurisdictions (or countries), and date ranges.
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
    title: "Why can't I see matches in some documents?",
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
          Some of our documents aren't yet machine-readable: our tool can't extract their text and make it searchable. When this happens, our tool
          will look for matches to your search term in the documents' title and summary. To access the full text you'll be taken to the document's
          source.
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
          Documents are translated to English using Google's Cloud Translation API. Auto-translation does not always capture full meaning and nuance
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
          search” will contain all documents related to the top 500 entries returned by your search. (The actual number of entries may be 1 or 2 below
          the total indicated on the search results page.)
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
];
