import { useEffect, useState } from "react";
import { DEFAULT_READER_PREFERENCES, getReaderPreferences, saveReaderPreferences, type ReaderPreferences } from "@/lib/reader/preferences";
export function useReaderPreferences(){const [value,setValue]=useState<ReaderPreferences>(DEFAULT_READER_PREFERENCES);useEffect(()=>{void getReaderPreferences().then(setValue);},[]);const update=(next:Partial<ReaderPreferences>)=>{const valueNext={...value,...next};setValue(valueNext);void saveReaderPreferences(valueNext);};return {value,update};}
