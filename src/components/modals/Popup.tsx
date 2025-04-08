import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";

const Popup = ({ active, onCloseClick, children }) => {
  return (
    <div
      className={`absolute bg-black/50 pointer-events-none top-0 left-0 p-2 transition duration-250 z-100 transform w-full h-full flex justify-center items-start items-center md:p-4 ${
        active ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`relative w-full rounded-lg bg-white p-4 pt-10 md:p-8 md:w-2/3 lg:1/2 ${active ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="absolute top-4 right-4">
          <Button content="icon" color="mono" variant="ghost" className="text-text-secondary" onClick={onCloseClick}>
            <Icon name="close" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Popup;
