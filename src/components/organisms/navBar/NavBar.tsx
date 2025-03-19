import { FloatingSearch } from "@/components/FloatingSearch";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import Image from "next/image";
import MainMenu from "../../menus/MainMenu";
import { useRouter } from "next/router";
import { NavSearch } from "@/components/molecules/navSearch/NavSearch";

export const NavBar = () => {
  const router = useRouter();

  return (
    <header data-cy="header" className="w-full p-4 flex justify-between items-center banner">
      <div className="flex-1">
        <LinkWithQuery href="/">
          <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
        </LinkWithQuery>
      </div>
      <div className="flex-2 max-w-[500px]">
        <NavSearch />
      </div>
      <div className="flex-1 flex justify-end">
        <MainMenu />
      </div>
    </header>
  );
};
