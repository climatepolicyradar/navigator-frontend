import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dataFilePath = path.join(process.cwd(), `/themes/${process.env.THEME}/config.json`);
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error reading data", message: error });
  }
}
