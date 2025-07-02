import { Text, View,StyleSheet } from "react-native";
import {Link} from 'expo-router';
import { Button } from "react-native-paper";
import { useAuth } from "@/lib/auth-contxt";

export default function DailyHabits() {
  const {signout} = useAuth();
  return (
    <View
      style={styles.view}
    >
      <Text>Daily Habits</Text>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  view:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }
})