import { applyAnswer, createEmptyScores } from "./engine.js";

const STORAGE_KEY = "maobti.session";
const LAST_RESULT_KEY = "maobti.lastResult";
const COLLECTION_KEY = "maobti.collection";

export function createInitialState() {
  return {
    currentQuestionIndex: 0,
    answers: {},
    scores: createEmptyScores()
  };
}

export function createEmptyCollection() {
  return {
    unlockedResultIds: []
  };
}

function getQuestionById(questions, questionId) {
  return questions.find((item) => item.id === questionId);
}

export function answerQuestion(state, questions, questionId, optionKey) {
  const question = getQuestionById(questions, questionId);
  const nextScores = applyAnswer(state.scores, {
    dimension: question.dimension,
    optionKey,
    scoreMap: question.scoreMap
  });

  return {
    currentQuestionIndex: state.currentQuestionIndex + 1,
    answers: { ...state.answers, [questionId]: optionKey },
    scores: nextScores
  };
}

export function goBackOneQuestion(state, questions) {
  const previousIndex = Math.max(0, state.currentQuestionIndex - 1);
  const previousQuestion = questions[previousIndex];

  if (!previousQuestion) {
    return { ...state, currentQuestionIndex: previousIndex };
  }

  const previousOptionKey = state.answers[previousQuestion.id];
  if (!previousOptionKey) {
    return { ...state, currentQuestionIndex: previousIndex };
  }

  const revertedScores = {
    ...state.scores,
    [previousQuestion.dimension]:
      state.scores[previousQuestion.dimension] -
      previousQuestion.scoreMap[previousOptionKey]
  };

  const nextAnswers = { ...state.answers };
  delete nextAnswers[previousQuestion.id];

  return {
    currentQuestionIndex: previousIndex,
    answers: nextAnswers,
    scores: revertedScores
  };
}

export function saveSession(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadSession(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function clearSession(storage) {
  storage.removeItem(STORAGE_KEY);
}

export function loadCollection(storage) {
  try {
    const raw = storage.getItem(COLLECTION_KEY);
    if (!raw) {
      return createEmptyCollection();
    }

    const parsed = JSON.parse(raw);
    const unlockedResultIds = Array.isArray(parsed?.unlockedResultIds)
      ? parsed.unlockedResultIds.filter((value) => typeof value === "string")
      : [];

    return {
      unlockedResultIds: [...new Set(unlockedResultIds)]
    };
  } catch {
    return createEmptyCollection();
  }
}

export function saveCollection(storage, collection) {
  try {
    storage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch {
    // Ignore storage failures and keep the core flow usable.
  }
}

export function unlockResult(collection, resultId) {
  if (
    !resultId ||
    collection.unlockedResultIds.includes(resultId)
  ) {
    return collection;
  }

  return {
    unlockedResultIds: [...collection.unlockedResultIds, resultId]
  };
}

export function saveLastResult(storage, resultPayload) {
  try {
    storage.setItem(LAST_RESULT_KEY, JSON.stringify(resultPayload));
  } catch {
    // Ignore storage failures and keep the core flow usable.
  }
}

export function loadLastResult(storage) {
  try {
    const raw = storage.getItem(LAST_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
