import { create } from 'zustand';

export const useLearningStore = create((set) => ({
  userLevel: null,
  currentChapter: 1,
  currentWord: null,
  learnedWords: [],
  streak: 0,
  todayWordsCompleted: 0,
  assessmentScore: null,
  quizResults: {},

  setUserLevel: (level) => set({ userLevel: level }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setCurrentWord: (word) => set({ currentWord: word }),
  addLearnedWord: (wordId) =>
    set((state) => ({
      learnedWords: [...state.learnedWords, wordId],
      todayWordsCompleted: state.todayWordsCompleted + 1,
    })),
  setStreak: (streak) => set({ streak }),
  setAssessmentScore: (score) => set({ assessmentScore: score }),
  addQuizResult: (chapterId, score) =>
    set((state) => ({
      quizResults: {
        ...state.quizResults,
        [chapterId]: score,
      },
    })),
  resetLearning: () =>
    set({
      userLevel: null,
      currentChapter: 1,
      currentWord: null,
      learnedWords: [],
      streak: 0,
      todayWordsCompleted: 0,
      assessmentScore: null,
      quizResults: {},
    }),
}));
