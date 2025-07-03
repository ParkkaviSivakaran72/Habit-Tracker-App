import { View, StyleSheet, ScrollView } from "react-native";
import { Link } from 'expo-router';
import { Text, Button } from "react-native-paper";
import { useAuth } from "@/lib/auth-contxt";
import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, HABITS_COMPLETIONS_COLLECTION_ID, realTimeResponse } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { useEffect, useRef, useState } from "react";
import { Habit, HabitCompletion } from "@/types/databases.type";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Swipeable } from "react-native-gesture-handler";

export default function DailyHabits() {
  const { user, signout } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([])
  const [completedHabits, setCompletedHabits] = useState<string[]>([])
  const SwipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})

  useEffect(() => {
    if (!user) return;
    if (user) {

      const habitSubscription = client.subscribe(`databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`,
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
      const completionSubscription = client.subscribe(`databases.${DATABASE_ID}.collections.${HABITS_COMPLETIONS_COLLECTION_ID}.documents`,
        (response: realTimeResponse) => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            fetchCompletedHabits();
          }
          
        }
      )
      fetchHabits();
      fetchCompletedHabits();

      return () => {
        habitSubscription();
        completionSubscription();

      }
    }
  }, [user])

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? '')]
      )
      console.log(response.documents)
      setHabits(response.documents as Habit[])
    } catch (error) {
      console.error(error)
    }
  }
  const fetchCompletedHabits = async () => {
    try {
      const today = new Date();
      today.setHours(0,0,0,0)
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? ''),
        Query.greaterThanEqual("completed_at",today.toISOString())]
      )
      console.log(response.documents)
      const completions = response.documents as HabitCompletion[];
      setCompletedHabits(completions.map((completion) => completion.habit_id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteHabit = async (id:string) => {
    try {
      await databases.deleteDocument(DATABASE_ID,HABITS_COLLECTION_ID,id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCompleteHabit = async (id:string) => {
    if(!user || completedHabits?.includes(id)) return;
    try {
      const currentDate = new Date().toISOString();
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COMPLETIONS_COLLECTION_ID,
        ID.unique(),
        {
          habit_id : id,
          user_id: user.$id,
          completed_at : currentDate
        }
      )

      const habit = habits.find((h) => h.$id === id)
      if(!habit) return;

      await databases.updateDocument(DATABASE_ID,HABITS_COLLECTION_ID,id,{
        streak_count : habit.streak_count + 1,
        last_completed: currentDate ,
      })

    } catch (error) {
      console.error(error)
    }
  }

  const isHabitCompleted = (id:string) => {
    return completedHabits?.includes(id);
  }

  const renderRightActions = (habitId:string) => {
    return (
      
      <View style={styles.RightAction}>
        {
          isHabitCompleted(habitId) ? (<Text>Completed</Text>):
          <MaterialCommunityIcons name="check-circle-outline" size={24} color="black" />
        }
        
      </View>
    )
  }
  const renderLeftActions = () => {
    return (
      <View style={styles.LeftAction}>
        <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" />
      </View>
    )
  }

  return (
    <View style={styles.view}>
      <Text style={styles.header} variant="headlineSmall">Today Habits</Text>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.listContainer}>
          {habits?.length === 0 ? (
            <Text style={styles.emptyText} variant="bodyLarge">No habits found</Text>
          ) : (
            habits.map((habit, key) => (
              <Swipeable
                ref={(ref) => { SwipeableRefs.current[habit.$id] = ref }}
                key={key}
                overshootLeft={false}
                overshootRight={false}
                renderLeftActions={renderLeftActions}
                renderRightActions={() => renderRightActions(habit.$id)}
                onSwipeableOpen = {(direction) => {
                  if(direction === 'left'){
                    handleDeleteHabit(habit.$id)
                  }
                  else if (direction === 'right'){
                    handleCompleteHabit(habit.$id)
                  }
                  SwipeableRefs.current[habit.$id]?.close();
                }
              }
                >
                <View style={[styles.habitCard,isHabitCompleted(habit.$id) && styles.completedCard]}>
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
              </Swipeable>
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
  completedCard: {
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  header: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
  },
  RightAction: {
    backgroundColor: '#d4edda',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    width: '100%',
    height: '100%', // Use 100% to ensure alignment with habitCard
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  LeftAction: {
    backgroundColor: '#f8d7da',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
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
