import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function GitaLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: "#9C97A6",
        tabBarStyle: { backgroundColor: colors.navy, borderTopColor: colors.purple },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="chapters/index" options={{
        title: "Chapters",
        tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="bookmarks" options={{
        title: "Bookmarks",
        tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="settings" options={{
        title: "Settings",
        tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="chapter/[chapterNumber]" options={{ href: null }} />
      <Tabs.Screen name="verse/[chapterNumber]/[verseNumber]" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
