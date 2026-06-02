import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const QuizResultScreen = ({ navigation, route }) => {
  const { score, total, percentage, passed, chapterId } = route.params;

  const getResultMessage = () => {
    if (percentage === 100) return "🌟 Perfect! You're a vocabulary master!";
    if (percentage >= 90) return '🎉 Excellent! Outstanding performance!';
    if (percentage >= 80) return '✅ Great job! You passed the quiz!';
    if (percentage >= 70) return "📚 Good effort! Let's practice more.";
    return "💪 Keep practicing! You'll improve with review.";
  };

  const getResultColor = () => (passed ? '#10B981' : '#F59E0B');
  const color = getResultColor();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.card, { borderColor: `${color}25` }]}>
          <View style={[styles.statusBadge, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.statusText, { color }]}>
              {passed ? 'PASSED' : 'REVISION NEEDED'}
            </Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.scoreDivider}>/</Text>
            <Text style={styles.scoreTotal}>{total}</Text>
          </View>

          <Text style={[styles.percentage, { color }]}>
            {percentage.toFixed(0)}%
          </Text>
          <Text style={styles.message}>{getResultMessage()}</Text>
        </View>

        {!passed ? (
          <View style={[styles.feedbackBox, styles.revisionBox]}>
            <Text style={[styles.feedbackTitle, { color: '#B45309' }]}>
              📝 Review & Retry
            </Text>
            <Text style={styles.feedbackText}>
              You need 80% to pass this chapter. Review the words and try again!
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#4F46E5' }]}
                onPress={() =>
                  navigation.navigate('WordLearning', { chapterId })
                }
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Review Words</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: '#4F46E5' }]}
                onPress={() => navigation.navigate('Quiz', { chapterId })}
                activeOpacity={0.85}
              >
                <Text style={[styles.secondaryButtonText, { color: '#4F46E5' }]}>
                  Retake Quiz
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.feedbackBox, styles.successBox]}>
            <Text style={[styles.feedbackTitle, { color: '#059669' }]}>
              🎊 Chapter Complete!
            </Text>
            <Text style={styles.feedbackText}>
              You've successfully completed Chapter {chapterId}. The next
              chapter is now unlocked!
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#4F46E5' }]}
                onPress={() => navigation.replace('Home')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Back to Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: '#4F46E5' }]}
                onPress={() =>
                  navigation.navigate('WordLearning', {
                    chapterId: chapterId + 1,
                  })
                }
                activeOpacity={0.85}
              >
                <Text style={[styles.secondaryButtonText, { color: '#4F46E5' }]}>
                  Next Chapter →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  score: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreDivider: {
    fontSize: 28,
    fontWeight: '600',
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  scoreTotal: {
    fontSize: 28,
    fontWeight: '600',
    color: '#94A3B8',
  },
  percentage: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  feedbackBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  revisionBox: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  successBox: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default QuizResultScreen;