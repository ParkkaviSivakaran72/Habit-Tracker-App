import { useAuth } from '@/lib/auth-contxt';
import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';

export default function Auth() {
    const [isSignup, setIsSignUp] = useState<Boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmedPassword, setConfirmedPassword] = useState<string>('');
    const [error, setError] = useState<string | null>('');

    const { signup, signin } = useAuth();
    const theme = useTheme();


    const handleAuth = async () => {
        if (isSignup) {
            // Sign up validation
            if (!userName || !email || !newPassword || !confirmedPassword) {
                setError('Please fill all fields');
                return;
            }
            if (newPassword.length < 8) {
                setError('Password must be at least 8 characters long');
                return;
            }
            if (newPassword !== confirmedPassword) {
                setError('Passwords do not match');
                return;
            }

            setError(null);
            const signupError = await signup(userName, email, newPassword);
            if (signupError) {
                setError(signupError);
            }
        } else {
            // Sign in validation
            if (!email || !password) {
                setError('Please fill all fields');
                return;
            }

            setError(null);
            const signinError = await signin(email, password);
            if (signinError) {
                setError(signinError);
            }
        }
    };

    const handleSwitchMode = () => {
        setIsSignUp(prevState => !prevState);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.formContainer}>
                <Text style={styles.heading}>
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                </Text>

                {isSignup && (
                    <TextInput
                        label="User Name"
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="JohnDoe"
                        mode="outlined"
                        style={styles.input}
                        onChangeText={setUserName}
                    />
                )}

                <TextInput
                    label='Email'
                    autoCapitalize="none"
                    keyboardType='email-address'
                    placeholder='JohnDoe@gmail.com'
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                />

                <TextInput
                    label={isSignup ? 'New Password' : 'Password'}
                    autoCapitalize="none"
                    secureTextEntry
                    placeholder="********"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={isSignup ? setNewPassword : setPassword}
                />

                {isSignup && (
                    <TextInput
                        label="Confirm Password"
                        autoCapitalize="none"
                        secureTextEntry
                        placeholder="********"
                        mode="outlined"
                        style={styles.input}
                        onChangeText={setConfirmedPassword}
                    />
                )}

                {error && (
                    <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                        {error}
                    </Text>
                )}

                <Button mode="contained" style={styles.primaryButton} onPress={handleAuth}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>

                <Button mode="text" onPress={handleSwitchMode}>
                    {isSignup
                        ? 'Already have an account? Sign In'
                        : "Don't have an account? Sign Up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        marginBottom: 15,
    },
    primaryButton: {
        marginTop: 10,
        paddingVertical: 5,
    },
});
