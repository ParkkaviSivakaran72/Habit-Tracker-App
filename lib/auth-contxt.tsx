import React, { createContext, useContext } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
    // user: Models.User<Models.Preferences> | null;
    signup: (userName:string, email: string, newPassword: string) => Promise<string | null>;
    signin: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}:{children:React.ReactNode}) {
    const signup = async (userName: string, email: string, newPassword: string) => {
        try {
            await account.create(ID.unique(), userName, email, newPassword);
            await signin(email,newPassword);
            return null;
            
        } catch (error) {
            if(error instanceof Error) {
                return error.message;
            }
            return 'Error occured'
        }
    }
    const signin = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            return null;
        } catch (error) {
            if(error instanceof Error) {
                return error.message;
            }
            return 'Error occured'
            
        }
    }
    return(
        <AuthContext.Provider value={{signup,signin}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}


