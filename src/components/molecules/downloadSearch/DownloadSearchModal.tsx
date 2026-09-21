import { LucideLoader } from "lucide-react";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";
import { Modal } from "@/components/molecules/modal/Modal";
import { TApiLoadingStatus } from "@/types";

const DOWNLOAD_CAP = 500;

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  status: TApiLoadingStatus;
  totalResults: number | null;
}

export const DownloadSearchModal = ({ isOpen, onClose, onDownload, status, totalResults }: IProps) => {
  const cappedCount = Math.min(totalResults ?? 0, DOWNLOAD_CAP);
  const isLoading = status === "loading";
  const buttonLabel = (totalResults ?? 0) > DOWNLOAD_CAP ? `Download first ${DOWNLOAD_CAP} results` : `Download ${cappedCount} results`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download results as CSV">
      <p>
        Please read our <LinkWithQuery href="/terms-of-use">terms of use</LinkWithQuery>, including any specific terms relevant to commercial use.
        Please contact{" "}
        <ExternalLink url="mailto:partners@climatepolicyradar.org" className="text-[#0038a9] underline">
          partners@climatepolicyradar.org
        </ExternalLink>{" "}
        with any questions. This search allows you to download a maximum of {DOWNLOAD_CAP} results.
      </p>
      {status === "error" && <p className="text-red-600">There was an error downloading the CSV. Please try again.</p>}
      <div className="flex gap-2">
        <Button onClick={onDownload} disabled={isLoading} content={isLoading ? "both" : "text"}>
          {isLoading && <LucideLoader size={16} className="animate-spin" />}
          {buttonLabel}
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
