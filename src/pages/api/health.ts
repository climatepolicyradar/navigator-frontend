import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    /** @related: GITHUB_SHA_ENV_VAR */
    version: process.env.GITHUB_SHA || "unknown",
  });
}
