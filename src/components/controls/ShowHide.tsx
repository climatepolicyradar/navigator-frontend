interface IProps {
  show: boolean;
  label?: string;
  onClick: () => void;
  className?: string;
}

export const ShowHide = ({ show, label, onClick, className }: IProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <a href="#" onClick={handleClick} className={`text-blue-600 hover:text-blue-800 hover:underline ${className}`}>
      {label ?? show ? "Hide" : "Show"}
    </a>
  );
};
