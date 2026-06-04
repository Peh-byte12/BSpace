import { QUIZ_ACHIEVEMENTS } from "../data/quiz-achievements.js";

export function evaluateAchievements({ state, previousAchievementIds, questions, categories }) {
    const unlocked = new Set(previousAchievementIds);

    return QUIZ_ACHIEVEMENTS.filter((achievement) => {
        return !unlocked.has(achievement.id) && getAchievementValue(achievement.tipo, state, questions, categories) >= achievement.alvo;
    });
}

export function getAchievementSummaries({ state, questions, categories }) {
    const unlocked = new Set(state.achievements);

    return QUIZ_ACHIEVEMENTS.map((achievement) => {
        const value = getAchievementValue(achievement.tipo, state, questions, categories);
        const progress = Math.min(value / achievement.alvo, 1);

        return {
            ...achievement,
            value,
            progress,
            unlocked: unlocked.has(achievement.id)
        };
    });
}

function getAchievementValue(type, state, questions, categories) {
    switch (type) {
        case "correctAnswers":
            return state.correctAnswers;
        case "totalAnswers":
            return state.totalAnswers;
        case "bestCombo":
            return state.bestCombo;
        case "level":
            return state.level;
        case "categoryCoverage":
            return getCategoryCoverage(state, categories);
        case "perfectCategories":
            return getPerfectCategoryCount(state, questions, categories);
        default:
            return 0;
    }
}

function getCategoryCoverage(state, categories) {
    return categories.filter((category) => {
        return getCategoryStats(state, category.id).correctQuestionIds.length > 0;
    }).length;
}

function getPerfectCategoryCount(state, questions, categories) {
    return categories.filter((category) => {
        const categoryQuestions = questions.filter((question) => question.categoria === category.id);
        const categoryStats = getCategoryStats(state, category.id);
        return categoryQuestions.length > 0 && categoryStats.correctQuestionIds.length >= categoryQuestions.length;
    }).length;
}

function getCategoryStats(state, categoryId) {
    return state.categories[categoryId] || {
        answers: 0,
        correct: 0,
        correctQuestionIds: []
    };
}
