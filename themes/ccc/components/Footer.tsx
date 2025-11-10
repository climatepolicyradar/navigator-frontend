import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { Divider } from "@/components/dividers/Divider";

export const Footer = () => {
  const link = "text-sm color-text-primary hover:underline";
  const strong = "font-semibold";

  return (
    <footer className="pb-4 py-2">
      <div className="w-full mx-auto px-3 mb-4">
        <Divider />
      </div>

      <FiveColumns verticalGap>
        <Link href="/" className="max-w-70 col-start-1 -col-end-1 cols5-4:col-start-2 cols5-5:col-start-1 cols5-5:col-end-4">
          <Image
            src="/images/ccc/sabin-logo-large.png"
            alt="Sabin Center for Climate Change logo"
            width={280}
            height={26}
            className="max-w-full mb-2"
          />
        </Link>
        <ul className="flex flex-col gap-1 col-span-2 cols5-2:col-span-1 cols5-3:col-span-2 cols5-4:col-start-2 cols5-5:col-start-[initial]">
          <li>
            <Link href="/" className={`${link} ${strong}`}>
              Home
            </Link>
          </li>
          <li>
            <LinkWithQuery href="/search" className={`${link} ${strong}`}>
              Search
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/about" className={`${link} ${strong}`}>
              About
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/faq" className={`${link} ${strong}`}>
              FAQs
            </LinkWithQuery>
          </li>
        </ul>
        <ul className="flex flex-col gap-1 cols5-3:col-span-2">
          <li>
            <ExternalLink url="https://www.instagram.com/sabincenter/" className={link}>
              Instagram
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://www.facebook.com/ColumbiaClimateLaw/" className={link}>
              Facebook
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://www.linkedin.com/company/sabin-center-for-climate-change-law/" className={link}>
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://bsky.app/profile/sabincenter.bsky.social" className={link}>
              Bluesky
            </ExternalLink>
          </li>
        </ul>
        <ul className="flex flex-col gap-1 cols5-2:col-span-2">
          <li>
            <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter" className={link}>
              Get our newsletter →
            </ExternalLink>
          </li>
          <li>
            <LinkWithQuery href="/contact" className={`${link}`}>
              Contact us
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/cookie-policy" className={`${link}`}>
              Cookie policy
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/terms-of-use" className={`${link}`}>
              Terms of use
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/privacy-policy" className={`${link}`}>
              Privacy policy
            </LinkWithQuery>
          </li>
        </ul>
        <div className="color-text-secondary text-sm flex flex-col gap-2 col-span-full cols5-4:col-start-2 cols5-4:-col-end-2 cols5-5:col-start-4">
          <p>
            Help us improve this tool by{" "}
            <ExternalLink url="https://form.jotform.com/252292443502350" className={link + " underline hover:text-text-brand"}>
              providing feedback
            </ExternalLink>{" "}
            on your experience.
          </p>
          <p>
            The materials on this website are intended to provide a general summary of the law and do not constitute legal advice. You should consult
            with counsel to determine applicable legal requirements in a specific fact situation.
          </p>
          <p className="color-text-tertiary text-xs">© 2025 Sabin Center for Climate Change Law</p>
        </div>
      </FiveColumns>
    </footer>
  );
};
