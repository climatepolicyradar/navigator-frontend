import { useState, useRef } from "react";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";
import { Icon } from "@components/atoms/icon/Icon";
import DropdownMenuItem from "@components/menus/DropdownMenuItem";
import DropdownMenuWrapper from "@components/menus/DropdownMenuWrapper";
import MENU_LINKS from "@cclw/constants/menuLinks";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div ref={menuRef} className="flex items-center relative z-[41]">
      <button data-cy="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
        <Icon name="menu" color="white" width="32" height="32" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-[100%] z-50">
          <DropdownMenuWrapper>
            {MENU_LINKS.map((link, index) => (
              <DropdownMenuItem key={index} {...link} title={link.text} setShowMenu={setShowMenu} first={index === 0} cy={`navigation-${link.cy}`} />
            ))}
          </DropdownMenuWrapper>
        </div>
      )}
    </div>
  );
};
