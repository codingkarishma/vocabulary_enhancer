import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
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
      console.error('Error:', error);
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
      message: 'Great job! Your sentence is correct.',
    };
  };

  const handleSubmit = () => {
    const validation = validateSentence();
    setFeedback(validation);
    setAnswered(true);
  };

  const handleContinue = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSentence('');
      setFeedback(null);
      setAnswered(false);
    } else {
      Alert.alert(
        'Complete!',
        "You've practiced all words with sentences. Ready for the quiz?",
        [
          {
            text: 'Take Quiz',
            onPress: () => navigation.navigate('Quiz', { chapterId }),
          },
          { text: 'Back to Home', onPress: () => navigation.replace('Home') },
        ],
      );
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
        <Text>No words found.</Text>
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
        <Text style={styles.title}>Sentence Practice</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentWordIndex + 1} of {words.length}
        </Text>
      </View>

      <View style={styles.practiceCard}>
        <Text style={styles.instruction}>Create a sentence using:</Text>
        <Text style={styles.word}>{currentWord.word}</Text>

        <TextInput
          style={styles.input}
          placeholder="Type your sentence here..."
          value={sentence}
          onChangeText={setSentence}
          editable={!answered}
          multiline
          placeholderTextColor="#ccc"
        />

        {!answered ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={!sentence.trim()}
          >
            <Text style={styles.buttonText}>Check Sentence</Text>
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
              <Text style={styles.feedbackIcon}>
                {feedback.valid ? '✓' : '✗'}
              </Text>
              <Text style={styles.feedbackMessage}>{feedback.message}</Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>
                {currentWordIndex === words.length - 1
                  ? 'Finish Practice'
                  : 'Next Word'}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: '#FF9500',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  practiceCard: {
    backgroundColor: '#fff9e6',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedbackBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: '#d1f4d1',
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  feedbackIncorrect: {
    backgroundColor: '#ffd1d1',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  feedbackIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  feedbackMessage: {
    fontSize: 14,
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SentencePracticeScreen;
