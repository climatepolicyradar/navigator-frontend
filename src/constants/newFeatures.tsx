import _ from "lodash";

type NewFeature = {
  featureValue: number;
  popupTitle?: string;
  popupDescription: string;
  popupCTA: string;
  modalTitle: string;
  modalContent: React.ReactNode;
};

export const NEW_FEATURES: NewFeature[] = [
  {
    featureValue: 1,
    popupTitle: "New Improvements",
    popupDescription: "You can now find what you're looking for faster.",
    popupCTA: "More Info",
    modalTitle: "New Improvements",
    modalContent: (
      <>
        <p className="w-full">
          Climate Policy Radar have introduced a new layer of structure to the data, automatically identifying mentions of key climate concepts in
          documents.
        </p>
        <div className="bg-text-tertiary w-[500px] h-[300px] flex items-center justify-center text-white">(image: knowledge graph)</div>
        <p className="w-full">
          Moving beyond simple search + browse, this feature will help you quickly find where important topics (i.e. economic sectors, targets, and
          climate finance instruments) appear across the database.
        </p>
        <div className="bg-text-tertiary w-[500px] h-[300px] flex items-center justify-center text-white">
          (image: block with specific concept search or whatever is most useful)
        </div>
        <p className="w-full">You will now be able to identify the primary focuses of each document faster too.</p>
        <div className="bg-text-tertiary w-[500px] h-[300px] flex items-center justify-center text-white">
          (shot of the count of key concepts within each document)
        </div>
      </>
    ),
  },
];

export const LATEST_FEATURE = _.orderBy(NEW_FEATURES, "featureValue", "desc")[0];
