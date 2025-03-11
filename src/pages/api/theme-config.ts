import { NextApiRequest, NextApiResponse } from "next";

import { readConfigFile } from "@/utils/readConfigFile";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await readConfigFile(process.env.THEME);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error reading data", message: error });
  }
}
