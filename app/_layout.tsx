import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider } from "@/lib/auth-contxt";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = false;
  useEffect(() => {
    if (!isAuth) {
      router.replace("/auth");
    }
  });
  return <>{children}</>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* <PaperProvider> */}
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      {/* </PaperProvider> */}
    </AuthProvider>
  );
}

