import { useState, useRef } from "react";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import { MenuIcon } from "@components/svg/Icons";
import DropdownMenuItem from "@components/menus/DropdownMenuItem";
import DropdownMenuWrapper from "@components/menus/DropdownMenuWrapper";
import MENU_LINKS from "../constants/menuLinks";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div ref={menuRef} className="ml-4 h-full flex items-center relative z-[41]">
      <button data-cy="menu-icon" onClick={toggleMenu}>
        <MenuIcon />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-[100%] z-50">
          <DropdownMenuWrapper>
            {MENU_LINKS.map((link, index) => (
              <DropdownMenuItem key={index} {...link} title={link.text} setShowMenu={setShowMenu} first={index === 0} />
            ))}
          </DropdownMenuWrapper>
        </div>
      )}
    </div>
  );
};
