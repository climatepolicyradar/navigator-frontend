import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/atoms/button/Button";
import Layout from "@/components/layouts/Main";
import { Heading } from "@/components/typography/Heading";

interface IProps {
  resetError: () => void;
}

const PageLevel = ({ resetError }: IProps) => {
  return (
    <Layout title={"Application Error"}>
      <section>
        <div className="text-content px-4 container mb-12">
          <Heading level={1}>Sorry, the app has encountered an error</Heading>
          <p>Restarting the app might fix the problem. Click the button below to restart</p>
          <div>
            <Button rounded onClick={resetError}>
              Restart
            </Button>
          </div>
          <p>
            If this doesn't work, report a problem by emailing{" "}
            <ExternalLink url="mailto:support@climatepolicyradar.org" className="underline text-blue-600 hover:text-blue-800">
              support@climatepolicyradar.org
            </ExternalLink>
          </p>
        </div>
      </section>
    </Layout>
  );
};
export default PageLevel;
