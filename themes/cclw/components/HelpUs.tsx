import { ExternalLink } from "@components/ExternalLink";
import { getButtonClasses } from "@components/buttons/Button";

const linkClasses = getButtonClasses("secondary");

export const HelpUs = () => (
  <div className="bg-cclw-dark">
    <div className="container text-white py-12">
      <h2 className="text-3xl md:text-h1 md:leading-[72px] text-white text-center">Help us improve this tool</h2>
      <p className="text-center text-xl">Here's a variety of ways you can contribute or collaborate with us.</p>
      <div className="flex flex-col md:flex-row flex-wrap justify-center mt-8 gap-4 lg:gap-6">
        <ExternalLink url="https://form.jotform.com/233294135296359" className={linkClasses}>
          Report missing or inaccurate data
        </ExternalLink>
        <ExternalLink url="https://form.jotform.com/233294135296359" className={linkClasses}>
          Provide feedback
        </ExternalLink>
        <ExternalLink url="https://form.jotform.com/233294135296359" className={linkClasses}>
          Join our climate NLP community
        </ExternalLink>
        <ExternalLink url="https://form.jotform.com/233294135296359" className={linkClasses}>
          Explore a partnership
        </ExternalLink>
      </div>
    </div>
  </div>
);
