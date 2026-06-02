import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../config/supabase';

const SentencePracticeScreen = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sentence, setSentence] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

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
        { id: 1, word: 'Serendipity' },
        { id: 2, word: 'Eloquent' },
        { id: 3, word: 'Ephemeral' },
        { id: 4, word: 'Vivacious' },
        { id: 5, word: 'Placid' },
      ],
    };
    return wordsByChapter[chapter] || [];
  };

  const validateSentence = () => {
    const word = words[currentWordIndex];
    const wordLower = word.word.toLowerCase();
    const sentenceLower = sentence.toLowerCase();
    const wordCount = sentence.trim().split(/\s+/).length;

    if (!sentenceLower.includes(wordLower)) {
      return {
        valid: false,
        message: `Your sentence must include the word "${word.word}".`,
      };
    }

    if (wordCount < 5) {
      return {
        valid: false,
        message: 'Your sentence must have at least 5 words.',
      };
    }

    return {
      valid: true,
      message: 'Great job! Your sentence correctly uses the word.',
    };
  };

  const handleSubmit = () => {
    const validation = validateSentence();
    setFeedback(validation);
    setAnswered(true);
  };

  const handleContinue = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setSentence('');
      setFeedback(null);
      setAnswered(false);
    } else {
      Alert.alert(
        'Practice Complete! 🎉',
        "You've practiced all words. Ready for the quiz?",
        [
          {
            text: 'Take Quiz',
            onPress: () => navigation.navigate('Quiz', { chapterId }),
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.replace('Home'),
            style: 'cancel',
          },
        ],
      );
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
          <Text style={styles.emptyText}>No words found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sentence Practice</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {currentWordIndex + 1} of {words.length}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>

          <View style={styles.practiceCard}>
            <View style={styles.targetWordBox}>
              <Text style={styles.targetLabel}>Use this word:</Text>
              <Text style={styles.targetWord}>{currentWord.word}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Write a sentence using the word above..."
              placeholderTextColor="#94A3B8"
              value={sentence}
              onChangeText={setSentence}
              editable={!answered}
              multiline
              textAlignVertical="top"
            />

            {!answered ? (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !sentence.trim() && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!sentence.trim()}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>Check Sentence</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View
                  style={[
                    styles.feedbackBox,
                    feedback.valid
                      ? styles.feedbackCorrect
                      : styles.feedbackIncorrect,
                  ]}
                >
                  <Text
                    style={[
                      styles.feedbackIcon,
                      feedback.valid
                        ? styles.feedbackIconCorrect
                        : styles.feedbackIconIncorrect,
                    ]}
                  >
                    {feedback.valid ? '✓' : '✗'}
                  </Text>
                  <Text
                    style={[
                      styles.feedbackMessage,
                      feedback.valid
                        ? styles.feedbackMessageCorrect
                        : styles.feedbackMessageIncorrect,
                    ]}
                  >
                    {feedback.message}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                  activeOpacity={0.85}
                >
                  <Text style={styles.continueButtonText}>
                    {currentWordIndex === words.length - 1
                      ? 'Finish Practice'
                      : 'Next Word →'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scroll: {
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
    backgroundColor: '#F59E0B',
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
    color: '#F59E0B',
    fontWeight: '700',
  },
  practiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    gap: 20,
  },
  targetWordBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  targetWord: {
    fontSize: 28,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: -0.3,
  },
  input: {
    backgroundColor: '#FAFBFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  feedbackBox: {
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackCorrect: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  feedbackIncorrect: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  feedbackIcon: {
    fontSize: 20,
    fontWeight: '700',
    width: 28,
    textAlign: 'center',
  },
  feedbackIconCorrect: {
    color: '#059669',
  },
  feedbackIconIncorrect: {
    color: '#DC2626',
  },
  feedbackMessage: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  feedbackMessageCorrect: {
    color: '#059669',
  },
  feedbackMessageIncorrect: {
    color: '#DC2626',
  },
  continueButton: {
    backgroundColor: '#4F46E5',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4F46E5',
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

export default SentencePracticeScreen;