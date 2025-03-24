import { LinkWithQuery } from "@/components/LinkWithQuery";
import { NavSearch } from "@/components/molecules/navSearch/NavSearch";
import Image from "next/image";
import { useRouter } from "next/router";
import MainMenu from "../../menus/MainMenu";

export const NavBar = () => {
  const router = useRouter();

  return (
    <>
      <header
        data-cy="header"
        className="w-full sm:px-4 banner flex justify-between items-center flex-wrap sm:flex-nowrap gap-y-1 sm:gap-y-0 sticky top-0 z-100"
      >
        <div className="lg:flex-1 pl-4 pt-4 sm:pl-0 sm:pt-0">
          <LinkWithQuery href="/">
            <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
          </LinkWithQuery>
        </div>
        <div className="flex-[1_1_100%] sm:flex-initial order-1 sm:order-0 lg:min-w-[500px]">
          <NavSearch />
        </div>
        <div className="lg:flex-1 flex justify-end pt-4 pr-4 sm:pt-0 sm:pr-0">
          <MainMenu />
        </div>
      </header>
    </>
  );
};
