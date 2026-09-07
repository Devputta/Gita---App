import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { VerseCard } from "@/components/verse/VerseCard";
import { colors, radii, spacing, typography } from "@/constants/theme";
import type { Language } from "@/constants/languages";
import { useLocalSetting } from "@/hooks/useLocalSetting";
import { useEffect, useState } from "react";
import { readingProgressStore, type ReadingProgressRecord } from "@/lib/progress/store";
import { applyWebSeo } from "@/lib/seo";

export default function HomeScreen(){
 const router=useRouter(); const [language,setLanguage]=useLocalSetting<Language>("settings.language","SANSKRIT"); const [progress,setProgress]=useState<ReadingProgressRecord|null>(null);
 useEffect(()=>{void readingProgressStore.get().then(setProgress);applyWebSeo({title:"Bhagavad Gita — Sanskrit, Kannada, Hindi & English",description:"Read the Bhagavad Gita verse by verse in Sanskrit with available Kannada, Hindi and English translations.",canonical:"/gita",structuredData:{"@context":"https://schema.org","@type":"WebSite",name:"Bhagavad Gita",url:"/gita"}})},[]);
 return <Screen><View style={styles.hero}><View style={styles.orb}/><Text style={styles.eyebrow}>THE SONG OF THE DIVINE</Text><Text style={styles.sanskrit}>श्रीमद्भगवद्गीता</Text><Text style={styles.title}>BHAGAVAD GITA</Text><Text style={styles.subtitle}>A calm, focused place to read, listen, reflect and continue your journey through 18 chapters and 700 verses.</Text><View style={styles.actions}><PrimaryButton label="Begin Reading" onPress={()=>router.push("/gita/chapters")}/><SecondaryButton label="Search the Gita" onPress={()=>router.push("/gita/search")}/></View></View>
 {progress&&<Pressable accessibilityRole="button" onPress={()=>router.push(`/gita/verse/${progress.chapterNumber}/${progress.verseNumber}`)} style={styles.continue}><View><Text style={styles.kicker}>CONTINUE</Text><Text style={styles.continueTitle}>Chapter {progress.chapterNumber}, Verse {progress.verseNumber}</Text><Text style={styles.continueText}>Pick up exactly where you left off.</Text></View><Text style={styles.arrow}>→</Text></Pressable>}
 <View style={styles.section}><View style={styles.sectionHead}><View><Text style={styles.kicker}>YOUR READING</Text><Text style={styles.sectionTitle}>Choose your language</Text></View></View><LanguageSelector value={language} onChange={setLanguage}/></View>
 <View style={styles.preview}><Text style={styles.kicker}>A SIMPLE READING EXPERIENCE</Text><Text style={styles.sectionTitle}>One verse at a time</Text><VerseCard/><View style={styles.pills}><Text style={styles.pill}>18 Chapters</Text><Text style={styles.pill}>700 Verses</Text><Text style={styles.pill}>4 Languages</Text></View></View>
 </Screen>
}
const styles=StyleSheet.create({hero:{overflow:"hidden",backgroundColor:colors.navy,borderRadius:radii.lg,padding:spacing.xl,marginBottom:spacing.lg,position:"relative"},orb:{position:"absolute",width:180,height:180,borderRadius:90,backgroundColor:colors.purple,opacity:.65,right:-60,top:-70},eyebrow:{color:colors.gold,fontSize:11,fontWeight:"900",letterSpacing:2,textAlign:"center"},sanskrit:{color:colors.ivory,fontSize:34,fontWeight:"800",textAlign:"center",marginTop:spacing.lg},title:{color:colors.gold,fontSize:typography.title,fontWeight:"900",letterSpacing:3,textAlign:"center",marginTop:6},subtitle:{color:"#E7E1F0",fontSize:15,lineHeight:24,textAlign:"center",marginTop:spacing.md},actions:{gap:spacing.sm,marginTop:spacing.xl},continue:{padding:spacing.lg,borderRadius:radii.lg,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.border,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},kicker:{fontSize:11,fontWeight:"900",letterSpacing:1.4,color:colors.saffron},continueTitle:{fontSize:18,fontWeight:"900",color:colors.ink,marginTop:4},continueText:{fontSize:13,color:colors.muted,marginTop:4},arrow:{fontSize:30,color:colors.purpleSoft},section:{marginTop:spacing.xl},sectionHead:{marginBottom:spacing.md},sectionTitle:{fontSize:22,fontWeight:"900",color:colors.ink,marginTop:4},preview:{marginTop:spacing.xl,padding:spacing.lg,borderRadius:radii.lg,backgroundColor:"#F6EFE1",borderWidth:1,borderColor:colors.border},pills:{flexDirection:"row",flexWrap:"wrap",gap:spacing.sm,marginTop:spacing.md},pill:{paddingHorizontal:12,paddingVertical:8,borderRadius:radii.pill,backgroundColor:colors.white,color:colors.purple,fontWeight:"800",fontSize:12}});
