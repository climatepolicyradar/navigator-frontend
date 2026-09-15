import { Popover as BasePopover } from "@base-ui/react/popover";
import { LucideChevronDown, LucideDownload, LucideFileText, LucideSearch } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useContext } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { posthogEventName } from "@/context/PostHogProvider";
import { ThemeContext } from "@/context/ThemeContext";

export const DownloadSearch = () => {
  const { themeConfig } = useContext(ThemeContext);
  const posthog = usePostHog();

  const trackAllDataDownload = () => {
    posthog?.capture(posthogEventName("search", "download", "click"), {
      download_type: "all_data",
      download_url: themeConfig.links.downloadDatabase,
    });
  };

  return (
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
            <button type="button" disabled className="px-2 py-1 flex gap-2 items-center opacity-[0.4] cursor-not-allowed!">
              <LucideSearch size={16} className="" />
              <span>This search only</span>
            </button>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
