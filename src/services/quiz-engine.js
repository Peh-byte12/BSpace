import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from "../data/quiz.js";
import { readJsonStorage, writeJsonStorage } from "../utils/storage.js";
import { getAchievementSummaries, evaluateAchievements } from "./achievements-engine.js";
import { applyXp, calculateAnswerXp, getLevelForXp, getLevelProgress } from "./xp-engine.js";

const STORAGE_KEY = "bspaceQuizGamification";
const HISTORY_LIMIT = 12;

const DEFAULT_STATE = {
    xp: 0,
    level: 1,
    totalAnswers: 0,
    correctAnswers: 0,
    combo: 0,
    bestCombo: 0,
    categories: {},
    questionMastery: {},
    achievements: [],
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
    const alreadyMastered = Boolean(mastery.correct);
    const nextCombo = isCorrect ? previousState.combo + 1 : 0;
    const xpBreakdown = calculateAnswerXp({ isCorrect, combo: nextCombo, alreadyMastered });
    let nextState = {
        ...previousState,
        totalAnswers: previousState.totalAnswers + 1,
        correctAnswers: previousState.correctAnswers + (isCorrect ? 1 : 0),
        combo: nextCombo,
        bestCombo: Math.max(previousState.bestCombo, nextCombo),
        categories: { ...previousState.categories },
        questionMastery: { ...previousState.questionMastery },
        history: [...previousState.history],
        achievements: [...previousState.achievements]
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
        createHistoryItem({ question, selectedIndex, isCorrect, xp: xpBreakdown.totalXp, combo: nextCombo }),
        ...nextState.history
    ].slice(0, HISTORY_LIMIT);

    nextState = applyXp(nextState, xpBreakdown.totalXp);

    const unlockedAchievements = evaluateAchievements({
        state: nextState,
        previousAchievementIds: previousState.achievements,
        questions,
        categories
    });
    const achievementBonus = unlockedAchievements.reduce((total, achievement) => total + achievement.xpBonus, 0);

    if (unlockedAchievements.length > 0) {
        nextState.achievements = [
            ...new Set([
                ...nextState.achievements,
                ...unlockedAchievements.map((achievement) => achievement.id)
            ])
        ];
        nextState = applyXp(nextState, achievementBonus);
    }

    xpBreakdown.achievementBonus = achievementBonus;
    xpBreakdown.totalXp += achievementBonus;

    if (achievementBonus > 0 && nextState.history[0]) {
        nextState.history[0] = {
            ...nextState.history[0],
            xp: xpBreakdown.totalXp,
            achievementBonus
        };
    }

    saveQuizState(nextState);

    return {
        isCorrect,
        selectedIndex,
        correctIndex: question.correta,
        question,
        xp: xpBreakdown,
        unlockedAchievements,
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
    return normalizeState(readJsonStorage(STORAGE_KEY, DEFAULT_STATE));
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
        levelProgress: getLevelProgress(normalizedState.xp),
        questionProgress: totalQuestions > 0 ? masteredQuestionIds.length / totalQuestions : 0,
        masteredQuestions: masteredQuestionIds.length,
        totalQuestions,
        categories: getCategorySummaries({ state: normalizedState, questions, categories }),
        achievements: getAchievementSummaries({ state: normalizedState, questions, categories }),
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

function createHistoryItem({ question, selectedIndex, isCorrect, xp, combo }) {
    return {
        questionId: question.id,
        pergunta: question.pergunta,
        categoria: question.categoria,
        selectedIndex,
        isCorrect,
        xp,
        combo,
        answeredAt: new Date().toISOString()
    };
}

function normalizeState(value) {
    const state = value && typeof value === "object" ? value : DEFAULT_STATE;
    const xp = readPositiveNumber(state.xp);

    return {
        xp,
        level: getLevelForXp(xp).level,
        totalAnswers: readPositiveNumber(state.totalAnswers),
        correctAnswers: readPositiveNumber(state.correctAnswers),
        combo: readPositiveNumber(state.combo),
        bestCombo: readPositiveNumber(state.bestCombo),
        categories: normalizeCategories(state.categories),
        questionMastery: normalizeQuestionMastery(state.questionMastery),
        achievements: Array.isArray(state.achievements) ? state.achievements.filter(Boolean) : [],
        history: Array.isArray(state.history) ? state.history.slice(0, HISTORY_LIMIT) : []
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
                    answers: readPositiveNumber(stats?.answers),
                    correct: readPositiveNumber(stats?.correct),
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
                    attempts: readPositiveNumber(mastery?.attempts),
                    correct: Boolean(mastery?.correct),
                    lastAnsweredAt: mastery?.lastAnsweredAt || ""
                }
            ];
        })
    );
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

function readPositiveNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
}
