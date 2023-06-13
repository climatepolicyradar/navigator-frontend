import Button from "@components/buttons/Button";
import MainMenu from "../menus/MainMenu";

const LandingPageHeader = () => {
  return (
    <header data-cy="header" className={`absolute bg-transparent w-full top-0 left-0 transition duration-300 z-30`}>
      <div className="container my-4">
        <div className="flex items-center justify-end">
          <div>
            <Button onClick={() => window.open("https://gst1.org")} extraClasses="mr-6 rounded-full" thin>
              Global Stocktake Explorer
            </Button>
          </div>
          <div>
            <MainMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
export default LandingPageHeader;
