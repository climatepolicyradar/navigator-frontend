import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/atoms/button/Button";
import { Heading } from "@/components/typography/Heading";

interface IProps {
  resetError: () => void;
}

const TopLevel = ({ resetError }: IProps) => {
  return (
    <div className="max-w-screen-sm m-auto h-full flex flex-col justify-center p-4 gap-4">
      <Heading level={1}>Sorry, the app has encountered an error</Heading>
      <p>Restarting the app might fix the problem. Click the button below to restart</p>
      <div>
        <Button rounded onClick={resetError}>
          Restart
        </Button>
      </div>
      <p>
        If this doesn't work,{" "}
        <a className="underline text-blue-600 hover:text-blue-800" href="/">
          return to the homepage
        </a>{" "}
        or report a problem by emailing:{" "}
        <ExternalLink className="underline text-blue-600 hover:text-blue-800" url="mailto:support@climatepolicyradar.org">
          support@climatepolicyradar.org
        </ExternalLink>
      </p>
    </div>
  );
};

export default TopLevel;
