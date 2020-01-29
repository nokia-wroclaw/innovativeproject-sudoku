import { useRef, useEffect } from "react";

/**
 * A custom useEffect hook that only triggers on mount.
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {Function} effect
 * @param {Array<any>} deps
 */
export default function useMountEffect(effect, deps) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return effect();
    }
    return undefined;
  }, deps);
}
