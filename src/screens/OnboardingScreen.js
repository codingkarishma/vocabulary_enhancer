import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: '📚',
    title: 'Expand Your Vocabulary',
    description:
      'Master words that matter. From everyday conversations to professional interviews, build confidence with every word you learn.',
    color: '#4F46E5',
  },
  {
    id: '2',
    icon: '🎯',
    title: 'Personalized Learning Path',
    description:
      'Start with a quick assessment to unlock your level. We curate chapters and quizzes tailored exactly to your progress.',
    color: '#7C3AED',
  },
  {
    id: '3',
    icon: '🔥',
    title: 'Build Streaks & Milestones',
    description:
      'Learn daily to keep your streak alive. Unlock milestones from Seed 🌱 to Champion 🏆 as you grow.',
    color: '#EC4899',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const skip = () => {
    navigation.replace('Login');
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#CBD5E1', SLIDES[i].color, '#CBD5E1'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[styles.dot, { width: dotWidth, opacity, backgroundColor }]}
              key={i}
            />
          );
        })}
      </View>
    );
  };

  const renderSlide = ({ item }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={skip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEventThrottle={32}
      />

      <View style={styles.bottomContainer}>
        <Paginator />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: SLIDES[currentIndex].color }]}
          onPress={scrollTo}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  paginatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    height: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OnboardingScreen;