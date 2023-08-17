import { useRef, useEffect } from "react";
import Close from "@components/buttons/Close";

interface SlideoutProps {
  children: JSX.Element | string;
  show: boolean;
  setShow(value: boolean): void;
}

const Slideout = ({ children, show, setShow }: SlideoutProps) => {
  const ref = useRef(null);

  // Clicking outside the drawer will close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow && setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref, setShow]);

  return (
    <div
      ref={ref}
      className={`fixed top-0 right-0 w-1/4 h-screen bg-white z-50 transition duration-300 origin-left transform shadow-2xl shadow-black/40 ${
        show ? "translate-x-0" : "translate-x-[110%]"
      }`}
    >
      <div className="flex absolute z-20 top-4 right-4">
        <Close size="14" onClick={() => setShow(false)} />
      </div>

      {children}
    </div>
  );
};

export default Slideout;
