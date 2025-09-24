import { useState, useRef } from "react";

import MENU_LINKS from "@/ccc/constants/menuLinks";
import { Icon } from "@/components/atoms/icon/Icon";
import DropdownMenuItem from "@/components/menus/DropdownMenuItem";
import DropdownMenuWrapper from "@/components/menus/DropdownMenuWrapper";
import useOutsideAlerter from "@/hooks/useOutsideAlerter";

export const Menu = ({ isNotHome }: { isNotHome: boolean }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setShowMenu(false));

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <div ref={menuRef} className="flex items-center relative z-[41]">
      <button data-cy="menu-icon" onClick={toggleMenu} aria-label="Toggle menu" className={`${isNotHome ? "text-white" : "text-text-primary"}`}>
        <Icon name="menu" color={isNotHome ? "white" : "text-text-primary"} width="32" height="32" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-[100%] z-50">
          <DropdownMenuWrapper>
            {MENU_LINKS.map((link, index) => (
              <DropdownMenuItem
                key={index}
                {...link}
                title={link.text}
                external={link.href === "/"}
                setShowMenu={setShowMenu}
                first={index === 0}
                cy={`navigation-${link.cy}`}
              />
            ))}
          </DropdownMenuWrapper>
        </div>
      )}
    </div>
  );
};
