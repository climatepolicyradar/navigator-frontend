interface Window {
  _paq?: (Dimensions | number[] | string[] | number | string | null | undefined)[][] | null;
  _mtm?: any;
  dataLayer?: any;
  queryClient: any;
  AdobeDC: any;
}
declare namespace NodeJS {
  interface Global {
    _paq?: (Dimensions | number[] | string[] | number | string | null | undefined)[][] | null;
    _mtm?: any;
    dataLayer?: any;
    queryClient: any;
  }
}

declare module "gtag.js";
