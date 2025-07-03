import { databases, DATABASE_ID, HABITS_COLLECTION_ID, HABITS_COMPLETIONS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-contxt'
import { Habit, HabitCompletion } from '@/types/databases.type';
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native'
import { Query } from 'react-native-appwrite';

export default function Streaks() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([])
    const {user} = useAuth();

    useEffect(() => {
        
            fetchHabits();
            fetchCompletedHabits();
        }
    , [user])

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
            
            const response = await databases.listDocuments(
                DATABASE_ID,
                HABITS_COMPLETIONS_COLLECTION_ID,
                [Query.equal("user_id", user?.$id ?? '')]
            )
            const completions = response.documents as HabitCompletion[];
            setCompletedHabits(completions)
        } catch (error) {
            console.error(error)
        }
    }
    interface streak_data{
        streak:number,
        bestStreak:number,
        total:number
    }

    const getStreak = (habitId : string) : streak_data => {
        const habitCompletions  = completedHabits?.filter((completion) => completion.habit_id === habitId)
        .sort((a,b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())

        if(habitCompletions?.length === 0){
            return {
                streak : 0,
                bestStreak : 0,
                total :0
            }
        }

        let streak = 0;
        let bestStreak = 0;
        let total = habitCompletions?.length;

        let lastDate : Date | null = null;
        let currentStreak = 0;

        habitCompletions?.forEach((completion) => {
            const date = new Date(completion.completed_at)
            if(lastDate){
                const differences = ( date.getTime() - lastDate.getTime() ) / (1000 * 60 * 60 * 24);

                if(differences <= 1.5){
                    currentStreak += 1;
                }
                else{
                    currentStreak = 1;
                }
            }else{
                if(currentStreak > bestStreak){
                    bestStreak = currentStreak;
                    streak = currentStreak;
                    lastDate = date;
                }
            }
        })

        return {streak, bestStreak, total}
    }

    return (
        <View>
            <Text>Straks</Text>
        </View>
    )
}