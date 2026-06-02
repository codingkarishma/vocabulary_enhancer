import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AssessmentResultScreen = ({ navigation, route }) => {
  const { score, total, percentage, level } = route.params;

  const getDescription = () => {
    if (level === 'Advanced') {
      return "Outstanding! You have strong vocabulary knowledge. You'll unlock advanced chapters!";
    } else if (level === 'Intermediate') {
      return "Good job! You have solid vocabulary. Let's continue building your knowledge.";
    } else {
      return "Great start! You're beginning your vocabulary journey. Let's build from here!";
    }
  };

  const getLevelIcon = () => {
    if (level === 'Advanced') return '🚀';
    if (level === 'Intermediate') return '📈';
    return '🌱';
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>{getLevelIcon()}</Text>
        <Text style={styles.level}>{level}</Text>
        <Text style={styles.score}>
          {score}/{total}
        </Text>
        <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
        <Text style={styles.description}>{getDescription()}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Your Learning Path</Text>
        <Text style={styles.infoText}>
          You've unlocked Chapter 1: Everyday Vocabulary
        </Text>
        <Text style={styles.infoText}>
          Start learning 5 words today and build your streak!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Home')}
      >
        <Text style={styles.buttonText}>Start Learning</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  icon: {
    fontSize: 60,
    marginBottom: 15,
  },
  level: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  button: {
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
});

export default AssessmentResultScreen;
