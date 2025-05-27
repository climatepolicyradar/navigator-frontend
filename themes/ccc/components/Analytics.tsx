import Script from "next/script";

interface IProps {
  enableAnalytics: boolean;
}

const CCLW_GA_ID = "UA-153841121-2";

const Analytics = ({ enableAnalytics }: IProps) => {
  return (
    <>
      {enableAnalytics && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${CCLW_GA_ID}`} />
          <Script id="cclw-google-analytics" strategy="afterInteractive">
            {`
              (function(w,l,i) {
                w[l] = w[l] || [];
                function gtag(){w[l].push(arguments);}
                gtag('js', new Date());
                gtag('config', i);
              })(window, "dataLayer", "${CCLW_GA_ID}");
            `}
          </Script>
        </>
      )}
      <Script id="cclw-plausible" defer data-domain="climate-laws.org" strategy="afterInteractive" src="https://plausible.io/js/script.js" />
    </>
  );
};

export default Analytics;
