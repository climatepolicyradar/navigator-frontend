import Script from "next/script";
import { useEffect, useState } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { Analytics } from "@/components/Themed";
import { Button } from "@/components/atoms/button/Button";
import { COOKIE_CONSENT_NAME } from "@/constants/cookies";
import { TThemeConfig } from "@/types";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

import { Card } from "../atoms/card/Card";

declare let gtag: Function;

interface IProps {
  onConsentChange: (consent: boolean) => void;
  themeConfig: TThemeConfig;
}

export const CookieConsent = ({ onConsentChange, themeConfig }: IProps) => {
  const [hide, setHide] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(false);

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

  const cookiePolicyUrl = themeConfig?.links?.cookiePolicy || "https://climatepolicyradar.org/privacy-policy";
  const privacyPolicyUrl = themeConfig?.links?.privacyPolicy || "https://climatepolicyradar.org/privacy-policy";

  return (
    <>
      <div className={`flex justify-end ${hide ? "hidden" : ""}`} data-cy="cookie-consent">
        <Card color="mono" variant="outlined" className="m-3 sm:m-4 max-w-[550px] bg-surface-ui pointer-events-auto select-none">
          <p className="text-base leading-normal font-semibold text-text-primary">Cookies and your privacy</p>
          <p className="mt-2 mb-4 text-sm leading-normal font-normal text-text-primary">
            We take your trust and privacy seriously. Climate Policy Radar uses cookies to make our site work optimally, analyse traffic to our
            website and improve your experience. Read our{" "}
            <ExternalLink url={privacyPolicyUrl} className="underline">
              privacy policy
            </ExternalLink>{" "}
            and{" "}
            <ExternalLink url={cookiePolicyUrl} className="underline">
              cookie policy
            </ExternalLink>{" "}
            to learn more. By accepting cookies you will help us make our site better, but you can reject them if you wish.
          </p>
          <div className="flex gap-2">
            <Button color="mono" size="small" onClick={cookiesAcceptHandler} title="Accept cookies" data-ph-capture-attribute-cookie-consent="accept">
              Accept
            </Button>
            <Button
              color="mono"
              size="small"
              variant="ghost"
              className="text-text-secondary hover:text-text-primary"
              onClick={cookiesRejectHandler}
              title="Reject cookies"
              data-ph-capture-attribute-cookie-consent="reject"
            >
              Reject
            </Button>
          </div>
        </Card>
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
      <Analytics enableAnalytics={enableAnalytics} />
    </>
  );
};
