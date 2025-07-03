import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-contxt';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { ID } from 'react-native-appwrite';
import { SegmentedButtons, TextInput, Button, useTheme } from 'react-native-paper';

const frequencies = ['Daily', 'Weekly', 'Monthly'];
type Frequency = (typeof frequencies)[number]

export default function AddHabits() {
    const [title,setTitle] = useState<string>('');
    const [description,setDescription] = useState<string>('');
    const [frequency,setFrequency] = useState<Frequency>('Daily');
    const [error,setError] = useState<string|null>(null);

    const router = useRouter();
    const theme = useTheme();

    const {user} =  useAuth();
    const handleSubmit = async () => {
        if(!user) return;

        try {
            await databases.createDocument(
            DATABASE_ID,
            HABITS_COLLECTION_ID,
            ID.unique(),
            {
                user_id:user.$id,
                title,
                description,
                streak_count:0,
                
                last_completed:new Date().toISOString(),
                frequency,
                created_at: new Date().toISOString()
            }

            )
            router.back();
            
        } catch (error) {
            if(error instanceof Error){
                setError(error.message);
                return;
            }
            setError('An error occurred while adding the habit.');
        }

        
    }
    

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        style={styles.input}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        onChangeText={setDescription}
      />

      <SegmentedButtons
        value={frequency}
        
        buttons={frequencies.map((freq) => ({
          value: freq,
          label: freq,
        }))}
        style={styles.segmented}
        onValueChange = {(value) => setFrequency(value as Frequency)}
      />
      {error && <Text style={{color:theme.colors.error}}>{error}</Text>}

      <Button
        mode="contained"
        onPress={() => {handleSubmit()}}
        style={styles.button}
        disabled= {!title || !description}
        contentStyle={styles.buttonContent}
      >
        Add Habit
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9FB',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});


