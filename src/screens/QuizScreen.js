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
      // For MVP, use generated questions
      const quizQuestions = generateQuizQuestions(chapterId);
      setQuestions(quizQuestions);
    } catch (error) {
      console.error('Error:', error);
      setQuestions(generateQuizQuestions(chapterId));
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
            'The occurrence of events by chance in a happy or beneficial way',
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
            'Fluent, persuasive, and expressive in speaking or writing',
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
    setSelectedOption(optionIndex);
    setAnswered(true);

    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      // Quiz complete
      const percentage = (score / questions.length) * 100;
      const passed = percentage >= 80;

      addQuizResult(chapterId, score);

      // Save to database
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

        // Update user progress
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
      <View style={styles.container}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No questions available.</Text>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chapter {chapterId} Quiz</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
        <Text style={styles.type}>Type: {question.type}</Text>

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
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
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
    backgroundColor: '#5856D6',
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
    color: '#5856D6',
    marginBottom: 20,
    textTransform: 'capitalize',
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
    borderColor: '#5856D6',
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
    backgroundColor: '#5856D6',
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

export default QuizScreen;
