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
    <a href="#" onClick={handleClick} className={`text-primary-600 hover:text-primary-700 hover:underline transition duration-300 ${className}`}>
      {label ?? show ? "Hide" : "Show"}
    </a>
  );
};
