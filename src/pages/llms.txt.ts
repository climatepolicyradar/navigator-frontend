import { GetServerSidePropsContext } from "next";

import { LLMS_TXT_BY_THEME } from "@/constants/llms";
import { TTheme } from "@/types";

function LlmsTxt() {}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const content = LLMS_TXT_BY_THEME[process.env.THEME as TTheme];

  // A theme with no body of its own 404s rather than falling back: these are
  // separate products on separate domains, so serving one theme's index on
  // another's domain would describe the wrong database.
  if (!content) {
    return { notFound: true };
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(content);
  res.end();

  return {
    props: {},
  };
}

export default LlmsTxt;
