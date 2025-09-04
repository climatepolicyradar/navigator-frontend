import { NextApiRequest, NextApiResponse } from "next";

import { ApiClient } from "@/api/http-common";
import { TSearch, TSearchCriteria } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";

import themes from "../../../themes";

const backendApiClient = new ApiClient(process.env.BACKEND_API_URL, process.env.BACKEND_API_TOKEN);

async function vespaSearch(searchQuery: TSearchCriteria) {
  const search: Promise<TSearch> = await backendApiClient
    .post("/searches", searchQuery, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data);
  return search;
}

const themeConfig = themes[process.env.THEME];

export type GeographyCountsResponse = {
  counts: {
    [category: string]: number;
  };
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { l, c } = req.query;

  if (!l || !c) {
    return res.status(400).json({ error: "Missing required query parameters 'l' (location) and 'c' (category)" });
  }

  const cArray = Array.isArray(c) ? c : [c];
  const vespaSearches = cArray.map((category) => {
    const categoryWithAllAsUndefined = category === "all" ? undefined : category;
    const searchQuery = buildSearchQuery({ l: l, c: categoryWithAllAsUndefined, page_size: "0" }, themeConfig);
    return vespaSearch(searchQuery);
  });

  const searchResults = await Promise.all(vespaSearches);

  const counts = cArray.reduce((acc, category, index) => {
    acc[category] = searchResults[index].total_family_hits;
    return acc;
  }, {});

  res.status(200).json({
    counts,
  });
}
