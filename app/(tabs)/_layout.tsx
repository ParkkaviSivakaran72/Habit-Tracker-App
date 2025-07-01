
import { AuthProvider } from "@/lib/auth-contxt";
import AppNavigator from "@/lib/AppNavigator";


export default function TabsLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
      
    </AuthProvider>
  );
}

