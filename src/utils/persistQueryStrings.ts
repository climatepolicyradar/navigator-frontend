import { useRouter } from "next/router";
import { NextApiHandler, NextApiResponse } from "next";

export default function persistQueryParamsMiddleware<T>(handler: NextApiHandler<T>) {
  return async (req: any, res: NextApiResponse) => {
    const router = useRouter();
    const { query } = router;
    const hasQueryParams = Object.keys(query).length > 0;

    // attach query string params to outgoing navigation links
    router.events.on("routeChangeStart", (url) => {
      if (hasQueryParams) {
        const separator = url.includes("?") ? "&" : "?";
        // url += separator + new URLSearchParams(query).toString();
        router.push({ pathname: url, query: { ...query } }, undefined, { shallow: true });
      }
    });

    return handler(req, res);
  };
}

// import { useRouter } from "next/router";
// import { AppProps } from "next/app";
// import { AppComponent } from "next/dist/shared/lib/router/router";

// export default function persistQueryParamsMiddleware(AppComponent: React.ComponentType<AppProps>) {
//   return ({ Component, pageProps }: AppProps) => {
//     const router = useRouter();
//     const { query } = router;
//     const hasQueryParams = Object.keys(query).length > 0;

//     // attach query string params to outgoing navigation links
//     router.events.on("routeChangeStart", (url) => {
//       if (hasQueryParams) {
//         const separator = url.includes("?") ? "&" : "?";
//         // url += separator + new URLSearchParams(query).toString();
//         router.push({ pathname: url, query: { ...query } }, undefined, { shallow: true });
//         // router.push(url, undefined, { shallow: true });
//       }
//     });

//     return <AppComponent Component={Component} pageProps={pageProps} />;
//   };
// }
