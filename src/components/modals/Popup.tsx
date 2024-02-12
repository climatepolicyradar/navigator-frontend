import Close from "../buttons/Close";

const Popup = ({ active, onCloseClick, children }) => {
  return (
    <div
      className={`absolute bg-black/50 pointer-events-none top-0 left-0 p-2 transition duration-250 z-50 transform w-full h-full flex justify-center items-start items-center md:p-4 ${
        active ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`relative w-full rounded-lg bg-white p-4 pt-10 md:p-8 md:w-2/3 lg:1/2 ${active ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <Close onClick={onCloseClick} size="20" />
        </div>
        {children}
      </div>
    </div>
  );
};
export default Popup;
