import Script from "next/script";

interface IProps {
  enableAnalytics: boolean;
}

const CCC_GA_ID = "G-7P6S8PSL7T";

const Analytics = ({ enableAnalytics }: IProps) => {
  return (
    <>
      {enableAnalytics && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${CCC_GA_ID}`} />
          <Script id="ccc-google-analytics" strategy="afterInteractive">
            {`
              (function(w,l,i) {
                w[l] = w[l] || [];
                function gtag(){w[l].push(arguments);}
                gtag('js', new Date());
                gtag('config', i);
              })(window, "dataLayer", "${CCC_GA_ID}");
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default Analytics;
