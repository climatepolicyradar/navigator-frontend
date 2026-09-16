import { NextApiRequest, NextApiResponse } from "next";

import { getFamilyData } from "@/bff/methods/getFamilyData";

// Created as a means to call our new transformation layer from within a client-side component
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string;

  const { data, errors } = await getFamilyData(slug);
  errors.forEach((err) => console.error(err));

  if (!data) return res.status(404).json({ error: "Not found" });

  res.status(200).json(data);
}
