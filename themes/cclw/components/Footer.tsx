/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import { SiteWidth } from "@/components/panels/SiteWidth";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Feedback } from "./Feedback";
import MENU_LINKS from "../constants/menuLinks";

import GRI_LINKS, { TLinkItem } from "@/cclw/constants/griLinks";

const Footer = () => {
  const renderLink = (item: TLinkItem) => {
    if (item.external) {
      return <ExternalLink url={item.href}>{item.text}</ExternalLink>;
    }
    return <LinkWithQuery href={item.href}>{item.text}</LinkWithQuery>;
  };

  return (
    <footer className="flex justify-center bg-[rebeccapurple]">
      <span className="my-12 text-text-light text-2xl font-medium">Climate Case Chart</span>
    </footer>
  );
};
export default Footer;
