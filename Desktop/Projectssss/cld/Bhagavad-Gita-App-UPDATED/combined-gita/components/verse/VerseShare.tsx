import { Alert, Platform, Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { colors, radii, spacing } from "@/constants/theme";
import { verseUrl } from "@/lib/seo";

type Props={chapter:number;verse:number;sanskrit:string;translation?:string|null};
export function VerseShare({chapter,verse,sanskrit,translation}:Props){
 const link=verseUrl(chapter,verse); const text=`Bhagavad Gita — Chapter ${chapter}, Verse ${verse}\n\n${sanskrit}${translation?`\n\n${translation}`:""}\n\n${link}`;
 const copy=async(value:string,label:string)=>{await Clipboard.setStringAsync(value);Alert.alert(label,"Copied to clipboard.");};
 const native=async()=>{try{await Share.share({title:`Bhagavad Gita — Chapter ${chapter}, Verse ${verse}`,message:text,url:link});}catch{}}
 const external=(service:string)=>{if(typeof window==="undefined")return; const u=service==="whatsapp"?`https://wa.me/?text=${encodeURIComponent(text)}`:service==="facebook"?`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`:service==="x"?`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Bhagavad Gita — Chapter ${chapter}, Verse ${verse}`)}&url=${encodeURIComponent(link)}`:`mailto:?subject=${encodeURIComponent(`Bhagavad Gita — Chapter ${chapter}, Verse ${verse}`)}&body=${encodeURIComponent(text)}`; window.open(u,"_blank","noopener,noreferrer");};
 return <View style={styles.wrap}><Text style={styles.title}>Share this verse</Text><View style={styles.row}><Button label="Copy Link" onPress={()=>void copy(link,"Link")}/><Button label="Copy Text" onPress={()=>void copy(text,"Text")}/><Button label="WhatsApp" onPress={()=>external("whatsapp")}/><Button label="Facebook" onPress={()=>external("facebook")}/><Button label="X" onPress={()=>external("x")}/><Button label="Email" onPress={()=>external("email")}/>{Platform.OS!=="web"&&<Button label="Share" onPress={()=>void native()}/>}</View></View>
}
function Button({label,onPress}:{label:string;onPress:()=>void}){return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed})=>[styles.button,pressed&&styles.pressed]}><Text style={styles.buttonText}>{label}</Text></Pressable>}
const styles=StyleSheet.create({wrap:{marginTop:spacing.xl,padding:spacing.lg,borderRadius:radii.lg,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.border},title:{fontSize:18,fontWeight:"900",color:colors.ink,marginBottom:spacing.md},row:{flexDirection:"row",flexWrap:"wrap",gap:spacing.sm},button:{minHeight:44,paddingHorizontal:14,borderRadius:radii.pill,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white,justifyContent:"center"},pressed:{opacity:.7,transform:[{scale:.98}]},buttonText:{fontWeight:"800",color:colors.ink,fontSize:13}});
