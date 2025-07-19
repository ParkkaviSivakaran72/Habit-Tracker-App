import React from "react";
import { useAuth } from "@/lib/auth-contxt";
import { View, ActivityIndicator } from "react-native";
import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import dailyHabits from "@/app/(tabs)/dailyHabits"; 
import Auth from "@/app/auth";   
import addHabits from "@/app/(tabs)/addHabits"; 
import streaks from "@/app/(tabs)/streaks";
import settings from "@/app/(tabs)/settings"; 
import profile from "@/app/(tabs)/profile"; 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';


export default function AppNavigator() {
  const { user, loading, signout } = useAuth();

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
  <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      headerStyle: {
        backgroundColor: '#6A4FB3',
        shadowColor: 'transparent',
      },
      headerTintColor: '#FFFFFF',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E0E0E0',
      },
      tabBarActiveTintColor: '#6A4FB3',
      tabBarInactiveTintColor: '#888888',
    }}
  >

    {/* 5 Main Tabs - Spread Full Width */}
    <Tabs.Screen
      name="dailyHabits"
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome name="calendar-check-o" size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="streaks"
      options={{
        tabBarIcon: ({ color }) => (
          <Octicons name="graph" size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="addHabits"
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="add-task" size={26} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="settings"
      options={{
        
        tabBarIcon: ({ color }) => (
          <SimpleLineIcons name="settings" size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons
            name="face-man-shimmer"
            size={24}
            color={color}
          />
        ),
        headerRight: () => null,
      }}
    />

   
  </Tabs>
);

}
