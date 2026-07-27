import { NextApiRequest, NextApiResponse } from "next";

import { getFamilyData } from "@/bff/methods/getFamilyData";
import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

// Created as a means to call our new transformation layer from within a client-side component
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const { data, errors } = await getFamilyData("", features, id);
  errors.forEach((err) => console.error(err));

  if (!data) return res.status(404).json({ error: "Not found" });

  res.status(200).json(data);
}
