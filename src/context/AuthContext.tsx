
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { User as AppUser } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (
    email: string,
    pass: string,
    userData: Omit<AppUser, 'id' | 'email'>
  ) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
          } else {
            // This case might happen if the user doc creation fails after registration
            console.error('User document not found for UID:', firebaseUser.uid);
            setUser(null);
          }
        } catch (e) {
          console.error('Error fetching user document:', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const login = useCallback(
    async (email: string, pass: string) => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Login error:', error);
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: error.message || 'An unknown error occurred.',
        });
      } finally {
        setLoading(false);
      }
    },
    [auth, router, toast]
  );

  const register = useCallback(
    async (email: string, pass: string, userData: Omit<AppUser, 'id' | 'email'>) => {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          pass
        );
        const firebaseUser = userCredential.user;
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        
        const appUserData: AppUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          ...userData,
        } as AppUser;

        await setDoc(userDocRef, appUserData);
        
        // Manually set user to avoid race condition with onAuthStateChanged
        setUser(appUserData); 
        setLoading(false);
        router.push('/dashboard');
        return userCredential;
      } catch (error: any) {
        console.error('Registration error:', error);
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: error.message || 'Could not create your account.',
        });
        setLoading(false);
        throw error;
      }
    },
    [auth, firestore, router, toast]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    router.push('/');
  }, [auth, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
