import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthProvider } from "@/lib/auth-contxt";


export default function TabsLayout() {
  return (
    <AuthProvider>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', tabBarInactiveTintColor: 'gray' }}>
        <Tabs.Screen name="auth" options={{ title: 'Auth', tabBarIcon: ({ color, focused }) => { return focused ? (<Entypo name="login" size={24} color={color} />) : (<MaterialCommunityIcons name="login" size={24} color={color} />) } }} />
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, focused }) => { return focused ? (<Entypo name="home" size={24} color={color} />) : (<AntDesign name="home" size={24} color={color} />) } }} />
        <Tabs.Screen name="login" options={{ title: 'Login', tabBarIcon: ({ color, focused }) => { return focused ? (<Entypo name="login" size={24} color={color} />) : (<MaterialCommunityIcons name="login" size={24} color={color} />) } }} />
      </Tabs>
    </AuthProvider>
  );
}

