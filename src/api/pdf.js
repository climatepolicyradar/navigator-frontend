/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

// Important documentation at: https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/
class ViewSDKClient {
  constructor() {
    this.readyPromise = new Promise((resolve) => {
      if (window.AdobeDC) {
        resolve();
      } else {
        // Once the Adobe Document Cloud View SDK is ready call the callback
        document.addEventListener("adobe_dc_view_sdk.ready", () => {
          resolve();
        });
      }
    });
    this.adobeDCView = undefined;
  }

  ready() {
    return this.readyPromise;
  }

  // Set up the AdobeDC View configuration
  getAdobeView(doc, adobeKey, divId) {
    if (!doc || !doc.cdn_object) return;
    const config = {
      clientId: adobeKey,
      divId: divId,
    };
    this.adobeDCView = new window.AdobeDC.View(config);

    return this.adobeDCView;
  }
}

export default ViewSDKClient;
