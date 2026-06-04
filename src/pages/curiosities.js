import { CURIOSITIES } from "../data/curiosities.js";
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from "../data/quiz.js";
import { setupLightSimulator } from "../components/light-simulator.js";
import { setupQuiz } from "../components/quiz.js";
import { setupRandomCuriosity } from "../components/random-curiosity.js";
import { incrementQuizAnswers } from "../services/exploration-progress-service.js";

export function initPage() {
    setupRandomCuriosity({
        buttonId: "btnCuriosidade",
        outputId: "curiosidadeTexto",
        curiosities: CURIOSITIES
    });

    setupQuiz({
        questions: QUIZ_QUESTIONS,
        categories: QUIZ_CATEGORIES,
        questionId: "quizQuestion",
        questionMetaId: "quizQuestionMeta",
        categoryId: "quizCategories",
        optionsId: "quizOptions",
        feedbackId: "quizFeedback",
        dashboardId: "quizDashboard",
        onAnswer: incrementQuizAnswers
    });

    setupLightSimulator({
        selectId: "lightDestination",
        meterId: "lightMeter",
        outputId: "lightOutput"
    });
}
