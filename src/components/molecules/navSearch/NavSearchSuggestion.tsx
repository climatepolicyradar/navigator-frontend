import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { IconType } from "react-icons";

interface NavSearchSuggestionProps {
  children: React.ReactNode;
  hint?: React.ReactNode;
  href: Url;
  Icon?: React.ReactNode;
}

export const NavSearchSuggestion = ({ children, hint, href, Icon }: NavSearchSuggestionProps) => (
  <Link href={href} className="flex items-center gap-2 px-2.5 py-2 rounded-md hocus:bg-surface-ui transition duration-200 group">
    <div className={`w-4 shrink-0 ${Icon ? "text-icon-standard group-hover:text-text-brand transition duration-200" : ""}`}>{Icon}</div>
    <div className="flex-1 text-sm leading-4 text-text-secondary font-medium">{children}</div>
    {hint}
  </Link>
);
