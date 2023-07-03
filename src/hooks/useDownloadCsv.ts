import { ApiClient, getEnvFromServer } from "../api/http-common";
import buildSearchQuery, { TRouterQuery } from "@utils/buildSearchQuery";
import { TLoadingStatus, TSearch } from "@types";
import { useState } from "react";

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

const downloadFile = ({ data, fileName, fileType }) => {
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

  const { data } = await getEnvFromServer();
  const client = new ApiClient(data?.env?.api_url);

  const searchQuery = buildSearchQuery(query);

  const results = await client.post<TSearch>("/searches/download-csv", searchQuery, config);
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
  const [status, setStatus] = useState<TLoadingStatus>("idle");

  const download = async (query: TRouterQuery) => {
    setStatus("loading");
    const downloadResponse = await getDownloadCsv(query);

    if (!downloadResponse) return setStatus("error");

    return setStatus("success");
  };

  const resetStatus = () => setStatus("idle");

  return { status, download, resetStatus };
}
