/*
 * This implementation gives us runtime, isomorphic env variables.
 *
 * We could use NEXT_PUBLIC_* env variables, but those have to be baked in at build time.
 *
 * As per the docs:
 * > public environment variables will be inlined into the JavaScript bundle during next build
 *
 * This does not allow us to "build once, deploy everywhere" - which is what we do in all our other services.
 *
 * @see: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#runtime-environment-variables
 * @see: https://github.com/vercel/next.js/discussions/44628
 */
import { createContext, useContext } from "react";

const publicRuntimeEnvConfig = [
  "BACKEND_API_URL",
  "BACKEND_API_TOKEN",
  "TARGETS_URL",
  "CDN_URL",
  "CONCEPTS_API_URL",
  "ADOBE_API_KEY",
  "REDIRECT_FILE",
  "HOSTNAME",
] as const;

export type TPublicEnvConfig = Record<(typeof publicRuntimeEnvConfig)[number], string>;

/**
 * This method is specifically made to be used with `getServerSideProps`
 * where `pageProps.envConfig` is then read in `_app.tsx` and passed to `EnvConfigContext.Provider`
 */
export function withEnvConfig<PageProps>(pageProps: PageProps): PageProps & { envConfig: TPublicEnvConfig } {
  const config = {} as TPublicEnvConfig;

  for (const key of publicRuntimeEnvConfig) {
    config[key] = process.env[key];
  }

  return {
    ...pageProps,
    envConfig: config,
  };
}

export const EnvConfigContext = createContext<TPublicEnvConfig>(undefined);

export function useEnvConfig(): TPublicEnvConfig {
  const envConfig = useContext(EnvConfigContext);

  if (typeof envConfig === "undefined") {
    throw new Error(`
      "useEnvConfig" must be used with "EnvConfigContext.Provider".
      You might need to use "withEnvConfig" in the "getServerSideProps" method of the page
    `);
  }

  return envConfig;
}
