import { useState, useEffect } from "react";
import { useRouter } from "next/router";

type TProps = {
  id?: string;
  title: string;
  children: JSX.Element;
  startOpen?: boolean;
  className?: string;
};

export const AccordianItem = ({ id, title, children, startOpen = false, className }: TProps) => {
  const { asPath } = useRouter();
  const [open, setOpen] = useState(startOpen);

  const handleClick = (e: any) => {
    e.preventDefault();
    setOpen(!open);
  };

  useEffect(() => {
    const hash = asPath.split("#")[1];
    if (hash !== "" && id !== undefined) {
      setOpen(hash === id);
    }
  }, [asPath, id]);

  return (
    <div className="mb-4" id={id}>
      <a href="#" className={`accordian-item ${className ?? ""}`} onClick={(e) => handleClick(e)}>
        <span>{title}</span>
        <span className={`arrow border-indigo-600 ml-6 ${open ? "up" : "down"}`} />
      </a>
      <div className={`${open ? "block" : "hidden"}`}>{children}</div>
    </div>
  );
};
