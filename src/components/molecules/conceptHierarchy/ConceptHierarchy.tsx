import { Fragment, ReactNode } from "react";

import { ARROW_RIGHT } from "@/constants/chars";
import { TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

type TProps = {
  concept: TFamilyConceptTreeNode;
};

// Concepts can have multiple children, each with their own nested children
// In the case of multiple children we display the parent concept for each instance of the child
export const ConceptHierarchy = ({ concept }: TProps) => {
  if (concept.children.length === 0) {
    return <span key={concept.id}>{concept.preferred_label}</span>;
  }
  return (
    <>
      {concept.children.map((child, parentIndex) => (
        <span key={child.id}>
          {concept.preferred_label}
          {concept.children.length > 0 && hierarchyArrow}
          {child.preferred_label}
          {child.children.map((child) => (
            <Fragment key={child.id}>
              {parentIndex > 0 && hierarchyArrow}
              <ConceptHierarchy concept={child} />
            </Fragment>
          ))}
        </span>
      ))}
    </>
  );
};
