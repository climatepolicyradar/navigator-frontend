const DEFAULT_APP_NAME = "Climate Policy Radar";

export default function getAppName(appName?: string): string {
  if (appName) return appName;
  return DEFAULT_APP_NAME;
}
