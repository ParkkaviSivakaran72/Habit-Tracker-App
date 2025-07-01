import React, { createContext, useContext, useEffect, useState } from "react";
import { Account, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signup: (username: string, email: string, password: string) => Promise<string | null>;
  signin: (email: string, password: string) => Promise<string | null>;
  signout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getCurrentUser = async () => {
    try {
      const current = await account.get();
      setUser(current);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const signup = async (username: string, email: string, password: string) => {
    try {
      await account.create('unique()', email, password, username);
      await signin(email, password);
      return null;
    } catch (error: any) {
      return error.message ?? "Error occurred";
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await getCurrentUser();
      return null;
    } catch (error: any) {
      return error.message ?? "Error occurred";
    }
  };

  const signout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
