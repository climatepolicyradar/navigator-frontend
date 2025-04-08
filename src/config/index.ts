export const publicRuntimeEnvConfig = ["API_URL", "THEME", "BACKEND_API_URL", "BACKEND_API_TOKEN"] as const;

/**
 * This is a custom config that is makes runtime env variables available to the the client environment.
 *
 * As per the docs:
 * > public environment variables will be inlined into the JavaScript bundle during next build
 *
 * This does not allow us to "build once, deploy everywhere" - which we would like to do.
 *
 * @see: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#runtime-environment-variables
 */
export function generateBrowserEnvConfig() {
  const config = {};
  for (const key of publicRuntimeEnvConfig) {
    config[`${key}`] = process.env[key];
  }

  return config;
}

export const config = {} as Record<(typeof publicRuntimeEnvConfig)[number], string>;
declare global {
  interface Window {
    __ENV__: Record<string, string>;
  }
}

for (const key of publicRuntimeEnvConfig) {
  if (typeof window !== "undefined") {
    config[key] = window.__ENV__[`${key}`];
  } else {
    config[key] = process.env[key];
  }
}
