import {Text,View} from 'react-native'
import {Button} from 'react-native-paper'
import { useAuth } from '@/lib/auth-contxt'

export default function Profile(){
    const {signout} = useAuth();
    return (
        <View>
            <Text>
                <Button mode="contained" onPress={signout}>Signout</Button>
            </Text>
        </View>
    )
}