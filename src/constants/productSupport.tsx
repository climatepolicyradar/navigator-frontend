import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TProductSupport, TProductSupportKey } from "@/types";

export const PRODUCT_SUPPORT: Record<TProductSupportKey, TProductSupport> = {
  mostRecent: {
    title: "Most recent",
    items: ["howWeDate", "whichDateMostRecent"],
  },
  searchInsideDoc: {
    title: "Search inside document text",
    items: ["howTextSearch"],
  },
  textHighlighting: {
    title: "Text highlighting",
    items: ["howTextSearch", "whyTopicsNoHighlight"],
  },
  topics: {
    title: "Topics",
    items: [
      "searchDocsForTopics",
      "howUseTopics",
      "whatMultipleTopics",
      {
        title: "Where can I find out more about the Topics feature?",
        content: (
          <p>
            Take a look at the Topics section in our FAQs to find out what Topics are available, our methodology, accuracy rates and more.{" "}
            <PageLink href="/faqs">Go to FAQs</PageLink>.
          </p>
        ),
      },
    ],
  },
};
