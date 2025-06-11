import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";

import { Modal } from "../molecules/modal/Modal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const DownloadCsvPopup = ({ isOpen, onClose, onDownload }: IProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download CSV">
      <p>
        Please read our <LinkWithQuery href="/terms-of-use">terms of use</LinkWithQuery>, including any specific terms relevant to commercial use.
        Please contact{" "}
        <ExternalLink url="mailto:partners@climatepolicyradar.org" className="text-text-brand underline">
          partners@climatepolicyradar.org
        </ExternalLink>{" "}
        with any questions. Note that the actual number of entries returned may be 1 or 2 below the total indicated on the search results page.
      </p>
      <div className="flex gap-2">
        <Button onClick={onDownload}>Download</Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
