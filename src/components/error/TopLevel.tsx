import Button from "@components/buttons/Button";

const TopLevel = ({ resetError }) => {
  return (
    <div className="max-w-screen-sm m-auto h-full flex flex-col justify-center p-4">
      <h2>Sorry, the app has encountered an error and needs to restart</h2>
      <p className="my-4">Please click the button below to start the app.</p>
      <div>
        <Button extraClasses="bg-black text-white hover:border-black hover:bg-black" thin onClick={resetError}>
          Restart
        </Button>
      </div>
      <p className="my-4">To report a problem email us at support@climatepolicyradar.org</p>
    </div>
  );
};

export default TopLevel;
