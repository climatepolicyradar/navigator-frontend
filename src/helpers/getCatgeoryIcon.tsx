import { TEventCategory } from "@types";
import { LawIcon, PolicyIcon, CaseIcon, TargetIcon, UNFCCCIcon } from "@components/svg/Icons";

export const getCategoryIcon = (category: TEventCategory, size?: string) => {
  let icon: JSX.Element;
  switch (category) {
    case "Litigation":
      icon = <CaseIcon height={size} width={size} />;
      break;
    case "Legislative":
    case "Law":
      icon = <LawIcon height={size} width={size} />;
      break;
    case "Executive":
    case "Policy":
      icon = <PolicyIcon height={size} width={size} />;
      break;
    case "Target":
      icon = <TargetIcon height={size} width={size} />;
      break;
    case "UNFCCC":
      icon = <UNFCCCIcon height={size} width={size} />;
      break;
  }
  return icon;
};
