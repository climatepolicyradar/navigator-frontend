import fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";
import { HackButton, HackQuestion } from "src/HACKATHON/data";

const parseButton = (cells: string[]): HackButton => ({
  text: cells[0],
  goToId: cells[1],
  searchParams: cells[2],
  goToPage: cells[3],
  showImage: cells[4],
});

const parseQuestion = (row: string[]): HackQuestion => {
  return {
    id: row[0],
    text: row[1],
    buttons: [
      parseButton(row.slice(2, 7)),
      parseButton(row.slice(7, 12)),
      parseButton(row.slice(12, 17)),
      parseButton(row.slice(17, 22)),
      parseButton(row.slice(22, 27)),
      parseButton(row.slice(27, 32)),
    ].filter((button) => button.text),
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const csv = fs.readFileSync("./src/HACKATHON/Choose your own adventure - All questions.csv");
  const csvString = csv.toString();

  const tabularData = csvString
    .trim()
    .split("\n")
    .map((line) => line.trim().split(","))
    .slice(1);

  const questions = tabularData.map(parseQuestion);

  return res.status(200).json(questions);
}
