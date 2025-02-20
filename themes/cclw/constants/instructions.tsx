import Link from "next/link";

import { ContextSearchIcon, ManyDocumentsIcon, ExternalLinkIcon, TranslationIcon } from "@components/svg/Icons";

type TFamilyTotals = {
  laws: number;
  policies: number;
  unfccc: number;
};

const heroLinkClasses = "text-white flex items-start gap-1 hover:text-white hover:underline";

export const INSTRUCTIONS = (familyTotals: TFamilyTotals) => [
  {
    content: (
      <ul>
        <li>
          <Link href="/search?c=laws" className={heroLinkClasses}>
            <b>{familyTotals.laws}</b> laws{" "}
            <span className="self-center">
              <ExternalLinkIcon height="12" width="12" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/search?c=policies" className={heroLinkClasses}>
            <b>{familyTotals.policies}</b> policies{" "}
            <span className="self-center">
              <ExternalLinkIcon height="12" width="12" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/search?c=UNFCCC" className={heroLinkClasses}>
            <b>{familyTotals.unfccc}</b> UNFCCC submissions{" "}
            <span className="self-center">
              <ExternalLinkIcon height="12" width="12" />
            </span>
          </Link>
        </li>
      </ul>
    ),
    icon: <ManyDocumentsIcon height="24" width="24" />,
    cy: "feature-documents",
  },
  {
    content: <p>See exact matches and related phrases highlighted in the text</p>,
    icon: <ContextSearchIcon height="24" width="24" />,
    cy: "feature-highlights",
  },
  {
    content: <p>Access English translations of document passages</p>,
    icon: <TranslationIcon height="24" width="24" />,
    cy: "feature-translations",
  },
];
