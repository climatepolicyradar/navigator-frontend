import Layout from "@components/layouts/Main";
import { ExternalLink } from "@components/ExternalLink";
import Button from "@components/buttons/Button";

type TProps = {
  resetError: () => void;
};

const PageLevel = ({ resetError }: TProps) => {

  return (
    <Layout title={"Application Error"}>
      <section>
        <div className="text-content px-4 container mb-12">
          <h1 className="my-8">Sorry, the app has encountered an error</h1>
          <p>Restarting the app might fix the problem. Click the button below to restart</p>
          <div>
            <Button thin onClick={resetError}>
              Restart
            </Button>
          </div>
          <p>
            If this doesn't work, report a problem by emailing{" "}
            <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>
          </p>
        </div>
      </section>
    </Layout>
  );
};
export default PageLevel;
