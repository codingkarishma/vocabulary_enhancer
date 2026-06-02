import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizResultScreen = ({ navigation, route }) => {
  const { score, total, percentage, passed, chapterId } = route.params;

  const getResultMessage = () => {
    if (percentage === 100) {
      return "🌟 Perfect Score! You're a vocabulary master!";
    } else if (percentage >= 90) {
      return '🎉 Excellent! Outstanding performance!';
    } else if (percentage >= 80) {
      return '✅ Congratulations! You passed the quiz!';
    } else if (percentage >= 70) {
      return "📚 Good effort! Let's practice more.";
    } else {
      return "💪 Keep practicing! You'll improve.";
    }
  };

  const getResultColor = () => {
    if (passed) return '#34C759';
    return '#FF9500';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderLeftColor: getResultColor() }]}>
        <Text style={styles.status}>
          {passed ? 'PASSED ✓' : 'REVISION NEEDED'}
        </Text>
        <Text style={styles.score}>
          {score}/{total}
        </Text>
        <Text style={[styles.percentage, { color: getResultColor() }]}>
          {percentage.toFixed(0)}%
        </Text>
        <Text style={styles.message}>{getResultMessage()}</Text>
      </View>

      {!passed ? (
        <View style={styles.revisionBox}>
          <Text style={styles.revisionTitle}>📝 Revision Needed</Text>
          <Text style={styles.revisionText}>
            You need 80% to pass. Review the words and try the quiz again!
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('WordLearning', { chapterId })}
            >
              <Text style={styles.buttonText}>Review Words</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Quiz', { chapterId })}
            >
              <Text style={styles.secondaryButtonText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>🎊 Chapter Complete!</Text>
          <Text style={styles.successText}>
            You've successfully completed Chapter {chapterId}. Great job! The
            next chapter is now unlocked.
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.replace('Home')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                navigation.navigate('WordLearning', {
                  chapterId: chapterId + 1,
                })
              }
            >
              <Text style={styles.secondaryButtonText}>Next Chapter →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
    letterSpacing: 1,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  revisionBox: {
    backgroundColor: '#fff9e6',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    marginBottom: 20,
  },
  revisionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  revisionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  successBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default QuizResultScreen;
