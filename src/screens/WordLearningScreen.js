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

const WordLearningScreen = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const { user } = useAuthStore();
  const { addLearnedWord, learnedWords } = useLearningStore();
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
        console.error('Error fetching words:', error);
        // Use sample data if database is not ready
        const sampleWords = getSampleWords(chapterId);
        setWords(sampleWords);
      } else {
        setWords(data || getSampleWords(chapterId));
      }
    } catch (error) {
      console.error('Error:', error);
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
      // Save to database
      await supabase.from('user_words').upsert({
        userId: user.id,
        wordId: word.id,
        learned: true,
      });

      addLearnedWord(word.id);
      setLearnedToday(learnedToday + 1);

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        // All words learned today
        Alert.alert(
          'Great!',
          `You've learned ${learnedToday + 1} words today. Practice these in sentences now!`,
          [
            {
              text: 'Practice Sentences',
              onPress: () =>
                navigation.navigate('SentencePractice', { chapterId }),
            },
            { text: 'Back to Home', onPress: () => navigation.replace('Home') },
          ],
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading words...</Text>
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No words found for this chapter.</Text>
      </View>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chapter {chapterId}: Daily Learning</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentWordIndex + 1} of {words.length}
        </Text>
      </View>

      <View style={styles.wordCard}>
        <Text style={styles.word}>{currentWord.word}</Text>

        <View style={styles.meaningSection}>
          <Text style={styles.label}>Meaning</Text>
          <Text style={styles.meaning}>{currentWord.meaning}</Text>
        </View>

        <View style={styles.exampleSection}>
          <Text style={styles.label}>Example</Text>
          <Text style={styles.example}>"{currentWord.example}"</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleMarkLearned}>
          <Text style={styles.buttonText}>Mark as Learned ✓</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 30,
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
    backgroundColor: '#34C759',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  wordCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  meaningSection: {
    marginBottom: 20,
  },
  meaning: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  exampleSection: {
    marginBottom: 30,
  },
  example: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WordLearningScreen;
