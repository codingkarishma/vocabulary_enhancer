import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { supabase } from './src/config/supabase';
import { useAuthStore } from './src/store/authStore';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import AssessmentScreen from './src/screens/AssessmentScreen';
import AssessmentResultScreen from './src/screens/AssessmentResultScreen';
import HomeScreen from './src/screens/HomeScreen';
import WordLearningScreen from './src/screens/WordLearningScreen';
import SentencePracticeScreen from './src/screens/SentencePracticeScreen';
import QuizScreen from './src/screens/QuizScreen';
import QuizResultScreen from './src/screens/QuizResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, setUser, setSession: setAuthSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        setAuthSession(session);
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        setAuthSession(session);
      } else {
        setUser(null);
        setAuthSession(null);
      }
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!session ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Assessment" component={AssessmentScreen} />
              <Stack.Screen
                name="AssessmentResult"
                component={AssessmentResultScreen}
              />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="WordLearning"
                component={WordLearningScreen}
              />
              <Stack.Screen
                name="SentencePractice"
                component={SentencePracticeScreen}
              />
              <Stack.Screen name="Quiz" component={QuizScreen} />
              <Stack.Screen name="QuizResult" component={QuizResultScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
