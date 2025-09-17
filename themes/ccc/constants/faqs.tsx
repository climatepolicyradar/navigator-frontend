import { ExternalLink } from "@/components/ExternalLink";
import { PLATFORM_FAQS as GENERIC_PLATFORM_FAQS } from "@/constants/platformFaqs";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
};

export const HOMEPAGE_FAQS: TFAQ[] = [
  {
    title: "What can I do with this tool?",
    content: (
      <>
        <p>TODO</p>
      </>
    ),
  },
  {
    title: "How do I download data?",
    content: (
      <>
        <p>
          You can download the data from your search result by clicking 'download data: this search'. You'll need to{" "}
          <ExternalLink url="https://form.jotform.com/252292116187356">fill out this form</ExternalLink> to request our entire dataset.
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

export const FAQS: TFAQ[] = [
  {
    title: "What is the Climate Litigation Database?",
    content: (
      <>
        <p>TODO</p>
      </>
    ),
  },
  {
    title: "Am I free to download and use the data?",
    content: (
      <>
        <p>TODO</p>
      </>
    ),
  },
  {
    title: "How up-to-date is the data?",
    content: (
      <>
        <p>TODO.</p>
      </>
    ),
  },
];

export const PLATFORM_FAQS: TFAQ[] = [
  {
    title: "What can I do with the Climate Litigation Database?",
    content: (
      <>
        <p>TODO.</p>
      </>
    ),
  },
  {
    title: "How do I download all your data?",
    content: (
      <>
        <p>
          You can download the data from your search result by clicking 'download data: this search'. You'll need to{" "}
          <ExternalLink url="https://form.jotform.com/252292116187356">fill out this form</ExternalLink> to request our entire dataset.
        </p>
      </>
    ),
  },
  {
    title: "What are the limitations of our search?",
    content: (
      <>
        <p>TODO</p>
      </>
    ),
  },
  ...GENERIC_PLATFORM_FAQS,
];
