import { MouseEventHandler, useState } from "react";

type TProps = {
  title: string;
  children: JSX.Element;
  startOpen?: boolean;
  className?: string;
};

export const AccordianItem = ({ title, children, startOpen = false, className }: TProps) => {
  const [open, setOpen] = useState(startOpen);

  const handleClick = (e: any) => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <div className="mb-4">
      <a href="#" className={`accordian-item ${className ?? ""}`} onClick={(e) => handleClick(e)}>
        <span>{title}</span>
        <span className={`arrow border-indigo-600 ml-6 ${open ? "up" : "down"}`} />
      </a>
      <div className={`${open ? "block" : "hidden"}`}>{children}</div>
    </div>
  );
};
