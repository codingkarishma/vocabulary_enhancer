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

const WordLearningScreen = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const { user } = useAuthStore();
  const { addLearnedWord } = useLearningStore();
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [learnedToday, setLearnedToday] = useState(0);

  useEffect(() => {
    fetchWords();
  }, [chapterId]);

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('chapterId', chapterId)
        .limit(5);

      if (error) {
        setWords(getSampleWords(chapterId));
      } else {
        setWords(data || getSampleWords(chapterId));
      }
    } catch (error) {
      setWords(getSampleWords(chapterId));
    } finally {
      setLoading(false);
    }
  };

  const getSampleWords = (chapter) => {
    const wordsByChapter = {
      1: [
        {
          id: 1,
          word: 'Serendipity',
          meaning:
            'The occurrence of events by chance in a happy or beneficial way',
          example: 'Meeting her at the coffee shop was pure serendipity.',
        },
        {
          id: 2,
          word: 'Eloquent',
          meaning: 'Fluent, persuasive, and expressive in speaking or writing',
          example: 'His eloquent speech moved the entire audience.',
        },
        {
          id: 3,
          word: 'Ephemeral',
          meaning: 'Lasting for a very short time',
          example: 'The beauty of cherry blossoms is ephemeral.',
        },
        {
          id: 4,
          word: 'Vivacious',
          meaning: 'Lively, animated, and full of energy',
          example: 'Her vivacious personality brightened the room.',
        },
        {
          id: 5,
          word: 'Placid',
          meaning: 'Calm and peaceful',
          example: 'The placid lake reflected the mountains perfectly.',
        },
      ],
    };
    return wordsByChapter[chapter] || [];
  };

  const handleMarkLearned = async () => {
    const word = words[currentWordIndex];

    try {
      await supabase.from('user_words').upsert({
        userId: user.id,
        wordId: word.id,
        learned: true,
      });

      addLearnedWord(word.id);
      const newLearned = learnedToday + 1;
      setLearnedToday(newLearned);

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
      } else {
        Alert.alert(
          'Session Complete! 🎉',
          `You've learned ${newLearned} words today. Ready to practice them in sentences?`,
          [
            {
              text: 'Practice Sentences',
              onPress: () =>
                navigation.navigate('SentencePractice', { chapterId }),
            },
            {
              text: 'Back to Home',
              onPress: () => navigation.replace('Home'),
              style: 'cancel',
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading words...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No words found for this chapter.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Chapter {chapterId}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              Word {currentWordIndex + 1} of {words.length}
            </Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
        </View>

        <View style={styles.wordCard}>
          <View style={styles.wordBadge}>
            <Text style={styles.word}>{currentWord.word}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Definition</Text>
            <Text style={styles.meaning}>{currentWord.meaning}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Example</Text>
            <View style={styles.exampleBox}>
              <Text style={styles.example}>"{currentWord.example}"</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.learnButton}
            onPress={handleMarkLearned}
            activeOpacity={0.85}
          >
            <Text style={styles.learnButtonText}>Mark as Learned ✓</Text>
          </TouchableOpacity>
        </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  progressContainer: {
    gap: 8,
    marginBottom: 24,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    gap: 24,
  },
  wordBadge: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  word: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  meaning: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
    fontWeight: '500',
  },
  exampleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  example: {
    fontSize: 15,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  learnButton: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  learnButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default WordLearningScreen;