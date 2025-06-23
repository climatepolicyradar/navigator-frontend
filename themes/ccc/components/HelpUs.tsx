import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { getButtonClasses } from "@/components/atoms/button/Button";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const EMAIL_SUBJECT = "Joining the NLP community";
const EMAIL_BODY = "Hi, I am interested in joining the climate NLP community. It is relevant to me because...";

const linkClasses = getButtonClasses({ color: "brand", rounded: true, className: "!bg-blue-500 hover:!bg-blue-700 !text-base" });

export const HelpUs = () => (
  <div className="bg-cclw-dark">
    <SiteWidth extraClasses="text-white py-12 pb-24">
      <Heading level={2} extraClasses="text-3xl xl:text-4xl xl:leading-[52px] !text-white text-center">
        Help us improve this tool
      </Heading>
      <p className="text-center text-xl">Here's a variety of ways you can contribute or collaborate with us.</p>
      <div className="flex flex-col md:flex-row flex-wrap justify-center mt-8 gap-4 lg:gap-6">
        <ExternalLink url="https://form.jotform.com/233294135296359" className={linkClasses}>
          Report missing or inaccurate data
        </ExternalLink>
        <LinkWithQuery href="/contact" className={linkClasses}>
          Provide feedback
        </LinkWithQuery>
        <ExternalLink url={`mailto:info@climatepolicyradar.org?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`} className={linkClasses}>
          Join our climate NLP community
        </ExternalLink>
        <LinkWithQuery href="/contact" className={linkClasses}>
          Explore a partnership
        </LinkWithQuery>
      </div>
    </SiteWidth>
  </div>
);
