import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';

const CHAPTERS = [
  { id: 1, title: 'Everyday Vocabulary', icon: '📚', color: '#4F46E5' },
  { id: 2, title: 'Communication', icon: '💬', color: '#7C3AED' },
  { id: 3, title: 'Professional', icon: '💼', color: '#0EA5E9' },
  { id: 4, title: 'Interview Ready', icon: '🎤', color: '#EC4899' },
  { id: 5, title: 'Advanced Mastery', icon: '🚀', color: '#F59E0B' },
];

const MILESTONES = [
  { days: 7, icon: '🌱', label: 'Seed' },
  { days: 15, icon: '🌿', label: 'Sprout' },
  { days: 30, icon: '🌳', label: 'Tree' },
  { days: 45, icon: '🔥', label: 'Dedicated' },
  { days: 90, icon: '🏆', label: 'Champion' },
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
      if (streak < milestone.days) return milestone;
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading your journey...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                {userData?.level || 'Beginner'} Level
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.streakCard]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{userData?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={[styles.statCard, styles.milestoneCard]}>
            <Text style={styles.statIcon}>{nextMilestone?.icon || '🏆'}</Text>
            <Text style={styles.statValue}>{daysUntilMilestone}</Text>
            <Text style={styles.statLabel}>Days to Next</Text>
          </View>

          <View style={[styles.statCard, styles.progressCard]}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>
              {completedChapters.length}/{CHAPTERS.length}
            </Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
        </View>

        {/* Chapters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Learning Path</Text>
          <View style={styles.chaptersList}>
            {CHAPTERS.map((chapter, index) => {
              const status = getChapterStatus(chapter.id);
              const isCompleted = status === 'completed';
              const isUnlocked = status === 'unlocked';
              const isLocked = status === 'locked';

              return (
                <TouchableOpacity
                  key={chapter.id}
                  style={[
                    styles.chapterCard,
                    isCompleted && {
                      backgroundColor: chapter.color,
                      shadowColor: chapter.color,
                    },
                    isUnlocked && {
                      backgroundColor: '#FFFFFF',
                      borderColor: chapter.color,
                      borderWidth: 2,
                    },
                    isLocked && {
                      backgroundColor: '#F1F5F9',
                      borderColor: '#E2E8F0',
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={() => handleChapterPress(chapter.id)}
                  disabled={isLocked}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.chapterIconCircle,
                      isCompleted && { backgroundColor: 'rgba(255,255,255,0.2)' },
                      isUnlocked && { backgroundColor: `${chapter.color}15` },
                      isLocked && { backgroundColor: '#E2E8F0' },
                    ]}
                  >
                    <Text style={styles.chapterIcon}>{chapter.icon}</Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text
                      style={[
                        styles.chapterTitle,
                        isCompleted && { color: '#FFFFFF' },
                        isUnlocked && { color: '#0F172A' },
                        isLocked && { color: '#94A3B8' },
                      ]}
                    >
                      {chapter.title}
                    </Text>
                    <Text
                      style={[
                        styles.chapterStatus,
                        isCompleted && { color: 'rgba(255,255,255,0.8)' },
                        isUnlocked && { color: chapter.color },
                        isLocked && { color: '#CBD5E1' },
                      ]}
                    >
                      {isCompleted
                        ? 'Completed ✓'
                        : isUnlocked
                        ? 'In Progress'
                        : 'Locked'}
                    </Text>
                  </View>
                  <View style={styles.chapterArrow}>
                    <Text
                      style={[
                        styles.arrowText,
                        isCompleted && { color: '#FFFFFF' },
                        isUnlocked && { color: chapter.color },
                        isLocked && { color: '#CBD5E1' },
                      ]}
                    >
                      {isLocked ? '🔒' : '→'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Continue CTA */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate('WordLearning', { chapterId: currentChapter })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            Continue Learning →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  levelBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  chaptersList: {
    gap: 12,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chapterIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chapterIcon: {
    fontSize: 24,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  chapterStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  chapterArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: '#0F172A',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;