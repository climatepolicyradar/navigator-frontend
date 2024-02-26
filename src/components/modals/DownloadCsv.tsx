import { ExternalLink } from "@components/ExternalLink";
import Button from "@components/buttons/Button";
import Popup from "./Popup";
import { LinkWithQuery } from "@components/LinkWithQuery";

type TProps = {
  active: boolean;
  onCancelClick: () => void;
  onConfirmClick: () => void;
};

export const DownloadCsvPopup = ({ active, onCancelClick, onConfirmClick }: TProps) => {
  return (
    <Popup active={active} onCloseClick={onCancelClick}>
      <div className="flex flex-col items-center">
        <h3 className="mb-4 block">Download CSV</h3>
        <p className="mb-4">
          Please read our <LinkWithQuery href="/terms-of-use">terms of use</LinkWithQuery>, including any specific terms relevant to commercial use.
          Please contact <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink> with any questions.
        </p>
        <div className="flex">
          <Button onClick={onConfirmClick}>Download</Button>
          <Button color="ghost" onClick={onCancelClick}>
            Cancel
          </Button>
        </div>
      </div>
    </Popup>
  );
};
