import React from "react";
import { useAuth } from "@/lib/auth-contxt";
import { View, ActivityIndicator } from "react-native";
import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Index from "@/app/(tabs)"; // your main app screens
import Auth from "@/app/(tabs)/auth";   // your Auth component

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', tabBarInactiveTintColor: 'gray' }}>
        <Tabs.Screen name="auth" options={{ title: 'Auth', tabBarIcon: ({ color, focused }) => { return focused ? (<Entypo name="login" size={24} color={color} />) : (<MaterialCommunityIcons name="login" size={24} color={color} />) } }} />
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, focused }) => { return focused ? (<Entypo name="home" size={24} color={color} />) : (<AntDesign name="home" size={24} color={color} />) } }} />
        <Tabs.Screen name="login" options={{ title: 'Login', tabBarIcon: ({ color, focused }) => { return focused ? (<Entypo name="login" size={24} color={color} />) : (<MaterialCommunityIcons name="login" size={24} color={color} />) } }} />
    </Tabs>
  );
}
