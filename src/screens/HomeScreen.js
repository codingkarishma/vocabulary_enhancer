import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';

const CHAPTERS = [
  { id: 1, title: 'Everyday Vocabulary', icon: '📚' },
  { id: 2, title: 'Communication Vocabulary', icon: '💬' },
  { id: 3, title: 'Professional Vocabulary', icon: '💼' },
  { id: 4, title: 'Interview Vocabulary', icon: '🎤' },
  { id: 5, title: 'Advanced Vocabulary', icon: '🚀' },
];

const MILESTONES = [
  { days: 7, icon: '🌱', label: 'Seed' },
  { days: 15, icon: '🌿', label: 'Sprout' },
  { days: 30, icon: '🌳', label: 'Tree' },
  { days: 45, icon: '🔥', label: 'Dedicated Learner' },
  { days: 90, icon: '🏆', label: 'Consistency Champion' },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { currentChapter, streak, setStreak, setCurrentChapter } =
    useLearningStore();
  const [userData, setUserData] = useState(null);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
      } else if (data) {
        setUserData(data);
        setStreak(data.streak || 0);
        setCurrentChapter(data.currentChapter || 1);
      }

      // Fetch completed chapters
      const { data: quizData } = await supabase
        .from('quiz_results')
        .select('chapterId')
        .eq('userId', user.id)
        .eq('passed', true);

      if (quizData) {
        setCompletedChapters(quizData.map((q) => q.chapterId));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChapterStatus = (chapterId) => {
    if (completedChapters.includes(chapterId)) return 'completed';
    if (chapterId <= currentChapter) return 'unlocked';
    return 'locked';
  };

  const getNextMilestone = () => {
    for (let milestone of MILESTONES) {
      if (streak < milestone.days) {
        return milestone;
      }
    }
    return null;
  };

  const nextMilestone = getNextMilestone();
  const daysUntilMilestone = nextMilestone ? nextMilestone.days - streak : 0;

  const handleChapterPress = (chapterId) => {
    const status = getChapterStatus(chapterId);
    if (status === 'locked') {
      Alert.alert('Locked', 'Complete previous chapters to unlock this one.');
      return;
    }

    setCurrentChapter(chapterId);
    navigation.navigate('WordLearning', { chapterId });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.level}>{userData?.level || 'Beginner'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Streak Section */}
      <View style={styles.streakSection}>
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakLabel}>Current Streak</Text>
          <Text style={styles.streakCount}>{userData?.streak || 0} days</Text>
        </View>

        {nextMilestone && (
          <View style={styles.milestoneCard}>
            <Text style={styles.milestoneIcon}>{nextMilestone.icon}</Text>
            <Text style={styles.milestoneLabel}>
              Next: {nextMilestone.label}
            </Text>
            <Text style={styles.milestoneDays}>
              {daysUntilMilestone} days away
            </Text>
          </View>
        )}
      </View>

      {/* Chapters Staircase */}
      <View style={styles.chaptersSection}>
        <Text style={styles.sectionTitle}>Your Learning Path</Text>
        <View style={styles.staircase}>
          {CHAPTERS.map((chapter, index) => {
            const status = getChapterStatus(chapter.id);
            const isCompleted = status === 'completed';
            const isUnlocked = status === 'unlocked';

            return (
              <TouchableOpacity
                key={chapter.id}
                style={[
                  styles.chapterStep,
                  {
                    marginLeft: index * 15,
                    backgroundColor: isCompleted
                      ? '#34C759'
                      : isUnlocked
                        ? '#007AFF'
                        : '#e0e0e0',
                  },
                ]}
                onPress={() => handleChapterPress(chapter.id)}
                disabled={!isUnlocked && !isCompleted}
              >
                <Text style={styles.stepIcon}>{chapter.icon}</Text>
                <Text
                  style={[
                    styles.stepText,
                    !isUnlocked && !isCompleted && { color: '#999' },
                  ]}
                >
                  {chapter.title}
                </Text>
                <Text style={styles.stepStatus}>
                  {isCompleted ? '✓' : isUnlocked ? '🔓' : '🔒'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Continue Learning */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() =>
          navigation.navigate('WordLearning', { chapterId: currentChapter })
        }
      >
        <Text style={styles.continueButtonText}>Continue Learning →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  level: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  streakSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  streakIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  milestoneCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  milestoneIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  milestoneLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  milestoneDays: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chaptersSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  staircase: {
    gap: 15,
  },
  chapterStep: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  stepIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  stepStatus: {
    marginTop: 5,
    fontSize: 14,
  },
  continueButton: {
    margin: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
