import { NextApiRequest, NextApiResponse } from "next";

import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  res.status(200).json({
    theme,
    themeConfig,
    featureFlags,
    features,
  });
}
