import { QUIZ_CATEGORIES, QUIZ_DIFFICULTY_LABELS } from "../data/quiz.js";
import { getQuizSummary, recordQuizAnswer } from "../services/quiz-engine.js";
import { byId, createTextElement, setText } from "../utils/dom.js";
import { formatNumber } from "../utils/format.js";

const ALL_CATEGORIES = "todas";

export function setupQuiz({
    questions,
    categories = QUIZ_CATEGORIES,
    questionId,
    questionMetaId,
    categoryId,
    optionsId,
    feedbackId,
    dashboardId,
    onAnswer
}) {
    const questionElement = byId(questionId);
    const questionMetaElement = byId(questionMetaId);
    const categoriesElement = byId(categoryId);
    const optionsElement = byId(optionsId);
    const dashboardElement = byId(dashboardId);

    if (!questionElement || !optionsElement || questions.length === 0) {
        return;
    }

    let currentQuestionIndex = 0;
    let activeCategoryId = ALL_CATEGORIES;
    let locked = false;

    function renderQuestion() {
        const visibleQuestions = getVisibleQuestions();
        const question = visibleQuestions[currentQuestionIndex % visibleQuestions.length];
        const category = categories.find((item) => item.id === question.categoria);
        const difficulty = QUIZ_DIFFICULTY_LABELS[question.dificuldade] || question.dificuldade;

        locked = false;
        questionElement.textContent = question.pergunta;
        optionsElement.innerHTML = "";
        setText(feedbackId, "Escolha uma alternativa para responder ao Cosmic Quiz.");

        if (questionMetaElement) {
            questionMetaElement.textContent = `${category?.nome || "Quiz"} · ${difficulty}`;
        }

        question.opcoes.forEach((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option;
            button.addEventListener("click", () => answerQuestion(index, button));
            optionsElement.appendChild(button);
        });

        renderCategories();
        renderDashboard(getQuizSummary(questions, categories));
    }

    function answerQuestion(selectedIndex, selectedButton) {
        if (locked) {
            return;
        }

        locked = true;

        const visibleQuestions = getVisibleQuestions();
        const question = visibleQuestions[currentQuestionIndex % visibleQuestions.length];
        const result = recordQuizAnswer({ question, selectedIndex, questions, categories });
        const buttons = optionsElement.querySelectorAll("button");

        buttons.forEach((button, index) => {
            button.disabled = true;
            button.classList.toggle("is-correct", index === result.correctIndex);
        });

        if (!result.isCorrect) {
            selectedButton.classList.add("is-wrong");
        }

        setText(feedbackId, createFeedbackMessage(result));
        renderCategories(result.snapshot);
        renderDashboard(result.snapshot);
        onAnswer?.(result);

        window.setTimeout(() => {
            currentQuestionIndex += 1;
            renderQuestion();
        }, 2200);
    }

    function renderCategories(summary = getQuizSummary(questions, categories)) {
        if (!categoriesElement) {
            return;
        }

        categoriesElement.innerHTML = "";
        categoriesElement.appendChild(createCategoryButton({
            id: ALL_CATEGORIES,
            title: "Todas",
            detail: `${summary.masteredQuestions}/${summary.totalQuestions}`,
            active: activeCategoryId === ALL_CATEGORIES
        }));

        summary.categories.forEach((category) => {
            categoriesElement.appendChild(createCategoryButton({
                id: category.id,
                title: category.nome,
                detail: `${category.mastered}/${category.total}`,
                active: activeCategoryId === category.id
            }));
        });
    }

    function createCategoryButton({ id, title, detail, active }) {
        const button = document.createElement("button");
        const titleElement = createTextElement("strong", title);
        const detailElement = createTextElement("span", detail);

        button.type = "button";
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
        button.append(titleElement, detailElement);
        button.addEventListener("click", () => {
            activeCategoryId = id;
            currentQuestionIndex = 0;
            renderQuestion();
        });

        return button;
    }

    function renderDashboard(summary) {
        if (!dashboardElement) {
            return;
        }

        dashboardElement.innerHTML = "";
        dashboardElement.append(
            createProgressPanel(summary),
            createStatsGrid([
                ["Acertos", `${formatNumber(summary.correctAnswers)} (${summary.accuracy}%)`],
                ["Combo atual", `${formatNumber(summary.combo)}x`],
                ["Melhor combo", `${formatNumber(summary.bestCombo)}x`],
                ["Perguntas dominadas", `${formatNumber(summary.masteredQuestions)} de ${formatNumber(summary.totalQuestions)}`]
            ]),
            createCategoryProgress(summary.categories),
            createHistoryList(summary.history)
        );
    }

    function createProgressPanel(summary) {
        const panel = document.createElement("section");
        const header = document.createElement("div");
        const copy = document.createElement("div");
        const kicker = createTextElement("span", "Progresso do quiz", "section-kicker");
        const title = createTextElement("strong", `${formatNumber(summary.masteredQuestions)} de ${formatNumber(summary.totalQuestions)} perguntas dominadas`);
        const progress = document.createElement("div");
        const progressFill = document.createElement("span");
        const progressText = createTextElement("p", getQuestionProgressText(summary));
        const progressPercentage = Math.round(summary.questionProgress * 100);

        panel.className = "quiz-progress-panel";
        header.className = "quiz-progress-header";
        copy.append(kicker, title);
        header.appendChild(copy);

        progress.className = "quiz-progress-bar";
        progress.setAttribute("role", "progressbar");
        progress.setAttribute("aria-label", "Progresso de perguntas dominadas no quiz");
        progress.setAttribute("aria-valuemin", "0");
        progress.setAttribute("aria-valuemax", "100");
        progress.setAttribute("aria-valuenow", String(progressPercentage));
        progressFill.style.width = `${progressPercentage}%`;
        progress.appendChild(progressFill);

        panel.append(header, progress, progressText);
        return panel;
    }

    function createStatsGrid(items) {
        const grid = document.createElement("div");
        grid.className = "quiz-stat-grid";

        items.forEach(([label, value]) => {
            const item = document.createElement("div");
            item.className = "quiz-stat";
            item.append(
                createTextElement("span", label),
                createTextElement("strong", value)
            );
            grid.appendChild(item);
        });

        return grid;
    }

    function createCategoryProgress(categorySummaries) {
        const wrapper = document.createElement("section");
        const title = createTextElement("h3", "Progresso por categoria");
        const list = document.createElement("div");

        wrapper.className = "quiz-category-progress";
        list.className = "quiz-category-list";

        categorySummaries.forEach((category) => {
            const item = document.createElement("div");
            const heading = document.createElement("div");
            const bar = document.createElement("span");
            const fill = document.createElement("i");

            item.className = "quiz-category-item";
            heading.append(
                createTextElement("strong", category.nome),
                createTextElement("span", `${category.mastered}/${category.total}`)
            );
            bar.className = "quiz-mini-bar";
            fill.style.width = `${Math.round(category.progress * 100)}%`;
            bar.appendChild(fill);
            item.append(heading, bar);
            list.appendChild(item);
        });

        wrapper.append(title, list);
        return wrapper;
    }

    function createHistoryList(history) {
        const wrapper = document.createElement("section");
        const title = createTextElement("h3", "Histórico recente");
        const list = document.createElement("ol");

        wrapper.className = "quiz-history";
        list.className = "quiz-history-list";

        if (history.length === 0) {
            list.appendChild(createTextElement("li", "Nenhuma resposta registrada ainda."));
        } else {
            history.slice(0, 5).forEach((item) => {
                const historyItem = document.createElement("li");
                historyItem.className = item.isCorrect ? "is-correct" : "is-wrong";
                historyItem.append(
                    createTextElement("strong", item.isCorrect ? "Correta" : "Revisar"),
                    createTextElement("span", item.pergunta)
                );
                list.appendChild(historyItem);
            });
        }

        wrapper.append(title, list);
        return wrapper;
    }

    function getVisibleQuestions() {
        if (activeCategoryId === ALL_CATEGORIES) {
            return questions;
        }

        const filteredQuestions = questions.filter((question) => question.categoria === activeCategoryId);
        return filteredQuestions.length > 0 ? filteredQuestions : questions;
    }

    renderQuestion();
}

function createFeedbackMessage(result) {
    const base = result.isCorrect
        ? "Resposta correta."
        : "Quase. A alternativa correta ficou destacada.";
    const combo = result.state.combo > 1 ? ` Combo ${result.state.combo}x ativo.` : "";

    return `${base} ${result.question.explicacao}${combo}`;
}

function getQuestionProgressText(summary) {
    if (summary.masteredQuestions === summary.totalQuestions && summary.totalQuestions > 0) {
        return "Você já acertou todas as perguntas disponíveis nesta trilha.";
    }

    return "Cada pergunta correta conta para o domínio do conteúdo, sem sistema de pontuação por experiência.";
}
