import { NextApiRequest, NextApiResponse } from "next";

import themeConfig from "@/themes/config";
import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const theme = process.env.THEME as TTheme;
  const featureFlags = getFeatureFlags(req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  res.status(200).json({
    theme,
    themeConfig,
    featureFlags,
    features,
  });
}
