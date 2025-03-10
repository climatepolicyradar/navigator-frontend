import { useEffect, useState } from "react";

import { TThemeConfig } from "@/types";

import { getFilters } from "../api/http-common";

export default function useGetThemeConfig() {
  const [status, setStatus] = useState("idle");
  const [themeConfig, setThemeConfig] = useState<TThemeConfig | null>(null);

  useEffect(() => {
    setStatus("loading");
    getFilters().then((res) => {
      if (res.status === 200) {
        setThemeConfig(res.data);
        setStatus("success");
      }
    });
  }, []);

  return { status, themeConfig };
}
