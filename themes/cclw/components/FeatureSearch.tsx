import Link from "next/link";

import { Feature } from "@/cclw/components/Feature";
import { Icon } from "@/components/atoms/icon/Icon";

export const FeatureSearch = () => (
  <Feature
    heading="Contextual search"
    contentSide="right"
    image="app_document_highlighting.jpg"
    imageAlt="Screenshot of the passage highlighting on a document"
  >
    <p className="text-xl my-4">
      Instantly find the information you are looking for through exact matches and related phrases highlighted in the text.
    </p>
    <p className="text-xl my-4">Access English translations of document passages written in different languages.</p>
    <div data-cy="feedback" className="bg-cclw-light rounded-3xl p-4 mt-8">
      <div className="font-medium text-xl flex gap-2">
        <Icon name="lightblub" /> Try this out
      </div>
      <Link
        href="/documents/adaptation-strategy-to-climate-change-in-the-czech-republic_213b?q=flood+defence"
        className="text-white hover:text-gray-100 hover:underline"
      >
        See search results for “<b>Flood defence</b>” highlighted and translated in the document "<i>Adaptation strategy to climate change</i>"
      </Link>
    </div>
  </Feature>
);
