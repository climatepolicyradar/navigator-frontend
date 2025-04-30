import { NextApiRequest, NextApiResponse } from "next";

import { readConfigFile } from "@/utils/readConfigFile";
import { getFeatureFlags } from "@/utils/featureFlags";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const featureFlags = await getFeatureFlags(req.cookies);
    const data = await readConfigFile(process.env.THEME, featureFlags);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error reading data", message: error });
  }
}
