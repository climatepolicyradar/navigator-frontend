import { ParsedUrlQuery } from "querystring";

import { useContext } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Section } from "@/components/molecules/section/Section";
import { ThemeContext } from "@/context/ThemeContext";
import { GeographyV2 } from "@/types";

export const INTRO_BLOCK_TITLE = "Search our data";

type TCallToAction =
  | {
      title: string;
      searchQuery: ParsedUrlQuery;
      url?: never;
    }
  | {
      title: string;
      searchQuery?: never;
      url: string;
    };

interface IProps {
  geography: GeographyV2;
}

export const IntroBlock = ({ geography }: IProps) => {
  const { theme } = useContext(ThemeContext);

  switch (theme) {
    case "cclw":
      const callToActions: TCallToAction[] = [
        {
          title: `Find targets in laws from ${geography.name}`,
          searchQuery: { c: "laws", cfn: "target" },
        },
        {
          title: `Find mentions of greenhouse gases in the text of NDCs from ${geography.name}`,
          searchQuery: { c: "UNFCCC", t: "Nationally Determined Contribution", cfn: "greenhouse gas" },
        },
        {
          title: `Find mentions of taxation in the text of policies from ${geography.name}`,
          searchQuery: { c: "policies", cfn: "tax" },
        },
        {
          title: "Download our data as a CSV",
          url: "https://form.jotform.com/233131638610347",
        },
      ];

      return (
        <Section block="intro" title={INTRO_BLOCK_TITLE}>
          <div className="col-start-1 -col-end-1 flex flex-col gap-4">
            <p>
              Discover climate laws, policies and UNFCCC submissions from over 196 countries, territories, and the European Union. Search the full
              text of documents - including translations - and see related phrases highlighted in the text.
            </p>
            <ul>
              {callToActions.map(({ title, searchQuery, url }) => {
                const pageLinkProps = url ? { href: url, external: true } : { href: "/search", query: { l: geography.slug, ...searchQuery } };

                return (
                  <li key={title}>
                    <PageLink {...pageLinkProps} underline>
                      {title}
                    </PageLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>
      );
    default:
      return null;
  }
};
