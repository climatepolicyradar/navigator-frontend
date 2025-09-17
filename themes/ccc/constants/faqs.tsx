import { PLATFORM_FAQS as GENERIC_PLATFORM_FAQS } from "@/constants/platformFaqs";

type TFAQ = {
  id?: string;
  title: string;
  content: JSX.Element;
};

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
        <p>TODO</p>
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
