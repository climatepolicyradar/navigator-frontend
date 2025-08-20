import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { Divider } from "@/components/dividers/Divider";

export const Footer = () => (
  <footer className="bg-white text-black py-10 mt-16">
    <div className="max-w-7xl mx-auto px-3 cols-2:px-6 cols-3:px-8 my-8">
      <Divider />
    </div>

    <Columns containerClasses="max-w-7xl mx-auto" gridClasses="cols-4:grid-cols-4 gap-y-12">
      <div className="flex flex-col items-start">
        {/* trunk-ignore(eslint/@next/next/no-img-element) */}
        <img src="/images/ccc/sabin-logo-large.png" alt="Sabin Center for Climate Change logo" className="h-8 w-auto mb-2" />
      </div>

      <div className="inline-flex flex-col justify-center items-start gap-2">
        <ul className="space-y-1">
          <li>
            <LinkWithQuery href="/home" className="text-black text-sm font-semibold hover:underline">
              Home
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/search" className="text-black text-sm font-semibold hover:underline">
              Search
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/about" className="text-black text-sm font-semibold hover:underline">
              About
            </LinkWithQuery>
          </li>
          <li>
            <LinkWithQuery href="/faq" className="text-black text-sm font-semibold hover:underline">
              FAQs
            </LinkWithQuery>
          </li>
        </ul>
      </div>

      <div className="inline-flex flex-col justify-center items-start gap-2">
        <ul className="space-y-1">
          <li>
            <ExternalLink url="https://www.instagram.com/sabincenter/" className="text-black text-sm hover:underline">
              Instagram
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://www.facebook.com/ColumbiaClimateLaw/" className="text-black text-sm hover:underline">
              Facebook
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://www.linkedin.com/company/sabin-center-for-climate-change-law/" className="text-black text-sm hover:underline">
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://bsky.app/profile/sabincenter.bsky.social" className="text-black text-sm hover:underline">
              Bluesky
            </ExternalLink>
          </li>
        </ul>
      </div>

      <div className="inline-flex flex-col justify-start items-start gap-2">
        <ul className="space-y-1">
          <li>
            <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter" className="text-black text-sm hover:underline">
              Get our newsletter →
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://form.jotform.com/252302964707357" className="text-black text-sm hover:underline">
              Contact us
            </ExternalLink>
          </li>
          <li>
            <ExternalLink url="https://form.jotform.com/252292443502350" className="text-black text-sm hover:underline">
              Give us feedback
            </ExternalLink>
          </li>
        </ul>
      </div>
    </Columns>

    <div className="max-w-7xl mx-auto px-3 cols-2:px-6 cols-3:px-8 text-sm text-black/80 flex flex-wrap gap-x-2 items-center">
      <span>
        The materials on this website are intended to provide a general summary of the law and do not constitute legal advice. You should consult with
        counsel to determine applicable legal requirements in a specific fact situation.
      </span>
      <span>© 2025 Sabin Center for Climate Change Law</span>
    </div>
  </footer>
);
