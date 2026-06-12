// Quiz state for the interactive learning feature, persisted on-device.
// Separate from useCollection so it merges cleanly and stays self-contained.
//
// Backend team: replace the local `sessions` map + createQuiz/hostQuiz with real
// API calls. The screens only depend on the action names below, so the UI can stay.
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AGRI_QUIZZES, genPin, makeQuizCode } from '../data/quizzes'

function normalize(value) {
  return String(value || '').trim().toUpperCase()
}

export const useQuiz = create(
  persist(
    (set, get) => ({
      quizzes: AGRI_QUIZZES,
      sessions: {}, // pin -> { quizId, hostedAt }

      // Create a quiz from a teacher draft. Returns the saved quiz.
      createQuiz: (draft) => {
        const cleanQuestions = (draft.questions || [])
          .map((question) => ({
            id: question.id || `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            q: String(question.q || '').trim(),
            choices: (question.choices || []).map((c) => String(c || '').trim()).filter(Boolean),
            answer: Number(question.answer) || 0,
            seconds: Number(question.seconds) || 20,
          }))
          .filter((question) => question.q && question.choices.length >= 2)

        const quiz = {
          id: `quiz-${Date.now()}`,
          code: makeQuizCode(),
          title: String(draft.title || '').trim() || 'Untitled quiz',
          topic: String(draft.topic || '').trim() || 'Custom',
          emoji: draft.emoji || '📝',
          accent: draft.accent || '#4ADE80',
          description: String(draft.description || '').trim() || 'Teacher-created quiz.',
          custom: true,
          questions: cleanQuestions.length
            ? cleanQuestions.map((question) => ({
                ...question,
                answer: Math.min(question.answer, question.choices.length - 1),
              }))
            : [],
        }

        set((s) => ({ quizzes: [quiz, ...s.quizzes] }))
        return quiz
      },

      deleteQuiz: (id) =>
        set((s) => ({ quizzes: s.quizzes.filter((q) => q.id !== id) })),

      // Open a live game session for a quiz. Returns { pin, quiz }.
      hostQuiz: (quizId) => {
        const quiz = get().quizzes.find((q) => q.id === quizId)
        if (!quiz) return null
        const pin = genPin()
        set((s) => ({ sessions: { ...s.sessions, [pin]: { quizId, hostedAt: Date.now() } } }))
        return { pin, quiz }
      },

      // Look up a quiz by its printed code OR by an active session PIN.
      // This lets a guest join with whatever the teacher shared.
      findQuiz: (input) => {
        const key = normalize(input)
        if (!key) return null
        const byCode = get().quizzes.find((q) => normalize(q.code) === key)
        if (byCode) return byCode
        const session = get().sessions[key] || get().sessions[String(input).trim()]
        if (session) return get().quizzes.find((q) => q.id === session.quizId) || null
        return null
      },

      resetQuizzes: () => set({ quizzes: AGRI_QUIZZES, sessions: {} }),
    }),
    {
      name: 'plantdex-quizzes',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Always refresh the built-in agri quizzes on load, keep custom ones.
      merge: (persisted, current) => {
        const saved = persisted || {}
        const customQuizzes = (saved.quizzes || []).filter((q) => q.custom)
        return {
          ...current,
          ...saved,
          quizzes: [...customQuizzes, ...AGRI_QUIZZES],
          sessions: saved.sessions || {},
        }
      },
    }
  )
)
