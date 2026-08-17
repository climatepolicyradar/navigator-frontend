import { NextApiRequest, NextApiResponse } from "next";

import { getFamilyData } from "@/bff/methods/getFamilyData";

// Created as a means to call our new transformation layer from within a client-side component
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  const { data, errors } = await getFamilyData("", id);
  errors.forEach((err) => console.error(err));

  if (!data) return res.status(404).json({ error: "Not found" });

  res.status(200).json(data);
}
