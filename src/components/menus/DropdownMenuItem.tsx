import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { useRouter } from "next/router";

interface DropdownMenuItemProps {
  first?: boolean;
  title: string;
  href: string;
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
    !first ? "border-t border-gray-200 pt-3" : "pt-2"
  } px-6 py-2 block w-full text-left text-sm transition duration-300 text-cclw-dark hover:no-underline `;

  cssClass = cssClass + linkClass(href);

  if (external)
    return (
      <ExternalLink url={href} className={cssClass} cy={cy}>
        {title}
      </ExternalLink>
    );

  return (
    <LinkWithQuery href={href} target={target} className={cssClass} cypress={cy}>
      {title}
    </LinkWithQuery>
  );
};
export default DropdownMenuItem;
