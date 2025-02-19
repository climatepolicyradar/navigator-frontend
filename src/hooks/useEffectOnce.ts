import { EffectCallback, useEffect } from "react";

export function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- we do this as this effect explicitly runs things once
  useEffect(effect, []);
}
