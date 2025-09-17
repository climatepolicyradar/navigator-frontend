import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { Divider } from "@/components/dividers/Divider";

export const Footer = () => {
  const link = "text-sm color-text-primary hover:underline";
  const strong = "font-semibold";

  return (
    <footer className="pb-4 py-2">
      <div className="w-full mx-auto px-3 mb-4">
        <Divider />
      </div>

      <Columns>
        <aside className="flex flex-col items-start cols-2:col-span-2 cols-3:col-span-1">
          <LinkWithQuery href="/" className="max-w-70">
            {/* trunk-ignore(eslint/@next/next/no-img-element) */}
            <img src="/images/ccc/sabin-logo-large.png" alt="Sabin Center for Climate Change logo" className="w-full mb-2" />
          </LinkWithQuery>
        </aside>

        <main className="cols-2:col-span-2 cols-4:col-span-3 grid grid-cols-subgrid gap-6">
          <div className="flex flex-col items-start gap-2">
            <ul className="space-y-1">
              <li>
                <LinkWithQuery href="/" className={`${link} ${strong}`}>
                  Home
                </LinkWithQuery>
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
          </div>

          <div className="flex flex-col items-start gap-2">
            <ul className="space-y-1">
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
          </div>
          <div className="flex flex-col items-start gap-2">
            <ul className="space-y-1">
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
            </ul>
          </div>

          <div className="col-span-full color-text-secondary text-sm flex flex-col">
            <span>
              The materials on this website are intended to provide a general summary of the law and do not constitute legal advice. You should
              consult with counsel to determine applicable legal requirements in a specific fact situation.
            </span>
            <span className="mt-2 color-text-tertiary text-xs">© 2025 Sabin Center for Climate Change Law</span>
          </div>
        </main>
      </Columns>
    </footer>
  );
};
