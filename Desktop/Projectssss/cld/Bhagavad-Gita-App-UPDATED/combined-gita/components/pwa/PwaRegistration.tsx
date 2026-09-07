import { useEffect } from "react";
export function PwaRegistration(){useEffect(()=>{if(typeof window!=="undefined"&&"serviceWorker" in navigator){navigator.serviceWorker.register("/sw.js").catch(()=>undefined);}},[]);return null;}
