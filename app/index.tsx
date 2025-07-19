// app/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

export default function IndexPage() {
  const router = useRouter();
  const isAuth = false; // Replace with your actual auth check

  useEffect(() => {
    // Check auth status and redirect accordingly
    if (isAuth) {
      router.replace('./(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [isAuth]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff' }}>Loading...</Text>
    </View>
  );
}