import { databases, DATABASE_ID, HABITS_COLLECTION_ID, HABITS_COMPLETIONS_COLLECTION_ID, client, realTimeResponse } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-contxt'
import { Habit, HabitCompletion } from '@/types/databases.type';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native'
import { Query } from 'react-native-appwrite';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';


export default function Streaks() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([])
    const { user } = useAuth();

    useEffect(() => {

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

            })

        fetchHabits();
        fetchCompletedHabits();

        return () => {
            habitSubscription();
            completionSubscription();
        }
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
    interface streak_data {
        streak: number,
        bestStreak: number,
        total: number
    }

    const getStreak = (habitId: string): streak_data => {
        const habitCompletions = completedHabits?.filter((completion) => completion.habit_id === habitId)
            .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())

        if (habitCompletions?.length === 0) {
            return {
                streak: 0,
                bestStreak: 0,
                total: 0
            }
        }

        let streak = 0;
        let bestStreak = 0;
        let total = habitCompletions?.length;

        let lastDate: Date | null = null;
        let currentStreak = 0;

        habitCompletions?.forEach((completion) => {
            const date = new Date(completion.completed_at)
            if (lastDate) {
                const differences = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

                if (differences <= 1.5) {
                    currentStreak += 1;
                }
                else {
                    currentStreak = 1;
                }
            } else {
               currentStreak = 1;
            }
             if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                    streak = currentStreak;
                    lastDate = date;
                }
        })

        return { streak, bestStreak, total }
    }

    const habitstreak = habits.map((habit) => {
        const { streak, bestStreak, total } = getStreak(habit.$id);
        return { streak, bestStreak, total, habit }
    })

    const rankedHabits = habitstreak.sort((a, b) => b.bestStreak - a.bestStreak)

    const badgeStyles = [styles.badge1, styles.badge2, styles.badge3]
    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Today Streaks</Text>
            </View>

            {
                rankedHabits.length > 0 && (
                    <View style={styles.topStreaksContainer}>
                        <Text style={styles.topStreaksHeader}>Top Streaks</Text>
                        {rankedHabits.slice(0, 3).map((item, key) => (
                            <View key={key} style={styles.streakItem}>
                                <View style={[styles.rankingBadge, badgeStyles[key]]}>
                                    <Text style={styles.badgeText}>{key + 1}</Text>
                                </View>
                                <View>
                                    <Text style={styles.habitTitle}>{item.habit.title}</Text>
                                    <Text style={styles.streakText}>{item.bestStreak} day best streak</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )
            }
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 250 }}>

                <View style={styles.container}>
                    {habits.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No habits found</Text>
                        </View>
                    ) : (

                        rankedHabits.map(({ streak, bestStreak, total, habit }, key) => (

                            <Card key={key} style={styles.card}>
                                <Card.Content style={styles.cardContent}>
                                    <Text style={styles.title}>{habit.title}</Text>
                                    <Text style={styles.subtitle}>{habit.description}</Text>

                                    <View style={styles.statsRow}>
                                        <View style={styles.statBox}>
                                            <MaterialCommunityIcons name="fire" color="#FF6F00" size={20} />
                                            <Text style={styles.statValue}>{streak}</Text>
                                            <Text style={styles.statLabel}>Current</Text>
                                        </View>
                                        <View style={styles.statBox}>
                                            <MaterialCommunityIcons name="trophy-outline" color="#E2B93B" size={20} />
                                            <Text style={styles.statValue}>{bestStreak}</Text>
                                            <Text style={styles.statLabel}>Best</Text>
                                        </View>
                                        <View style={styles.statBox}>
                                            <MaterialCommunityIcons name="check-circle-outline" color="#2ECA8B" size={20} />
                                            <Text style={styles.statValue}>{total}</Text>
                                            <Text style={styles.statLabel}>Total</Text>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))

                    )}
                </View>
            </ScrollView>
        </View>
    );

}



const styles = StyleSheet.create({
    topStreaksContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingTop:10,
        borderRadius:12,
        width:'80%',
        marginLeft:'10%',
        marginBottom:10,
        alignItems:'center',
        backgroundColor: '#F9F9FB'
        
    },
    topStreaksHeader: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333',
    },
    streakItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    rankingBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    badge1: {
        backgroundColor: '#FFD700', // gold
    },
    badge2: {
        backgroundColor: '#C0C0C0', // silver
    },
    badge3: {
        backgroundColor: '#CD7F32', // bronze
    },
    habitTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    streakText: {
        fontSize: 13,
        color: '#666',
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    container: {
        padding: 16,
        backgroundColor: '#F9F9FB',
        flex: 1,
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 3,
        backgroundColor: '#fff',
    },
    cardContent: {
        paddingVertical: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 8,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 80,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 4,
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});
