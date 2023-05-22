import { ApiClient, getEnvFromServer } from "../api/http-common";
import { TSearch } from "../types";
import buildSearchQuery, { TRouterQuery } from "@utils/buildSearchQuery";

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  console.log(blob);

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

export async function getDownloadCsv(query: TRouterQuery) {
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
  downloadFile({
    data: results.data || "",
    fileName: "search_results.csv",
    fileType: "text/csv",
  });
}
