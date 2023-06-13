import MainMenu from "../menus/MainMenu";
import AlphaLogoSmall from "../logo/AlphaLogoSmall";
import Button from "@components/buttons/Button";

const Header = () => {
  return (
    <header data-cy="header" className="absolute bg-transparent w-full top-0 left-0 transition duration-300">
      <div className="container my-4">
        <div className="flex items-center justify-between">
          <AlphaLogoSmall />
          <div className="flex items-center justify-end">
            <div className="hidden md:block mr-6">
              <Button onClick={() => window.open("https://gst1.org")} extraClasses="rounded-full" thin>
                Global Stocktake Explorer
              </Button>
            </div>
            <div>
              <MainMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
