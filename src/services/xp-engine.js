export const QUIZ_LEVELS = [
    { level: 1, titulo: "Cadete orbital", requiredXp: 0 },
    { level: 2, titulo: "Navegador lunar", requiredXp: 120 },
    { level: 3, titulo: "Piloto estelar", requiredXp: 280 },
    { level: 4, titulo: "Analista cósmico", requiredXp: 480 },
    { level: 5, titulo: "Comandante BSpace", requiredXp: 760 },
    { level: 6, titulo: "Mestre do cosmos", requiredXp: 1120 }
];

const XP_RULES = {
    correct: 30,
    retryCorrect: 8,
    incorrect: 5,
    firstCorrectBonus: 10,
    comboStep: 5,
    maxComboBonus: 20
};

export function calculateAnswerXp({ isCorrect, combo, alreadyMastered }) {
    const baseXp = isCorrect
        ? alreadyMastered ? XP_RULES.retryCorrect : XP_RULES.correct
        : XP_RULES.incorrect;
    const comboBonus = isCorrect ? Math.min(Math.max(combo - 1, 0) * XP_RULES.comboStep, XP_RULES.maxComboBonus) : 0;
    const noveltyBonus = isCorrect && !alreadyMastered ? XP_RULES.firstCorrectBonus : 0;
    const totalXp = baseXp + comboBonus + noveltyBonus;

    return {
        baseXp,
        comboBonus,
        noveltyBonus,
        achievementBonus: 0,
        totalXp
    };
}

export function applyXp(state, xp) {
    const nextState = {
        ...state,
        xp: Math.max(0, Number(state.xp || 0) + Number(xp || 0))
    };

    nextState.level = getLevelForXp(nextState.xp).level;
    return nextState;
}

export function getLevelForXp(xp) {
    const safeXp = Math.max(0, Number(xp || 0));
    return [...QUIZ_LEVELS].reverse().find((level) => safeXp >= level.requiredXp) || QUIZ_LEVELS[0];
}

export function getLevelProgress(xp) {
    const safeXp = Math.max(0, Number(xp || 0));
    const currentLevel = getLevelForXp(safeXp);
    const nextLevel = QUIZ_LEVELS.find((level) => level.requiredXp > safeXp);

    if (!nextLevel) {
        return {
            currentLevel,
            nextLevel: null,
            currentXp: safeXp,
            requiredXp: currentLevel.requiredXp,
            xpIntoLevel: safeXp - currentLevel.requiredXp,
            xpToNext: 0,
            percent: 100
        };
    }

    const levelSize = nextLevel.requiredXp - currentLevel.requiredXp;
    const xpIntoLevel = safeXp - currentLevel.requiredXp;

    return {
        currentLevel,
        nextLevel,
        currentXp: safeXp,
        requiredXp: nextLevel.requiredXp,
        xpIntoLevel,
        xpToNext: nextLevel.requiredXp - safeXp,
        percent: Math.round((xpIntoLevel / levelSize) * 100)
    };
}
