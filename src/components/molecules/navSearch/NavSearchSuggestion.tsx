import { ParsedUrlQuery } from "querystring";

import { MouseEventHandler } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";

interface IProps {
  children: React.ReactNode;
  hint?: React.ReactNode;
  href: string;
  Icon?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  query?: ParsedUrlQuery;
}

export const NavSearchSuggestion = ({ children, hint, href, Icon, onClick, query = {} }: IProps) => (
  <PageLink
    href={href}
    query={query}
    onClick={onClick}
    className="flex items-center gap-2 px-2.5 py-2 rounded-md hocus:bg-surface-ui transition duration-200 group"
  >
    <div className={`w-4 shrink-0 ${Icon ? "text-icon-standard group-hover:text-text-brand transition duration-200" : ""}`}>{Icon}</div>
    <div className="flex-1 text-sm leading-4 text-text-secondary font-medium">{children}</div>
    {hint}
  </PageLink>
);
