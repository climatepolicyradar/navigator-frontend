import { ExternalLink } from "@/components/ExternalLink";
import { Icon } from "@/components/atoms/icon/Icon";

export const GSTBanner = () => {
  return (
    <div className="bg-blue-100 w-full flex justify-center p-2 text-sm md:text-lg">
      <div className="flex items-center">
        <span className="text-primary-400 mr-2 self-start">
          <Icon name="speaker" />
        </span>
        <span>
          We’ve launched the Global Stocktake Explorer, a tool that enables you to explore and analyse the full text of all Global Stocktake inputs.{" "}
          <ExternalLink className="underline text-cpr-dark" url="https://gst1.org">
            Search inputs now
          </ExternalLink>
        </span>
      </div>
    </div>
  );
};
