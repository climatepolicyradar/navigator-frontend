import { TEventCategory } from "@types";
import { LawIcon, PolicyIcon, CaseIcon, TargetIcon } from "@components/svg/Icons";

export const getCategoryIcon = (category: TEventCategory, size?: string) => {
  let icon: JSX.Element;
  switch (category) {
    case "Litigation":
      icon = <CaseIcon height={size} width={size} />;
      break;
    case "Legislative":
      icon = <LawIcon height={size} width={size} />;
      break;
    case "Executive":
      icon = <PolicyIcon height={size} width={size} />;
      break;
    case "Target":
      icon = <TargetIcon height={size} width={size} />;
      break;
  }
  return icon;
};
