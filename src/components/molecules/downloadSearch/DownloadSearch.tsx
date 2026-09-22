import { Popover as BasePopover } from "@base-ui/react/popover";
import { LucideChevronDown, LucideDownload, LucideFileText, LucideSearch } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useContext, useState } from "react";

import { SearchDocumentsSortKey } from "@/api/search";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { posthogEventName } from "@/context/PostHogProvider";
import { ThemeContext } from "@/context/ThemeContext";
import { useDownloadSearchCsv } from "@/hooks/useDownloadSearchCsv";
import { TSearchQueryGroup } from "@/types";

import { DownloadSearchModal } from "./DownloadSearchModal";

interface IProps {
  hasSearch: boolean;
  query?: string;
  filters?: TSearchQueryGroup;
  sort: SearchDocumentsSortKey;
  totalResults: number | null;
}

export const DownloadSearch = ({ hasSearch, query, filters, sort, totalResults }: IProps) => {
  const { themeConfig } = useContext(ThemeContext);
  const posthog = usePostHog();
  const [isModalOpenRequest, setIsModalOpenRequest] = useState(false);
  const { status, download, resetStatus } = useDownloadSearchCsv();

  const trackAllDataDownload = () => {
    posthog?.capture(posthogEventName("search", "download", "click"), {
      download_type: "all_data",
      download_url: themeConfig.links.downloadDatabase,
    });
  };

  // Closes on a successful download rather than showing a success state in the modal.
  const isModalOpen = isModalOpenRequest && status !== "success";

  const openModal = () => {
    resetStatus();
    setIsModalOpenRequest(true);
  };
  const closeModal = () => {
    setIsModalOpenRequest(false);
    resetStatus();
  };

  return (
    <>
      <BasePopover.Root>
        <BasePopover.Trigger className="group inline-flex gap-1 items-center">
          <LucideDownload size={16} className="text-text-brand" />
          <span className="text-sm text-text-primary font-medium leading-5">Download</span>
          <LucideChevronDown size={16} className="text-elem-icon" />
        </BasePopover.Trigger>
        <BasePopover.Portal>
          <BasePopover.Positioner positionMethod="fixed" side="bottom" sideOffset={4} align="end">
            <BasePopover.Popup className="p-2 bg-bg-primary border border-border-normal rounded-lg text-sm text-text-primary font-medium leading-5">
              <PageLink
                external
                href={themeConfig.links.downloadDatabase}
                onClick={trackAllDataDownload}
                className="px-2 py-1 flex gap-2 items-center hover:bg-bg-flat"
              >
                <LucideFileText size={16} className="text-elem-icon" />
                <span>All data</span>
              </PageLink>
              <BasePopover.Close
                type="button"
                disabled={!hasSearch}
                onClick={openModal}
                className="px-2 py-1 flex gap-2 items-center hover:bg-bg-flat disabled:opacity-[0.4] disabled:cursor-not-allowed! disabled:hover:bg-transparent"
              >
                <LucideSearch size={16} />
                <span>This search only</span>
              </BasePopover.Close>
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
      <DownloadSearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={() => download({ query, filters, sort })}
        status={status}
        totalResults={totalResults}
      />
    </>
  );
};
