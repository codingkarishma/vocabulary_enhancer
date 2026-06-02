import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const AssessmentResultScreen = ({ navigation, route }) => {
  const { score, total, percentage, level } = route.params;

  const getDescription = () => {
    if (level === 'Advanced') {
      return "Outstanding! You have strong vocabulary knowledge. You'll unlock advanced chapters!";
    } else if (level === 'Intermediate') {
      return "Good job! You have solid vocabulary. Let's continue building your knowledge.";
    }
    return "Great start! You're beginning your vocabulary journey. Let's build from here!";
  };

  const getLevelIcon = () => {
    if (level === 'Advanced') return '🚀';
    if (level === 'Intermediate') return '📈';
    return '🌱';
  };

  const getLevelColor = () => {
    if (level === 'Advanced') return '#7C3AED';
    if (level === 'Intermediate') return '#4F46E5';
    return '#10B981';
  };

  const color = getLevelColor();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.card, { borderColor: `${color}20` }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
            <Text style={styles.icon}>{getLevelIcon()}</Text>
          </View>
          <Text style={[styles.level, { color }]}>{level}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.scoreDivider}>/</Text>
            <Text style={styles.scoreTotal}>{total}</Text>
          </View>
          <Text style={[styles.percentage, { color }]}>
            {percentage.toFixed(0)}%
          </Text>
          <Text style={styles.description}>{getDescription()}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🎯 Your Learning Path</Text>
          <View style={styles.infoItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoText}>
              Chapter 1: Everyday Vocabulary unlocked
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoText}>
              Learn 5 words daily to build your streak
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoText}>
              Pass chapter quizzes (80%+) to unlock next levels
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: color }]}
          onPress={() => navigation.replace('Home')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Start Learning →</Text>
        </TouchableOpacity>
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
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
  },
  level: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  score: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreDivider: {
    fontSize: 24,
    fontWeight: '600',
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  scoreTotal: {
    fontSize: 24,
    fontWeight: '600',
    color: '#94A3B8',
  },
  percentage: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#4F46E5',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    flex: 1,
  },
  button: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AssessmentResultScreen;