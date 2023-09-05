type TShowHideControlProps = {
  show: boolean;
  label?: string;
  onClick: () => void;
  className?: string;
};

export const ShowHide = ({ show, label, onClick, className }: TShowHideControlProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <a href="#" onClick={handleClick} className={`${className}`}>
      {label ?? show ? "Hide" : "Show"}
    </a>
  );
};
