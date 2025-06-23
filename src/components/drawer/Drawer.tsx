import { useRef, useEffect } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";

interface IProps {
  children: JSX.Element | string;
  show: boolean;
  setShow(value: boolean): void;
}

const Slideout = ({ children, show, setShow }: IProps) => {
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
      className={`fixed top-0 bottom-0 right-0 w-11/12 bg-white z-70 transition duration-150 origin-left transform shadow-2xl shadow-black/40 md:w-2/3 xl:w-5/12 overflow-y-scroll scrollbar-narrow ${
        show ? "translate-x-0" : "translate-x-[110%]"
      }`}
    >
      <div className="flex absolute z-20 top-3 right-3">
        <Button content="icon" color="mono" variant="ghost" className="text-text-secondary" onClick={() => setShow(false)}>
          <Icon name="close" />
        </Button>
      </div>

      {children}
    </div>
  );
};

export default Slideout;
