import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/authStore';
import { useLearningStore } from '../store/learningStore';

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'What is the meaning of "Eloquent"?',
    type: 'meaning',
    options: [
      'Able to speak or write fluently and persuasively',
      'Quiet and reserved',
      'Rude and disrespectful',
      'Confused and unclear',
    ],
    correct: 0,
  },
  {
    id: 2,
    question: 'Choose the synonym for "Prudent":',
    type: 'synonym',
    options: ['Reckless', 'Wise and careful', 'Loud', 'Slow'],
    correct: 1,
  },
  {
    id: 3,
    question: 'What is the meaning of "Ephemeral"?',
    type: 'meaning',
    options: ['Lasting for a very short time', 'Permanent', 'Bitter', 'Cold'],
    correct: 0,
  },
  {
    id: 4,
    question: 'Choose the synonym for "Vivacious":',
    type: 'synonym',
    options: ['Sad', 'Lively and animated', 'Slow', 'Angry'],
    correct: 1,
  },
  {
    id: 5,
    question: 'The word "sanguine" most nearly means:',
    type: 'meaning',
    options: [
      'Fearful and worried',
      'Optimistic and confident',
      'Angry and aggressive',
      'Tired and lazy',
    ],
    correct: 1,
  },
  {
    id: 6,
    question:
      'Fill in the blank: "The athlete\'s _____ performance impressed everyone."',
    type: 'context',
    options: ['Aberrant', 'Lucid', 'Exemplary', 'Tedious'],
    correct: 2,
  },
  {
    id: 7,
    question: 'What is the meaning of "Placid"?',
    type: 'meaning',
    options: ['Angry', 'Calm and peaceful', 'Energetic', 'Confused'],
    correct: 1,
  },
  {
    id: 8,
    question: 'Choose the synonym for "Benevolent":',
    type: 'synonym',
    options: ['Mean', 'Kind and generous', 'Lazy', 'Noisy'],
    correct: 1,
  },
  {
    id: 9,
    question:
      "The student's _____ attitude made it hard for him to make friends.",
    type: 'context',
    options: ['Affable', 'Gregarious', 'Aloof', 'Cordial'],
    correct: 2,
  },
  {
    id: 10,
    question: 'What is the meaning of "Candid"?',
    type: 'meaning',
    options: ['Shy', 'Honest and frank', 'Dishonest', 'Quiet'],
    correct: 1,
  },
  {
    id: 11,
    question: 'Choose the synonym for "Diligent":',
    type: 'synonym',
    options: ['Lazy', 'Careless', 'Hardworking and careful', 'Fast'],
    correct: 2,
  },
  {
    id: 12,
    question: "The politician's _____ speech failed to convince the audience.",
    type: 'context',
    options: ['Persuasive', 'Banal', 'Inspiring', 'Compelling'],
    correct: 1,
  },
  {
    id: 13,
    question: 'What is the meaning of "Melancholy"?',
    type: 'meaning',
    options: ['Happy', 'Sad and pensive', 'Angry', 'Excited'],
    correct: 1,
  },
  {
    id: 14,
    question: 'Choose the synonym for "Fortuitous":',
    type: 'synonym',
    options: ['Planned', 'Accidental and lucky', 'Deliberate', 'Unfortunate'],
    correct: 1,
  },
  {
    id: 15,
    question: 'His _____ behavior earned him respect from his colleagues.',
    type: 'context',
    options: ['Belligerent', 'Professional', 'Vindictive', 'Erratic'],
    correct: 1,
  },
];

const AssessmentScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { user } = useAuthStore();
  const { setAssessmentScore, setUserLevel } = useLearningStore();

  const handleAnswer = (optionIndex) => {
    if (answered) return;
    setSelectedOption(optionIndex);
    setAnswered(true);

    if (optionIndex === ASSESSMENT_QUESTIONS[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      const percentage = (score / ASSESSMENT_QUESTIONS.length) * 100;
      let level = 'Beginner';
      if (percentage >= 80) level = 'Advanced';
      else if (percentage >= 60) level = 'Intermediate';

      setAssessmentScore(score);
      setUserLevel(level);

      try {
        const { error } = await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          level,
          streak: 0,
          currentChapter: 1,
        });
        if (error) console.error('Error saving assessment:', error);
      } catch (error) {
        console.error('Error:', error);
      }

      navigation.replace('AssessmentResult', {
        score,
        total: ASSESSMENT_QUESTIONS.length,
        percentage,
        level,
      });
    }
  };

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

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
          <Text style={styles.headerTitle}>Vocabulary Assessment</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
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
              {currentQuestion === ASSESSMENT_QUESTIONS.length - 1
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
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
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

export default AssessmentScreen;