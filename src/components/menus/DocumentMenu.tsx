import { useState, useRef } from "react";
import { TDocumentPage } from "@types";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import Kebab from "../buttons/Kebab";
import DropdownMenuItem from "./DropdownMenuItem";
import DropdownMenuWrapper from "./DropdownMenuWrapper";

type TProps = {
  document: TDocumentPage;
  family_url: string;
};

const ToggleDocumentMenu = ({ document, family_url }: TProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  return (
    <div ref={menuRef} className="flex-shrink-0 mr-4">
      <Kebab onClick={setShowMenu(!showMenu)} />
      <div className={`${!showMenu ? "hidden" : ""} absolute top-0 right-0 mt-12 mr-4 z-50`}>
        <DropdownMenuWrapper>
          <DropdownMenuItem href={document.cdn_object} title="Download PDF" setShowMenu={setShowMenu} />
          <DropdownMenuItem href={`/document/${family_url}`} title="View document details" setShowMenu={setShowMenu} />
        </DropdownMenuWrapper>
      </div>
    </div>
  );
};
export default ToggleDocumentMenu;
