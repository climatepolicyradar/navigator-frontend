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
            <LinkWithQuery href={`/`} className="flex items-center flex-nowrap gap-1" cypress="cclw-logo">
              <Image src="/images/cclw/cclw-logo-globe.png" alt="Climate Change Laws of the World logo globe" width={50} height={50} />
              <Image src="/images/cclw/cclw-logo-text-light.svg" alt="Climate Change Laws of the World logo text" width={275} height={42} />
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
