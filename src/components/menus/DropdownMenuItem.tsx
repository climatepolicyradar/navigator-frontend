import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { useRouter } from "next/router";

interface DropdownMenuItemProps {
  first?: boolean;
  title: string;
  href?: string;
  target?: string;
  external?: boolean;
  cy?: string;
  setShowMenu?(value: boolean): void;
}
const DropdownMenuItem = ({ first = false, title, href, target = "", external = false, cy, setShowMenu }: DropdownMenuItemProps) => {
  const { pathname } = useRouter();

  const linkClass = (pageUrl: string) => {
    return pathname.toLowerCase() === pageUrl ? "text-blue-500" : "";
  };

  let cssClass = `${
    !first ? "border-t border-indigo-200 pt-3" : "pt-2"
  } px-6 pt-2 block w-full text-left text-sm pb-3 hover:text-blue-500 transition duration-300 `;

  cssClass = cssClass + linkClass(href);

  if (external)
    return (
      <ExternalLink url={href} className={cssClass} cy={cy}>
        {title}
      </ExternalLink>
    );

  return (
    <>
      {href ? (
        <LinkWithQuery href={href} target={target} className={cssClass} cypress={cy}>
          {title}
        </LinkWithQuery>
      ) : (
        <button className={cssClass} onClick={() => setShowMenu(false)} data-cy={cy}>
          {title}
        </button>
      )}
    </>
  );
};
export default DropdownMenuItem;
