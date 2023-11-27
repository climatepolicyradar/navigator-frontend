import { useRouter } from "next/router";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { FloatingSearch } from "@components/FloatingSearch";
import { Menu } from "@cclw/components/Menu";
import Image from "next/image";

const NON_SEARCH_PAGES = ["/", "/search"];

const Header = ({ background = true }) => {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className={`${background ? "bg-cclw-dark" : ""} w-full`}>
      <div className="container">
        <div className="flex flex-nowrap my-2">
          <div className="items-center flex flex-nowrap flex-1">
            <LinkWithQuery href={`/`} className="flex" cypress="cclw-logo">
              <Image src="/images/cclw/cclw-logo-light.png" alt="Climate Change Laws of the World logo" width={233} height={40} />
            </LinkWithQuery>
            {showSearch && (
              <div className="hidden ml-6 md:block md:w-[340px]">
                <FloatingSearch />
              </div>
            )}
          </div>
          <div className="flex text-sm items-center">
            <Menu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
