import { useEffect, useState } from "react";

import { getFilters } from "../api/http-common";

export default function useGetThemeConfig() {
  const [status, setStatus] = useState("idle");
  const [themeConfig, setThemeConfig] = useState(null);

  useEffect(() => {
    getFilters().then((res) => {
      if (res.status === 200) {
        setThemeConfig(res.data);
        setStatus("success");
      }
    });
  }, []);

  return { status, themeConfig };
}
