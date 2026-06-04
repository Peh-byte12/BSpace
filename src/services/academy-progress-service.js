import { ACADEMY_MODULES, DEFAULT_ACADEMY_MODULE } from "../data/academy-modules.js";
import { readJsonStorage, writeJsonStorage } from "../utils/storage.js";

const STORAGE_KEY = "bspaceAcademyProgress";

const DEFAULT_STATE = {
    xp: 0,
    activeModule: DEFAULT_ACADEMY_MODULE,
    modules: {}
};

export function getAcademySnapshot(modules = ACADEMY_MODULES) {
    const state = getAcademyState();
    const moduleSummaries = modules.map((module) => getModuleSummary(module, state));
    const completedModules = moduleSummaries.filter((module) => module.progress >= 1).length;
    const totalXpAvailable = modules.reduce((total, module) => total + getModuleXpTotal(module), 0);
    const nextModule = moduleSummaries.find((module) => module.progress < 1) || moduleSummaries[moduleSummaries.length - 1];

    return {
        xp: state.xp,
        activeModule: state.activeModule,
        totalModules: modules.length,
        completedModules,
        totalXpAvailable,
        progress: totalXpAvailable > 0 ? state.xp / totalXpAvailable : 0,
        nextModule,
        modules: moduleSummaries
    };
}

export function setActiveAcademyModule(slug) {
    const state = getAcademyState();
    const nextState = {
        ...state,
        activeModule: slug
    };

    saveAcademyState(nextState);
    return getAcademySnapshot();
}

export function markModuleContentStudied(moduleSlug, modules = ACADEMY_MODULES) {
    const module = findModule(moduleSlug, modules);

    if (!module) {
        return null;
    }

    return updateModuleState(moduleSlug, (moduleState) => {
        if (moduleState.contentStudied) {
            return { moduleState, earnedXp: 0 };
        }

        return {
            earnedXp: module.conteudoXp,
            moduleState: {
                ...moduleState,
                contentStudied: true
            }
        };
    });
}

export function completeAcademyExercise({ moduleSlug, exerciseId, modules = ACADEMY_MODULES }) {
    const module = findModule(moduleSlug, modules);
    const exercise = module?.exercicios.find((item) => item.id === exerciseId);

    if (!module || !exercise) {
        return null;
    }

    return updateModuleState(moduleSlug, (moduleState) => {
        if (moduleState.completedExercises.includes(exerciseId)) {
            return { moduleState, earnedXp: 0 };
        }

        return {
            earnedXp: exercise.xp,
            moduleState: {
                ...moduleState,
                completedExercises: [...moduleState.completedExercises, exerciseId]
            }
        };
    });
}

export function answerAcademyQuiz({ moduleSlug, questionId, selectedIndex, modules = ACADEMY_MODULES }) {
    const module = findModule(moduleSlug, modules);
    const question = module?.quiz.find((item) => item.id === questionId);

    if (!module || !question) {
        return null;
    }

    const isCorrect = selectedIndex === question.correta;
    const result = updateModuleState(moduleSlug, (moduleState) => {
        const answeredQuestions = {
            ...moduleState.answeredQuestions,
            [questionId]: {
                selectedIndex,
                isCorrect,
                answeredAt: new Date().toISOString()
            }
        };
        const wasAlreadyCorrect = moduleState.correctQuestions.includes(questionId);
        const correctQuestions = isCorrect && !wasAlreadyCorrect
            ? [...moduleState.correctQuestions, questionId]
            : moduleState.correctQuestions;

        return {
            earnedXp: isCorrect && !wasAlreadyCorrect ? question.xp : 0,
            moduleState: {
                ...moduleState,
                answeredQuestions,
                correctQuestions
            }
        };
    });

    return {
        ...result,
        isCorrect,
        question
    };
}

export function getModuleXpTotal(module) {
    const contentXp = module.conteudoXp || 0;
    const exerciseXp = module.exercicios.reduce((total, exercise) => total + exercise.xp, 0);
    const quizXp = module.quiz.reduce((total, question) => total + question.xp, 0);
    return contentXp + exerciseXp + quizXp;
}

function updateModuleState(moduleSlug, updater) {
    const state = getAcademyState();
    const currentModuleState = getStoredModuleState(state, moduleSlug);
    const { moduleState, earnedXp } = updater(currentModuleState);
    const nextState = {
        ...state,
        xp: state.xp + earnedXp,
        activeModule: moduleSlug,
        modules: {
            ...state.modules,
            [moduleSlug]: moduleState
        }
    };

    saveAcademyState(nextState);

    return {
        earnedXp,
        snapshot: getAcademySnapshot(),
        moduleState
    };
}

function getModuleSummary(module, state) {
    const moduleState = getStoredModuleState(state, module.slug);
    const completedSteps = [
        moduleState.contentStudied,
        ...module.exercicios.map((exercise) => moduleState.completedExercises.includes(exercise.id)),
        ...module.quiz.map((question) => moduleState.correctQuestions.includes(question.id))
    ].filter(Boolean).length;
    const totalSteps = 1 + module.exercicios.length + module.quiz.length;
    const earnedXp = getModuleEarnedXp(module, moduleState);
    const totalXp = getModuleXpTotal(module);

    return {
        ...module,
        contentStudied: moduleState.contentStudied,
        completedExercises: moduleState.completedExercises,
        answeredQuestions: moduleState.answeredQuestions,
        correctQuestions: moduleState.correctQuestions,
        completedSteps,
        totalSteps,
        earnedXp,
        totalXp,
        progress: totalSteps > 0 ? completedSteps / totalSteps : 0
    };
}

function getModuleEarnedXp(module, moduleState) {
    const contentXp = moduleState.contentStudied ? module.conteudoXp : 0;
    const exerciseXp = module.exercicios.reduce((total, exercise) => {
        return total + (moduleState.completedExercises.includes(exercise.id) ? exercise.xp : 0);
    }, 0);
    const quizXp = module.quiz.reduce((total, question) => {
        return total + (moduleState.correctQuestions.includes(question.id) ? question.xp : 0);
    }, 0);

    return contentXp + exerciseXp + quizXp;
}

function getAcademyState() {
    return normalizeState(readJsonStorage(STORAGE_KEY, DEFAULT_STATE));
}

function saveAcademyState(state) {
    writeJsonStorage(STORAGE_KEY, normalizeState(state));
}

function normalizeState(state) {
    const source = state && typeof state === "object" ? state : DEFAULT_STATE;

    return {
        xp: readPositiveNumber(source.xp),
        activeModule: source.activeModule || DEFAULT_ACADEMY_MODULE,
        modules: normalizeModules(source.modules)
    };
}

function normalizeModules(modules) {
    if (!modules || typeof modules !== "object") {
        return {};
    }

    return Object.fromEntries(
        Object.entries(modules).map(([slug, moduleState]) => [slug, normalizeModuleState(moduleState)])
    );
}

function getStoredModuleState(state, moduleSlug) {
    return normalizeModuleState(state.modules[moduleSlug]);
}

function normalizeModuleState(moduleState) {
    return {
        contentStudied: Boolean(moduleState?.contentStudied),
        completedExercises: Array.isArray(moduleState?.completedExercises)
            ? [...new Set(moduleState.completedExercises.filter(Boolean))]
            : [],
        correctQuestions: Array.isArray(moduleState?.correctQuestions)
            ? [...new Set(moduleState.correctQuestions.filter(Boolean))]
            : [],
        answeredQuestions: moduleState?.answeredQuestions && typeof moduleState.answeredQuestions === "object"
            ? moduleState.answeredQuestions
            : {}
    };
}

function findModule(slug, modules) {
    return modules.find((module) => module.slug === slug);
}

function readPositiveNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
}
