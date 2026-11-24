import { LucideScanSearch } from "lucide-react";
import Image from "next/image";

import { TutorialButton } from "@/components/molecules/tutorials/TutorialButton";
import { TTutorials } from "@/types";

import { EN_DASH } from "./chars";

export const TUTORIALS: TTutorials = {
  climateLitigationDatabase: {
    featureKey: "litigation",
    modal: {
      defaultOpen: true,
      getModalProps: ({ actions, name }) => ({
        headerImage: <Image src="/images/features/ccc.jpg" alt="The logo of Sabin Center for Climate Change Law" width={920} height={400} />,
        title: "Welcome to our new site",
        showCloseButton: true,
        children: (
          <>
            <p>
              The Climate Litigation Database is the most comprehensive resource tracking climate change litigation worldwide. Please bear with us
              while we make some exciting new updates.
            </p>
            <TutorialButton action="dismiss" actions={actions} name={name} use="modal" text="I understand" variant="outlined" color="mono" />
          </>
        ),
      }),
    },
  },
  newSearch: {
    modal: {
      defaultOpen: true,
      pages: ["/search"],
      getModalProps: ({ actions, name }) => ({
        cardClasses: "max-w-90! sm:max-w-180! px-10! py-10!",
        children: (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-[#1A4F8C0D] rounded-full">
                <LucideScanSearch size={24} className="text-text-brand" />
              </div>
              <p className="text-base text-text-primary text-center font-medium leading-6">Welcome to our new search experience</p>
              <p className="text-base text-text-secondary text-center font-normal leading-6">
                We have upgraded our search tool to deliver more accurate full text and document search results, including specific passages.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-text-secondary text-center text-balance font-normal leading-4">
              <div className="flex flex-col gap-3 items-center">
                <Image
                  src="/images/features/new-search-modal-1.png"
                  alt="A screenshot showing a search result"
                  width={328}
                  height={328}
                  className="w-40 h-40"
                />
                <p className="max-w-50">Search full document text, titles, summaries, and metadata in one place.</p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <Image
                  src="/images/features/new-search-modal-2.png"
                  alt="A screenshot showing a list of filters"
                  width={328}
                  height={328}
                  className="w-40 h-40"
                />
                <p className="max-w-50">
                  Use 100+ Topic filters to find results relevant to key Topics (like '<em>wind energy</em>' or '<em>drought</em>').
                </p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <Image
                  src="/images/features/new-search-modal-3.png"
                  alt="A screenshot showing passage matches in document search"
                  width={328}
                  height={328}
                  className="w-40 h-40"
                />
                <p className="max-w-50">See exact matches and related phrases highlighted in the text {EN_DASH} including translations.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <TutorialButton
                pageLink={{ external: true, href: "/faq" }}
                action="dismiss"
                actions={actions}
                name={name}
                use="modal"
                text="More information"
                variant="outlined"
                className="px-3! py-2! bg-paper! hover:bg-paper! border-border-normal! text-text-tertiary!"
              />
              <TutorialButton
                action="dismiss"
                actions={actions}
                name={name}
                use="modal"
                text="Start searching"
                variant="solid"
                className="px-3! py-2! bg-bg-brand hover:bg-bg-brand!"
              />
            </div>
          </div>
        ),
        showCloseButton: false,
      }),
    },
  },
} as const;
