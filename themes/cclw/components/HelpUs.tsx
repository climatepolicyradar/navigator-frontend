import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { getButtonClasses } from "@components/buttons/Button";

const EMAIL_SUBJECT = "Joining the NLP community";
const EMAIL_BODY = "Hi, I am interested in joining the climate NLP community. Please provide me with more information.";

const linkClasses = getButtonClasses("secondary");

export const HelpUs = () => (
  <div className="bg-cclw-dark">
    <div className="container text-white py-12 pb-24">
      <h2 className="text-3xl md:text-h1 md:leading-[72px] text-white text-center">Help us improve this tool</h2>
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
    </div>
  </div>
);
