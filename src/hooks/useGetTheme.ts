import { useEffect, useState } from "react";

import { getSiteAsync } from "@/utils/getSite";

export default function useGetTheme() {
  const [status, setStatus] = useState("idle");
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const getTheme = async () => {
      setStatus("loading");
      const response = await getSiteAsync();
      setTheme(response ?? "cpr");
      setStatus("success");
    };

    getTheme();
  }, []);

  return { status, theme };
}
