import { useEffect, useState } from "react";
import { readJson, writeJson } from "../lib/storage";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readJson(key, fallback));

  useEffect(() => {
    writeJson(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
