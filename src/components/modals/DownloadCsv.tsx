import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/atoms/button/Button";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Heading } from "@/components/typography/Heading";
import Popup from "./Popup";

type TProps = {
  active: boolean;
  onCancelClick: () => void;
  onConfirmClick: () => void;
};

export const DownloadCsvPopup = ({ active, onCancelClick, onConfirmClick }: TProps) => {
  return (
    <Popup active={active} onCloseClick={onCancelClick}>
      <div className="flex flex-col items-center">
        <Heading level={3}>Download CSV</Heading>
        <p className="mb-4">
          Please read our <LinkWithQuery href="/terms-of-use">terms of use</LinkWithQuery>, including any specific terms relevant to commercial use.
          Please contact{" "}
          <ExternalLink url="mailto:partners@climatepolicyradar.org" className="underline text-blue-600 hover:text-blue-800">
            partners@climatepolicyradar.org
          </ExternalLink>{" "}
          with any questions. Note that the actual number of entries returned may be 1 or 2 below the total indicated on the search results page.
        </p>
        <div className="flex">
          <Button rounded onClick={onConfirmClick}>
            Download
          </Button>
          <Button rounded variant="ghost" onClick={onCancelClick}>
            Cancel
          </Button>
        </div>
      </div>
    </Popup>
  );
};
