import { LucideInfo } from "lucide-react";
import { ReactNode } from "react";

import { ProductSupport } from "@/components/molecules/productSupport/ProductSupport";

export const FilterHeaderTopics: ReactNode = (
  <div className="pb-2 flex gap-1">
    <LucideInfo size={16} className="pt-0.5 h-full shrink-0 text-text-brand" />
    <p className="text-xs text-text-primary font-normal leading-4">
      Search for documents most relevant to key Topics and see the exact text passages where they are mentioned.{" "}
      <ProductSupport
        content="topics"
        className="inline-block text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
      >
        Learn more
      </ProductSupport>
    </p>
  </div>
);
