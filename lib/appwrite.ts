import {Client,Databases,Account} from 'react-native-appwrite';

export const client  = new Client().setEndpoint('https://fra.cloud.appwrite.io/v1')
.setProject('686366d60014fb8b400c' )
.setPlatform('com.mora.tracker');

export const account = new Account(client);