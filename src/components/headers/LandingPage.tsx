import { SiteWidth } from "@components/panels/SiteWidth";

import MainMenu from "../menus/MainMenu";

const LandingPageHeader = () => {
  return (
    <header data-cy="header" className="absolute bg-transparent w-full top-0 left-0 transition duration-300 z-30">
      <SiteWidth extraClasses="my-4">
        <div className="flex items-center justify-end">
          <div>
            <MainMenu />
          </div>
        </div>
      </SiteWidth>
    </header>
  );
};
export default LandingPageHeader;
