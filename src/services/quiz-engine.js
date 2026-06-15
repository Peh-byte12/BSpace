import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from "../data/quiz.js";
import { readJsonStorage, writeJsonStorage } from "../utils/storage.js";

const STORAGE_KEY = "bspaceQuizProgress";
const LEGACY_STORAGE_KEY = "bspaceQuizGamification";
const HISTORY_LIMIT = 12;

const DEFAULT_STATE = {
    totalAnswers: 0,
    correctAnswers: 0,
    combo: 0,
    bestCombo: 0,
    categories: {},
    questionMastery: {},
    history: []
};

export function recordQuizAnswer({
    question,
    selectedIndex,
    questions = QUIZ_QUESTIONS,
    categories = QUIZ_CATEGORIES
}) {
    const previousState = getQuizState();
    const isCorrect = selectedIndex === question.correta;
    const mastery = previousState.questionMastery[question.id] || createQuestionMastery();
    const nextCombo = isCorrect ? previousState.combo + 1 : 0;
    const nextState = {
        ...previousState,
        totalAnswers: previousState.totalAnswers + 1,
        correctAnswers: previousState.correctAnswers + (isCorrect ? 1 : 0),
        combo: nextCombo,
        bestCombo: Math.max(previousState.bestCombo, nextCombo),
        categories: { ...previousState.categories },
        questionMastery: { ...previousState.questionMastery },
        history: [...previousState.history]
    };

    nextState.questionMastery[question.id] = {
        attempts: mastery.attempts + 1,
        correct: mastery.correct || isCorrect,
        lastAnsweredAt: new Date().toISOString()
    };
    nextState.categories[question.categoria] = updateCategoryStats(
        nextState.categories[question.categoria],
        question.id,
        isCorrect
    );
    nextState.history = [
        createHistoryItem({ question, selectedIndex, isCorrect, combo: nextCombo }),
        ...nextState.history
    ].slice(0, HISTORY_LIMIT);

    saveQuizState(nextState);

    return {
        isCorrect,
        selectedIndex,
        correctIndex: question.correta,
        question,
        state: nextState,
        snapshot: getQuizSnapshot({ state: nextState, questions, categories })
    };
}

export function getQuizSummary(questions = QUIZ_QUESTIONS, categories = QUIZ_CATEGORIES) {
    return getQuizSnapshot({
        state: getQuizState(),
        questions,
        categories
    });
}

export function getQuizState() {
    const storedState = readJsonStorage(STORAGE_KEY, null) || readJsonStorage(LEGACY_STORAGE_KEY, DEFAULT_STATE);
    return normalizeState(storedState);
}

function saveQuizState(state) {
    writeJsonStorage(STORAGE_KEY, normalizeState(state));
}

function getQuizSnapshot({ state, questions, categories }) {
    const normalizedState = normalizeState(state);
    const masteredQuestionIds = Object.entries(normalizedState.questionMastery)
        .filter(([, mastery]) => mastery.correct)
        .map(([questionId]) => questionId);
    const totalQuestions = questions.length;
    const accuracy = normalizedState.totalAnswers > 0
        ? Math.round((normalizedState.correctAnswers / normalizedState.totalAnswers) * 100)
        : 0;

    return {
        ...normalizedState,
        accuracy,
        questionProgress: totalQuestions > 0 ? masteredQuestionIds.length / totalQuestions : 0,
        masteredQuestions: masteredQuestionIds.length,
        totalQuestions,
        categories: getCategorySummaries({ state: normalizedState, questions, categories }),
        history: normalizedState.history
    };
}

function getCategorySummaries({ state, questions, categories }) {
    return categories.map((category) => {
        const total = questions.filter((question) => question.categoria === category.id).length;
        const stats = state.categories[category.id] || createCategoryStats();
        const mastered = stats.correctQuestionIds.filter((questionId) => {
            return questions.some((question) => question.id === questionId && question.categoria === category.id);
        }).length;

        return {
            ...category,
            total,
            answers: stats.answers,
            correct: stats.correct,
            mastered,
            progress: total > 0 ? mastered / total : 0
        };
    });
}

function updateCategoryStats(currentStats = createCategoryStats(), questionId, isCorrect) {
    const correctQuestionIds = new Set(currentStats.correctQuestionIds);

    if (isCorrect) {
        correctQuestionIds.add(questionId);
    }

    return {
        answers: currentStats.answers + 1,
        correct: currentStats.correct + (isCorrect ? 1 : 0),
        correctQuestionIds: [...correctQuestionIds]
    };
}

function createHistoryItem({ question, selectedIndex, isCorrect, combo }) {
    return {
        questionId: question.id,
        pergunta: question.pergunta,
        categoria: question.categoria,
        selectedIndex,
        isCorrect,
        combo,
        answeredAt: new Date().toISOString()
    };
}

function normalizeState(value) {
    const state = value && typeof value === "object" ? value : DEFAULT_STATE;

    return {
        totalAnswers: readNonNegativeNumber(state.totalAnswers),
        correctAnswers: readNonNegativeNumber(state.correctAnswers),
        combo: readNonNegativeNumber(state.combo),
        bestCombo: readNonNegativeNumber(state.bestCombo),
        categories: normalizeCategories(state.categories),
        questionMastery: normalizeQuestionMastery(state.questionMastery),
        history: normalizeHistory(state.history)
    };
}

function normalizeCategories(categories) {
    if (!categories || typeof categories !== "object") {
        return {};
    }

    return Object.fromEntries(
        Object.entries(categories).map(([categoryId, stats]) => {
            return [
                categoryId,
                {
                    answers: readNonNegativeNumber(stats?.answers),
                    correct: readNonNegativeNumber(stats?.correct),
                    correctQuestionIds: Array.isArray(stats?.correctQuestionIds)
                        ? [...new Set(stats.correctQuestionIds.filter(Boolean))]
                        : []
                }
            ];
        })
    );
}

function normalizeQuestionMastery(questionMastery) {
    if (!questionMastery || typeof questionMastery !== "object") {
        return {};
    }

    return Object.fromEntries(
        Object.entries(questionMastery).map(([questionId, mastery]) => {
            return [
                questionId,
                {
                    attempts: readNonNegativeNumber(mastery?.attempts),
                    correct: Boolean(mastery?.correct),
                    lastAnsweredAt: mastery?.lastAnsweredAt || ""
                }
            ];
        })
    );
}

function normalizeHistory(history) {
    if (!Array.isArray(history)) {
        return [];
    }

    return history.slice(0, HISTORY_LIMIT).map((item) => ({
        questionId: item.questionId || "",
        pergunta: item.pergunta || "",
        categoria: item.categoria || "",
        selectedIndex: readNonNegativeNumber(item.selectedIndex),
        isCorrect: Boolean(item.isCorrect),
        combo: readNonNegativeNumber(item.combo),
        answeredAt: item.answeredAt || ""
    }));
}

function createCategoryStats() {
    return {
        answers: 0,
        correct: 0,
        correctQuestionIds: []
    };
}

function createQuestionMastery() {
    return {
        attempts: 0,
        correct: false,
        lastAnsweredAt: ""
    };
}

function readNonNegativeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
}
