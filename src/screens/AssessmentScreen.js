import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

  const handleAnswer = async (optionIndex) => {
    setSelectedOption(optionIndex);
    setAnswered(true);

    if (optionIndex === ASSESSMENT_QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      // Assessment complete
      const percentage = (score / ASSESSMENT_QUESTIONS.length) * 100;
      let level = 'Beginner';
      if (percentage >= 80) {
        level = 'Advanced';
      } else if (percentage >= 60) {
        level = 'Intermediate';
      }

      setAssessmentScore(score);
      setUserLevel(level);

      // Save to database
      try {
        const { error } = await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          level,
          streak: 0,
          currentChapter: 1,
        });

        if (error) {
          console.error('Error saving assessment:', error);
        }
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary Assessment</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
        <Text style={styles.type}>{question.type}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedOption === index && styles.optionSelected,
                answered && index === question.correct && styles.optionCorrect,
                answered &&
                  selectedOption === index &&
                  index !== question.correct &&
                  styles.optionIncorrect,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={answered}
            >
              <Text
                style={[
                  styles.optionText,
                  (selectedOption === index || index === question.correct) &&
                    styles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {answered && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQuestion === ASSESSMENT_QUESTIONS.length - 1
              ? 'See Results'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  questionContainer: {
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  type: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  optionSelected: {
    borderColor: '#007AFF',
  },
  optionCorrect: {
    borderColor: '#34C759',
    backgroundColor: '#d1f4d1',
  },
  optionIncorrect: {
    borderColor: '#FF3B30',
    backgroundColor: '#ffd1d1',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextActive: {
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AssessmentScreen;
