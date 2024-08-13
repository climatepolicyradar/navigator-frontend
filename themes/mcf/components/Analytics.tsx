type TProps = {
  enableAnalytics: boolean;
};

const TEST_CUSTOM_APP_ID = "TEST-ID";

const Analytics = ({ enableAnalytics }: TProps) => {
  if (enableAnalytics) return null;
};

export default Analytics;
