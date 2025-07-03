import {Client,Databases,Account} from 'react-native-appwrite';

export const client  = new Client().setEndpoint(process.env.EXPO_PUBLIC_ENDPOINT!)
.setProject(process.env.EXPO_PUBLIC_PROJECT_ID!)
.setPlatform(process.env.EXPO_PUBLIC_PLATFORM_ID!);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!
export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_ID!
export const HABITS_COMPLETIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COMPLETIONS_ID!

export interface realTimeResponse {
    events: string[];
    payload:any
}