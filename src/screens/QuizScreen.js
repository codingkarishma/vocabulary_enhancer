import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';

const QuizScreen = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const { user } = useAuthStore();
  const { addQuizResult } = useLearningStore();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [chapterId]);

  const fetchQuestions = async () => {
    try {
      const quizQuestions = generateQuizQuestions(chapterId);
      setQuestions(quizQuestions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuizQuestions = (chapter) => {
    const questionsByChapter = {
      1: [
        {
          id: 1,
          type: 'meaning',
          question: 'What is the meaning of "Serendipity"?',
          options: [
            'The occurrence of events by chance in a happy way',
            'Sadness and sorrow',
            'Complete failure',
            'Planned success',
          ],
          correct: 0,
        },
        {
          id: 2,
          type: 'meaning',
          question: 'What does "Eloquent" mean?',
          options: [
            'Quiet and reserved',
            'Fluent, persuasive, and expressive',
            'Confused and unclear',
            'Loud and aggressive',
          ],
          correct: 1,
        },
        {
          id: 3,
          type: 'synonym',
          question: 'Choose the synonym for "Ephemeral":',
          options: ['Permanent', 'Fleeting', 'Strong', 'Complicated'],
          correct: 1,
        },
        {
          id: 4,
          type: 'meaning',
          question: 'What is the meaning of "Vivacious"?',
          options: [
            'Sleepy and tired',
            'Lively, animated, and full of energy',
            'Calm and peaceful',
            'Angry and upset',
          ],
          correct: 1,
        },
        {
          id: 5,
          type: 'meaning',
          question: 'What does "Placid" mean?',
          options: [
            'Rough and turbulent',
            'Hot and sunny',
            'Calm and peaceful',
            'Loud and noisy',
          ],
          correct: 2,
        },
        {
          id: 6,
          type: 'context',
          question: 'Fill in: "Her _____ personality made her popular."',
          options: ['Bitter', 'Vivacious', 'Dull', 'Angry'],
          correct: 1,
        },
        {
          id: 7,
          type: 'meaning',
          question: 'What is "Benevolent"?',
          options: ['Mean and cruel', 'Kind and generous', 'Lazy', 'Confused'],
          correct: 1,
        },
        {
          id: 8,
          type: 'synonym',
          question: 'Choose the synonym for "Candid":',
          options: ['Dishonest', 'Quiet', 'Honest and frank', 'Angry'],
          correct: 2,
        },
        {
          id: 9,
          type: 'context',
          question: 'The _____ beauty of the sunset took our breath away.',
          options: ['Ugly', 'Ephemeral', 'Permanent', 'Boring'],
          correct: 1,
        },
        {
          id: 10,
          type: 'meaning',
          question: 'What does "Diligent" mean?',
          options: [
            'Lazy and careless',
            'Hardworking and careful',
            'Angry and upset',
            'Happy and cheerful',
          ],
          correct: 1,
        },
        {
          id: 11,
          type: 'synonym',
          question: 'Choose the synonym for "Melancholy":',
          options: ['Happy', 'Sad and pensive', 'Angry', 'Excited'],
          correct: 1,
        },
        {
          id: 12,
          type: 'meaning',
          question: 'What is a "Fortuitous" event?',
          options: [
            'A planned and expected event',
            'A sad event',
            'An accidental and lucky event',
            'A boring event',
          ],
          correct: 2,
        },
        {
          id: 13,
          type: 'context',
          question: 'His _____ manner made him an excellent speaker.',
          options: ['Rude', 'Eloquent', 'Boring', 'Angry'],
          correct: 1,
        },
        {
          id: 14,
          type: 'meaning',
          question: 'What does "Prudent" mean?',
          options: [
            'Reckless and careless',
            'Wise and careful',
            'Happy and cheerful',
            'Sad and lonely',
          ],
          correct: 1,
        },
        {
          id: 15,
          type: 'meaning',
          question: 'What is the meaning of "Astute"?',
          options: [
            'Slow and dull',
            'Clever and perceptive',
            'Angry and aggressive',
            'Sad and lonely',
          ],
          correct: 1,
        },
        {
          id: 16,
          type: 'synonym',
          question: 'Choose the synonym for "Gregarious":',
          options: ['Lonely', 'Sociable', 'Angry', 'Tired'],
          correct: 1,
        },
        {
          id: 17,
          type: 'context',
          question:
            'The _____ atmosphere of the library was perfect for studying.',
          options: ['Noisy', 'Placid', 'Chaotic', 'Busy'],
          correct: 1,
        },
        {
          id: 18,
          type: 'meaning',
          question: 'What does "Ubiquitous" mean?',
          options: [
            'Present everywhere at once',
            'Rare and uncommon',
            'Hidden and secret',
            'Angry and upset',
          ],
          correct: 0,
        },
        {
          id: 19,
          type: 'synonym',
          question: 'Choose the synonym for "Perspicacious":',
          options: ['Ignorant', 'Kind', 'Astute', 'Lazy'],
          correct: 2,
        },
        {
          id: 20,
          type: 'meaning',
          question: 'What is "Ineluctable"?',
          options: [
            'Easily avoided',
            'Impossible to avoid',
            'Happy and cheerful',
            'Sad and lonely',
          ],
          correct: 1,
        },
      ],
    };
    return questionsByChapter[chapter] || [];
  };

  const handleAnswer = (optionIndex) => {
    if (answered) return;
    setSelectedOption(optionIndex);
    setAnswered(true);
    if (optionIndex === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      const percentage = (score / questions.length) * 100;
      const passed = percentage >= 80;

      addQuizResult(chapterId, score);

      try {
        const { error } = await supabase.from('quiz_results').insert({
          userId: user.id,
          chapterId,
          score,
          passed,
        });
        if (error && error.code !== '23505') {
          console.error('Error saving quiz result:', error);
        }
        if (passed) {
          await supabase
            .from('users')
            .update({ currentChapter: chapterId + 1 })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error('Error:', error);
      }

      navigation.replace('QuizResult', {
        score,
        total: questions.length,
        percentage,
        passed,
        chapterId,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Preparing quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No questions available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getOptionStyle = (index) => {
    if (!answered) {
      return selectedOption === index ? styles.optionSelected : styles.option;
    }
    if (index === question.correct) return styles.optionCorrect;
    if (selectedOption === index && index !== question.correct)
      return styles.optionIncorrect;
    return styles.option;
  };

  const getOptionTextStyle = (index) => {
    if (!answered) {
      return selectedOption === index
        ? styles.optionTextSelected
        : styles.optionText;
    }
    if (index === question.correct) return styles.optionTextCorrect;
    if (selectedOption === index && index !== question.correct)
      return styles.optionTextIncorrect;
    return styles.optionText;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chapter {chapterId} Quiz</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                Question {currentQuestion + 1} of {questions.length}
              </Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{question.type}</Text>
          </View>
          <Text style={styles.question}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getOptionStyle(index)}
                onPress={() => handleAnswer(index)}
                disabled={answered}
                activeOpacity={0.8}
              >
                <View style={styles.optionRow}>
                  <View
                    style={[
                      styles.optionLetter,
                      answered &&
                        index === question.correct &&
                        styles.optionLetterCorrect,
                      answered &&
                        selectedOption === index &&
                        index !== question.correct &&
                        styles.optionLetterIncorrect,
                      !answered &&
                        selectedOption === index &&
                        styles.optionLetterSelected,
                    ]}
                  >
                    <Text style={styles.optionLetterText}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={getOptionTextStyle(index)}>{option}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {answered && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === questions.length - 1
                ? 'See Results'
                : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  progressContainer: {
    gap: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
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
    color: '#4F46E5',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
    textTransform: 'capitalize',
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
  },
  optionSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetterSelected: {
    backgroundColor: '#4F46E5',
  },
  optionLetterCorrect: {
    backgroundColor: '#10B981',
  },
  optionLetterIncorrect: {
    backgroundColor: '#EF4444',
  },
  optionLetterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    fontSize: 15,
    color: '#4F46E5',
    flex: 1,
    fontWeight: '600',
    lineHeight: 22,
  },
  optionTextCorrect: {
    fontSize: 15,
    color: '#059669',
    flex: 1,
    fontWeight: '600',
    lineHeight: 22,
  },
  optionTextIncorrect: {
    fontSize: 15,
    color: '#DC2626',
    flex: 1,
    fontWeight: '600',
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: '#4F46E5',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default QuizScreen;