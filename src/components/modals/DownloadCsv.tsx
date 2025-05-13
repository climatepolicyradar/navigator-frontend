import { Button } from "@/components/atoms/button/Button";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Heading } from "@/components/typography/Heading";
import { Modal } from "../molecules/modal/Modal";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
};

export const DownloadCsvPopup = ({ isOpen, onClose, onDownload }: TProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <Button rounded onClick={onDownload}>
            Download
          </Button>
          <Button rounded variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
