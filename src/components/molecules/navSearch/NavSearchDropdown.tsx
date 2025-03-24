import { Icon } from "@/components/atoms/icon/Icon";
import { useEffect, useRef, useState } from "react";

interface NavSearchDropdownProps {
  contextualSearchName: string;
  isEverything: boolean;
  setIsEverything: (newValue: boolean) => void;
}

type DropdownOption = {
  name: string;
  value: boolean;
};

export const NavSearchDropdown = ({ contextualSearchName, isEverything, setIsEverything }: NavSearchDropdownProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleFocusOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleTab = (event: KeyboardEvent) => {
      if (event.key === "Tab" && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleFocusOutside, true);
    document.addEventListener("keyup", handleTab, true);

    return () => {
      document.removeEventListener("click", handleFocusOutside, true);
      document.removeEventListener("keyup", handleTab, true);
    };
  }, [ref]);

  // Show the other option below the currently selected one
  const dropdownOptions: DropdownOption[] = [
    {
      name: "Everything",
      value: true,
    },
    {
      name: contextualSearchName,
      value: false,
    },
  ];
  if (!isEverything) dropdownOptions.reverse();
  const [firstOption, secondOption] = dropdownOptions;

  const handleClick = (newValue: boolean) => {
    setIsOpen((current) => !current);
    if (isOpen) setIsEverything(newValue);
  };

  const optionClasses = "h-full flex items-center gap-2 pl-3 pr-4 bg-surface-ui text-sm leading-4 cursor-pointer";

  return (
    <div ref={ref} className="border-l border-l-border-light">
      <button
        type="button"
        onClick={() => handleClick(firstOption.value)}
        className={`${optionClasses} ${isOpen ? "rounded-tr-md" : "rounded-r-md"}`}
      >
        {firstOption.name}
        <div className={isOpen ? "invisible" : ""}>
          <Icon name="downChevron" height="12" width="12" />
        </div>
      </button>
      {isOpen && (
        <button type="button" onClick={() => handleClick(secondOption.value)} className={`${optionClasses} w-full rounded-b-md`}>
          {secondOption.name}
        </button>
      )}
    </div>
  );
};
