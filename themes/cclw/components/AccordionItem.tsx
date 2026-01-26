import { useRouter } from "next/router";
import { useState, useEffect, JSX } from "react";

interface IProps {
  id?: string;
  title: string;
  children: JSX.Element;
  startOpen?: boolean;
  className?: string;
  headContent?: JSX.Element;
}

export const AccordionItem = ({ id, title, children, startOpen = false, className, headContent }: IProps) => {
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
    <div className="mb-5" id={id}>
      <a href="#" className={`accordion-item ${className ?? ""}`} onClick={(e) => handleClick(e)}>
        <span>{title}</span>
        {headContent && <span className="ml-2 mb-1">{headContent}</span>}
        <span className={`arrow border-cpr-dark ml-6 ${open ? "up" : "down"}`} />
      </a>
      <div className={`${open ? "block" : "hidden"}`}>{children}</div>
    </div>
  );
};
