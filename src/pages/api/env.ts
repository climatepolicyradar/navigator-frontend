import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    env: {
      theme: process.env.THEME,
      api_url: process.env.API_URL,
      app_token: process.env.NEXT_PUBLIC_APP_TOKEN,
    },
  });
}
