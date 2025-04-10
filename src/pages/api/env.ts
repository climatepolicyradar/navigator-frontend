import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    env: {
      theme: process.env.THEME,
      api_url: process.env.BACKEND_API_URL,
      app_token: process.env.BACKEND_API_TOKEN,
    },
  });
}
