import { useState } from "react";

import { TApiLoadingStatus, TApiSearch } from "@/types";
import buildSearchQuery, { TRouterQuery } from "@/utils/buildSearchQuery";

import { ApiClient, getEnvFromServer, getFilters } from "../api/http-common";

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

type TDownloadFile = {
  data: string;
  fileName: string;
  fileType: string;
};

const downloadFile = ({ data, fileName, fileType }: TDownloadFile) => {
  const blob = new Blob([data], { type: fileType });

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvent);
  a.remove();
};

async function getDownloadCsv(query: TRouterQuery) {
  const config: TConfig = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const { data: envResponse } = await getEnvFromServer();
  const { data: themeConfigResponse } = await getFilters();
  const client = new ApiClient(envResponse?.env?.api_url, envResponse?.env?.app_token);

  const searchQuery = buildSearchQuery(query, themeConfigResponse, "", "", true, 0);
  // Manually set this to 500, overriding the default 10 which is used for pagination
  searchQuery.page_size = 500;
  searchQuery.limit = 500;

  const results = await client.post<TApiSearch>("/searches/download-csv", searchQuery, config);
  if (results.status !== 200) {
    return false;
  }

  downloadFile({
    data: results.data || "",
    fileName: "search_results.csv",
    fileType: "text/csv",
  });

  return true;
}

export function useDownloadCsv() {
  const [status, setStatus] = useState<TApiLoadingStatus>("idle");

  const download = async (query: TRouterQuery) => {
    setStatus("loading");
    const downloadResponse = await getDownloadCsv(query);

    if (!downloadResponse) return setStatus("error");

    return setStatus("success");
  };

  const resetStatus = () => setStatus("idle");

  return { status, download, resetStatus };
}
