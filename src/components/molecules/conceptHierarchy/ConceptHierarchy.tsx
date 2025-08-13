import { Fragment, ReactNode } from "react";

import { ARROW_RIGHT } from "@/constants/chars";
import { TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

type TProps = {
  concept: TFamilyConceptTreeNode;
};

export const ConceptHierarchy = ({ concept }: TProps) => {
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
          <ConceptHierarchy concept={child} />
        </Fragment>
      ))}
    </span>
  );
};
