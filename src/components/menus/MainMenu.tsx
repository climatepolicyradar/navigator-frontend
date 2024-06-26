import { useState, useRef } from "react";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import { MenuIcon } from "../svg/Icons";
import DropdownMenuItem from "./DropdownMenuItem";
import DropdownMenuWrapper from "./DropdownMenuWrapper";

const MainMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div ref={menuRef} className="relative z-[41]">
      <button data-cy="menu-icon" onClick={toggleMenu} className="text-white" aria-label="Toggle menu">
        <MenuIcon />
      </button>
      {showMenu && (
        <div className="absolute right-0 z-50">
          <DropdownMenuWrapper>
            <DropdownMenuItem external={true} href="https://climatepolicyradar.org" title="About us" first={true} setShowMenu={setShowMenu} />
            <DropdownMenuItem
              external={true}
              href="https://github.com/climatepolicyradar/methodology"
              title="Methodology"
              setShowMenu={setShowMenu}
            />
          </DropdownMenuWrapper>
        </div>
      )}
    </div>
  );
};
export default MainMenu;
