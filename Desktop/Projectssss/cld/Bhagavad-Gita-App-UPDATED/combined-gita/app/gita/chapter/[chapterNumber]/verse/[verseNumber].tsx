import { Redirect, useLocalSearchParams } from "expo-router";
export default function PublicVerseAlias(){const p=useLocalSearchParams<{chapterNumber?:string;verseNumber?:string}>(); return <Redirect href={`/gita/verse/${p.chapterNumber}/${p.verseNumber}`}/>;}
