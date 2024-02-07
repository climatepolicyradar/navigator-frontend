import { ExternalLink } from "@components/ExternalLink";
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
        <h2 className="text-2xl font-bold mb-4">Download CSV</h2>
        <p className="text-lg mb-4">
          Please read our Terms of Use, including any specific terms relevant to commercial use. Please contact{" "}
          <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink> with any questions.
        </p>
        <div className="flex justify-between w-1/2">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg" onClick={onConfirmClick}>
            Download
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg" onClick={onCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </Popup>
  );
};
