import { TTarget } from "@/types";

const sourceMapping: Record<string, string> = {
  strategy: "executive",
  plan: "executive",
  law: "legislative",
  framework: "legislative",
  ndc: "executive",
  policy: "executive",
};

export const sortFilterTargets = (targets: TTarget[]) => {
  let t: TTarget[] = [];
  if (!targets) return t;
  t = targets.filter((target) => target["Visibility status"] === "published");

  const netZeroKey = "Net zero target?";
  const ghgKey = "GHG target";
  const sourceKey = "Source";
  const sectorKey = "Sector";
  const sectorToInclude = "economy-wide";

  /* 
    Net zero targets should be first, 
    then GHG targets, 
    then legislative (legal) targets,
    then targets in the economy-wide sector
  */
  t = t.sort((a, b) => {
    if (a[netZeroKey] === "TRUE" && b[netZeroKey] === "FALSE") {
      return -1;
    }
    if (a[netZeroKey] === "FALSE" && b[netZeroKey] === "TRUE") {
      return 1;
    }
    if (a[ghgKey] === "TRUE" && b[ghgKey] === "FALSE") {
      return -1;
    }
    if (a[ghgKey] === "FALSE" && b[ghgKey] === "TRUE") {
      return 1;
    }
    const aSource = sourceMapping[a[sourceKey].toLowerCase()];
    const bSource = sourceMapping[b[sourceKey].toLowerCase()];
    if (aSource === "legislative" && bSource === "executive") {
      return -1;
    }
    if (aSource === "executive" && bSource === "legislative") {
      return 1;
    }
    const aSectorIsValid = a[sectorKey].toLowerCase().includes(sectorToInclude);
    const bSectorIsValid = b[sectorKey].toLowerCase().includes(sectorToInclude);
    if (aSectorIsValid && !bSectorIsValid) {
      return -1;
    }
    if (!aSectorIsValid && bSectorIsValid) {
      return 1;
    }
  });
  return t;
};
