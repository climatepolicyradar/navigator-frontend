import Link from "next/link";

import { Icon } from "@/components/atoms/icon/Icon";

type TFamilyTotals = {
  laws: number;
  policies: number;
  unfccc: number;
  reports: number;
};

const heroLinkClasses = "text-white flex items-start gap-1 hover:text-white hover:underline";

const roundToHundred = (num: number) => Math.floor(num / 100) * 100;

export const INSTRUCTIONS = (familyTotals: TFamilyTotals) => [
  {
    content: (
      <ul>
        <li>
          <Link href="/search?c=laws" className={heroLinkClasses}>
            <b>{roundToHundred(familyTotals.laws)}+</b> laws{" "}
            <span className="self-center">
              <Icon name="externalLink" height="12" width="12" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/search?c=policies" className={heroLinkClasses}>
            <b>{roundToHundred(familyTotals.policies)}+</b> policies{" "}
            <span className="self-center">
              <Icon name="externalLink" height="12" width="12" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/search?c=UNFCCC" className={heroLinkClasses}>
            <b>2700+</b> UNFCCC submissions{" "}
            <span className="self-center">
              <Icon name="externalLink" height="12" width="12" />
            </span>
          </Link>
        </li>
      </ul>
    ),
    icon: <Icon name="manyDocuments" height="24" width="24" />,
    cy: "feature-documents",
  },
  {
    content: <p>See exact matches and related phrases highlighted in the text</p>,
    icon: <Icon name="contextSearch" height="24" width="24" />,
    cy: "feature-highlights",
  },
  {
    content: <p>Access English translations of document passages</p>,
    icon: <Icon name="translation" height="24" width="24" />,
    cy: "feature-translations",
  },
];
