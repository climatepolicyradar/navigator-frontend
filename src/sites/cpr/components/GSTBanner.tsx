import { ExternalLink } from "@components/ExternalLink";
import { SpeakerIcon } from "@components/svg/Icons";

export const GSTBanner = () => {
  return (
    <div className="bg-blue-100 w-full flex justify-center py-2">
      <div className="flex items-center">
        <span className="text-primary-400 mr-2">
          <SpeakerIcon />
        </span>
        <span>
          We’ve launched the Global Stocktake Explorer, a tool that enables you to explore and analyse the full text of all Global Stocktake inputs.{" "}
          <ExternalLink className="underline" url="https://gst1.org">
            Search inputs now
          </ExternalLink>
        </span>
      </div>
    </div>
  );
};
