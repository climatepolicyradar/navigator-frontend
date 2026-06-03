import { Files, Languages, SquareArrowOutUpRight, TextSearch } from "lucide-react";
import Link from "next/link";

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
              <SquareArrowOutUpRight width={12} height={12} />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/search?c=policies" className={heroLinkClasses}>
            <b>{roundToHundred(familyTotals.policies)}+</b> policies{" "}
            <span className="self-center">
              <SquareArrowOutUpRight width={12} height={12} />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/search?c=UNFCCC" className={heroLinkClasses}>
            <b>2700+</b> UNFCCC submissions{" "}
            <span className="self-center">
              <SquareArrowOutUpRight width={12} height={12} />
            </span>
          </Link>
        </li>
      </ul>
    ),
    icon: <Files width={24} height={24} />,
    cy: "feature-documents",
  },
  {
    content: <p>See exact matches and related phrases highlighted in the text</p>,
    icon: <TextSearch width={24} height={24} />,
    cy: "feature-highlights",
  },
  {
    content: <p>Access English translations of document passages</p>,
    icon: <Languages width={24} height={24} />,
    cy: "feature-translations",
  },
];
