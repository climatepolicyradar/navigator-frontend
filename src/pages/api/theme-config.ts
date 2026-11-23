import { NextApiRequest, NextApiResponse } from "next";

import themeConfig from "@/themes/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(themeConfig);
}
