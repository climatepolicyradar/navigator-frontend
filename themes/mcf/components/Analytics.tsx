import Script from "next/script";

type TProps = {
  enableAnalytics: boolean;
};

const MCF_GA_ID = "G-4SHFJ172GL";

const Analytics = ({ enableAnalytics }: TProps) => {
  return (
    <>
      {enableAnalytics && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${MCF_GA_ID}`} />
          <Script id="mcf-google-analytics" strategy="afterInteractive">
            {`
              (function(w,l,i) {
                w[l] = w[l] || [];
                function gtag(){w[l].push(arguments);}
                gtag('js', new Date());
                gtag('config', i);
              })(window, "dataLayer", "${MCF_GA_ID}");
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default Analytics;
