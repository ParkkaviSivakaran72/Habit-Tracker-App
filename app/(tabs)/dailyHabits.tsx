import { View, StyleSheet, ScrollView } from "react-native";
import { Link } from 'expo-router';
import { Text, Button } from "react-native-paper";
import { useAuth } from "@/lib/auth-contxt";
import { client, databases, realTimeResponse } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import { Habit } from "@/types/databases.type";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function DailyHabits() {
  const { user, signout } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    if(!user) return;
    if (user) {

      const habitSubscription = client.subscribe('databases.6864e0e900014c062975.collections.6864e123001c8af2f761.documents',
        (response: realTimeResponse) => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            fetchHabits();
          }
          else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            fetchHabits();
          }
          else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
            fetchHabits();
          }
        }
      )
      fetchHabits();

      return () => {
        habitSubscription()
      }
    }
  }, [user])

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        "6864e0e900014c062975",
        "6864e123001c8af2f761",
        [Query.equal("user_id", user?.$id ?? '')]
      )
      console.log(response.documents)
      setHabits(response.documents as Habit[])
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <View style={styles.view}>
      <Text style={styles.header} variant="headlineSmall">Today Habits</Text>

      <ScrollView >

        <View style={styles.listContainer}>
          {habits?.length === 0 ? (
            <Text style={styles.emptyText} variant="bodyLarge">No habits found</Text>
          ) : (
            habits.map((habit, key) => (
              <View key={key} style={styles.habitCard}>
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitDescription}>{habit.description}</Text>
                <View style={styles.streak_frequency}>
                  <View style={styles.streakLeft}>
                    <MaterialCommunityIcons name="fire" size={24} color="#FF6F00" />
                    <Text style={styles.streakText}>{habit.streak_count} day Streak</Text>
                  </View>
                  <Text style={styles.frequency}>{habit.frequency}</Text>
                </View>

              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  view: {
    flex: 1,

    padding: 20,
    backgroundColor: '#F9F9FB',
  },
  header: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  streak_frequency: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 4,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    color: '#6A4FB3',
    marginBottom: 2,
  },
  frequency: {
    fontSize: 13,
    color: '#999',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
