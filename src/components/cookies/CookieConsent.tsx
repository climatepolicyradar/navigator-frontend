import { useEffect, useState } from "react";
import Script from "next/script";

import Button from "@components/buttons/Button";
import { ExternalLink } from "@components/ExternalLink";

import { getCookie, setCookie } from "@utils/cookies";
import getDomain from "@utils/getDomain";

import { COOKIE_CONSENT_NAME } from "@constants/cookies";
import dynamic from "next/dynamic";

const ThemeAnalytics = dynamic<{ enableAnalytics: boolean }>(() => import(`/themes/${process.env.THEME}/components/Analytics`));

declare let gtag: Function;
type Props = {
  onConsentChange: (consent: boolean) => void;
};
export const CookieConsent = ({ onConsentChange }: Props) => {
  const [hide, setHide] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState<boolean>();

  useEffect(() => {
    const cc = getCookie(COOKIE_CONSENT_NAME);
    if (!cc) setHide(false);
    if (cc === "true") setEnableAnalytics(true);
  }, []);

  useEffect(() => {
    // If the user has accepted cookies, update the consent options for Google Tag Manager
    if (enableAnalytics) {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    onConsentChange(enableAnalytics);
  }, [enableAnalytics, onConsentChange]);

  const cookiesAcceptHandler = () => {
    setCookie(COOKIE_CONSENT_NAME, "true", getDomain());
    setHide(true);
    setEnableAnalytics(true);
  };

  const cookiesRejectHandler = () => {
    setCookie(COOKIE_CONSENT_NAME, "false", getDomain());
    setHide(true);
  };

  return (
    <>
      <div
        data-cy="cookie-consent"
        className={`${hide ? "hidden" : ""} fixed w-[90%] max-w-[600px] bottom-6 left-1/2 translate-x-[-50%] z-[9999] rounded-xl bg-blue-100`}
      >
        <div className="py-4 px-6">
          <div className="text-xl mb-2">Cookies and your privacy</div>
          <p className="text-content text-sm mb-2">
            We take your trust and privacy seriously. Climate Policy Radar uses cookies to make our site work optimally, analyse traffic to our
            website and improve your experience. Read our{" "}
            <ExternalLink url="https://climatepolicyradar.org/privacy-policy">privacy and cookie policy</ExternalLink> to learn more. By accepting
            cookies you will help us make our site better, but you can reject them if you wish.
          </p>
          <div className="flex justify-end">
            <div className="">
              <Button thin onClick={cookiesAcceptHandler} data-cy="cookie-consent-accept">
                Accept
              </Button>
            </div>
            <div className="ml-4">
              <Button color="ghost" thin onClick={cookiesRejectHandler} data-cy="cookie-consent-reject">
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("consent", "default", {
              ad_storage: "denied",
              analytics_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
            });
          `}
      </Script>
      <Script id="gtm" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});
              var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";
              j.async=true;
              j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,"script","dataLayer","GTM-NTNH983");
          `}
      </Script>
      {enableAnalytics && (
        <>
          <Script id="hotjar" strategy="afterInteractive">
            {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:3192374,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
          </Script>
        </>
      )}
      <ThemeAnalytics enableAnalytics={enableAnalytics} />
    </>
  );
};
