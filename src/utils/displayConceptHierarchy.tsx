import { Fragment, ReactNode } from "react";

import { ARROW_RIGHT } from "@/constants/chars";
import { TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

export const displayConceptHierarchy = (concept: TFamilyConceptTreeNode): ReactNode => {
  if (concept.children.length === 0) {
    return <span key={concept.id}>{concept.preferred_label}</span>;
  }
  return (
    <span key={concept.id}>
      {concept.preferred_label}
      {concept.children.length > 0 && hierarchyArrow}
      {concept.children.map((child, index) => (
        <Fragment key={child.id}>
          {index > 0 && hierarchyArrow}
          {displayConceptHierarchy(child)}
        </Fragment>
      ))}
    </span>
  );
};
