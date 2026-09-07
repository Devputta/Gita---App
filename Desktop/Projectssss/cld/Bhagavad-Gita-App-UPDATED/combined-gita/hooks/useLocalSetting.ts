import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useLocalSetting<T extends string>(
  key: string,
  initialValue: T,
): readonly [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(key).then((stored) => {
      if (!active) return;
      if (stored) setValue(stored as T);
      setLoaded(true);
    });
    return () => { active = false; };
  }, [key]);

  const save = useCallback(async (nextValue: T) => {
    setValue(nextValue);
    await AsyncStorage.setItem(key, nextValue);
  }, [key]);

  return [value, save, loaded] as const;
}
