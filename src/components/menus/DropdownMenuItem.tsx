import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";

interface DropdownMenuItemProps {
  first?: boolean;
  title: string;
  href?: string;
  target?: string;
  external?: boolean;
  setShowMenu?(value: boolean): void;
}
const DropdownMenuItem = ({ first = false, title, href, target = "", external = false, setShowMenu }: DropdownMenuItemProps) => {
  const cssClass = `${
    !first ? "border-t border-indigo-200 pt-3" : "pt-2"
  } px-6 pt-2 block w-full text-left text-sm pb-3 hover:text-blue-500 transition duration-300`;

  if (external)
    return (
      <ExternalLink url={href} className={cssClass}>
        {title}
      </ExternalLink>
    );

  return (
    <>
      {href ? (
        <LinkWithQuery href={href} target={target} className={cssClass}>
          {title}
        </LinkWithQuery>
      ) : (
        <button className={cssClass} onClick={() => setShowMenu(false)}>
          {title}
        </button>
      )}
    </>
  );
};
export default DropdownMenuItem;
