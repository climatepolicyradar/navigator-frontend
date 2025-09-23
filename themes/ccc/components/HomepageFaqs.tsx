import { FaqSection } from "@/components/FaqSection";
import { Columns } from "@/components/atoms/columns/Columns";

import { HOMEPAGE_FAQS } from "../constants/faqs";

export const HomepageFaqs = () => (
  <div className="pt-15">
    <Columns>
      <aside className="flex flex-col items-start cols-2:col-span-2 cols-3:col-span-1">
        <p className="text-3xl font-semibold text-text-primary">Frequently Asked Questions</p>
      </aside>

      <main className="cols-2:col-span-2 cols-3:col-span-2 cols-4:col-span-3">
        <div className="w-full text-text-secondary flex flex-col gap-6">
          <div className="w-full">
            <FaqSection faqs={HOMEPAGE_FAQS} showMore={true} openFirstOnLoad={false} />
          </div>
        </div>
      </main>
    </Columns>
  </div>
);
