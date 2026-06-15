import { completeAcademyExercise, answerAcademyQuiz, getAcademySnapshot, markModuleContentStudied, setActiveAcademyModule } from "../services/academy-progress-service.js";
import { createTextElement } from "../utils/dom.js";

export function setupAcademy({ modules, moduleList, moduleContent, progressPanel }) {
    if (!moduleList || !moduleContent || !progressPanel || modules.length === 0) {
        return;
    }

    let snapshot = getAcademySnapshot(modules);
    let activeSlug = snapshot.activeModule || modules[0].slug;
    let feedbackMessage = `Comece por ${snapshot.nextModule?.titulo || modules[0].titulo} e avance no seu ritmo.`;

    function render() {
        snapshot = getAcademySnapshot(modules);
        const activeModule = getActiveModule();

        renderProgress(activeModule);
        renderModuleList();
        renderModule(activeModule);
    }

    function renderProgress(activeModule) {
        const percent = Math.round(snapshot.progress * 100);

        progressPanel.innerHTML = "";
        progressPanel.append(
            createProgressHeader(percent),
            createProgressStats([
                ["Etapas concluídas", `${snapshot.completedSteps}/${snapshot.totalSteps}`],
                ["Módulos concluídos", `${snapshot.completedModules}/${snapshot.totalModules}`],
                ["Próxima trilha", snapshot.nextModule?.titulo || activeModule.titulo]
            ]),
            createTextElement("p", feedbackMessage, "academy-feedback")
        );
    }

    function createProgressHeader(percent) {
        const wrapper = document.createElement("div");
        const copy = document.createElement("div");
        const title = createTextElement("strong", "Jornada educacional BSpace");
        const description = createTextElement("span", "Complete conteúdo, exercícios e quiz para avançar.");
        const progress = document.createElement("div");
        const fill = document.createElement("span");

        wrapper.className = "academy-progress-header";
        copy.append(title, description);

        progress.className = "academy-progress-bar";
        progress.setAttribute("role", "progressbar");
        progress.setAttribute("aria-label", "Progresso geral da Academia");
        progress.setAttribute("aria-valuemin", "0");
        progress.setAttribute("aria-valuemax", "100");
        progress.setAttribute("aria-valuenow", String(percent));
        fill.style.width = `${percent}%`;
        progress.appendChild(fill);

        wrapper.append(copy, createTextElement("strong", `${percent}%`, "academy-progress-value"), progress);
        return wrapper;
    }

    function createProgressStats(items) {
        const grid = document.createElement("div");
        grid.className = "academy-stat-grid";

        items.forEach(([label, value]) => {
            const item = document.createElement("div");
            item.className = "academy-stat";
            item.append(createTextElement("span", label), createTextElement("strong", value));
            grid.appendChild(item);
        });

        return grid;
    }

    function renderModuleList() {
        moduleList.innerHTML = "";

        snapshot.modules.forEach((module) => {
            const card = document.createElement("button");
            const header = document.createElement("span");
            const progress = document.createElement("span");
            const fill = document.createElement("i");
            const percent = Math.round(module.progress * 100);

            card.type = "button";
            card.className = "academy-module-card";
            card.classList.toggle("is-active", module.slug === activeSlug);
            card.setAttribute("aria-pressed", String(module.slug === activeSlug));
            card.addEventListener("click", () => {
                activeSlug = module.slug;
                setActiveAcademyModule(activeSlug);
                feedbackMessage = `${module.titulo} selecionado.`;
                render();
            });

            header.className = "academy-module-card-header";
            header.append(
                createTextElement("span", `Módulo ${module.ordem}`),
                createTextElement("strong", module.titulo)
            );

            progress.className = "academy-mini-progress";
            fill.style.width = `${percent}%`;
            progress.appendChild(fill);

            card.append(
                header,
                createTextElement("span", module.nivel, "academy-module-level"),
                progress,
                createTextElement("span", `${percent}% · ${module.completedSteps}/${module.totalSteps} etapas`, "academy-module-meta")
            );
            moduleList.appendChild(card);
        });
    }

    function renderModule(module) {
        moduleContent.innerHTML = "";
        moduleContent.append(
            createModuleHeader(module),
            createObjectives(module),
            createContent(module),
            createExercises(module),
            createQuiz(module),
            createModuleFooter(module)
        );
    }

    function createModuleHeader(module) {
        const header = document.createElement("div");
        const copy = document.createElement("div");
        const meta = document.createElement("div");

        header.className = "academy-module-header";
        copy.append(
            createTextElement("span", `Módulo ${module.ordem} · ${module.nivel}`, "section-kicker"),
            createTextElement("h2", module.titulo),
            createTextElement("p", module.resumo)
        );
        meta.className = "academy-module-summary";
        meta.append(
            createTextElement("span", module.duracao),
            createTextElement("strong", `${module.completedSteps} / ${module.totalSteps} etapas`)
        );
        header.append(copy, meta);

        return header;
    }

    function createObjectives(module) {
        const wrapper = document.createElement("section");
        const list = document.createElement("ul");

        wrapper.className = "academy-panel-block";
        module.objetivos.forEach((objective) => {
            list.appendChild(createTextElement("li", objective));
        });
        wrapper.append(createTextElement("h3", "Objetivos de aprendizagem"), list);

        return wrapper;
    }

    function createContent(module) {
        const wrapper = document.createElement("section");
        const grid = document.createElement("div");
        const button = document.createElement("button");

        wrapper.className = "academy-panel-block";
        grid.className = "academy-content-grid";
        module.conteudo.forEach((section) => {
            const card = document.createElement("article");
            card.className = "academy-content-card";
            card.append(createTextElement("strong", section.titulo), createTextElement("p", section.texto));
            grid.appendChild(card);
        });

        button.type = "button";
        button.className = module.contentStudied ? "button-secondary" : "button";
        button.textContent = module.contentStudied ? "Conteúdo estudado" : "Marcar conteúdo estudado";
        button.disabled = module.contentStudied;
        button.addEventListener("click", () => {
            markModuleContentStudied(module.slug, modules);
            feedbackMessage = "Conteúdo registrado.";
            render();
        });

        wrapper.append(createTextElement("h3", "Conteúdo"), grid, button);
        return wrapper;
    }

    function createExercises(module) {
        const wrapper = document.createElement("section");
        const list = document.createElement("div");

        wrapper.className = "academy-panel-block";
        list.className = "academy-exercise-list";

        module.exercicios.forEach((exercise) => {
            const item = document.createElement("article");
            const button = document.createElement("button");
            const completed = module.completedExercises.includes(exercise.id);

            item.className = "academy-exercise";
            item.classList.toggle("is-completed", completed);
            button.type = "button";
            button.className = completed ? "button-secondary" : "button";
            button.textContent = completed ? "Concluído" : "Concluir exercício";
            button.disabled = completed;
            button.addEventListener("click", () => {
                completeAcademyExercise({ moduleSlug: module.slug, exerciseId: exercise.id, modules });
                feedbackMessage = "Exercício registrado.";
                render();
            });

            item.append(
                createTextElement("strong", exercise.titulo),
                createTextElement("p", exercise.instrucao),
                button
            );
            list.appendChild(item);
        });

        wrapper.append(createTextElement("h3", "Exercícios"), list);
        return wrapper;
    }

    function createQuiz(module) {
        const wrapper = document.createElement("section");
        const list = document.createElement("div");

        wrapper.className = "academy-panel-block";
        list.className = "academy-quiz-list";

        module.quiz.forEach((question) => {
            const item = document.createElement("article");
            const options = document.createElement("div");
            const answerState = module.answeredQuestions[question.id];
            const mastered = module.correctQuestions.includes(question.id);

            item.className = "academy-quiz-item";
            item.classList.toggle("is-mastered", mastered);
            options.className = "academy-quiz-options";
            question.opcoes.forEach((option, index) => {
                const button = document.createElement("button");
                const isSelected = answerState?.selectedIndex === index;

                button.type = "button";
                button.textContent = option;
                button.disabled = mastered;
                button.classList.toggle("is-correct", mastered && index === question.correta);
                button.classList.toggle("is-wrong", Boolean(answerState && !answerState.isCorrect && isSelected));
                button.addEventListener("click", () => {
                    const result = answerAcademyQuiz({
                        moduleSlug: module.slug,
                        questionId: question.id,
                        selectedIndex: index,
                        modules
                    });
                    feedbackMessage = result?.isCorrect
                        ? question.explicacao
                        : `Revise: ${question.explicacao}`;
                    render();
                });
                options.appendChild(button);
            });

            item.append(
                createTextElement("strong", question.pergunta),
                options,
                createTextElement("p", mastered ? question.explicacao : "Escolha uma alternativa para testar seu entendimento.", "academy-quiz-note")
            );
            list.appendChild(item);
        });

        wrapper.append(createTextElement("h3", "Quiz do módulo"), list);
        return wrapper;
    }

    function createModuleFooter(module) {
        const footer = document.createElement("div");
        const nextModule = snapshot.modules.find((item) => item.ordem === module.ordem + 1);

        footer.className = "academy-module-footer";
        footer.appendChild(createTextElement("p", `${module.completedSteps}/${module.totalSteps} etapas concluídas neste módulo.`));

        if (nextModule) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "button-secondary";
            button.textContent = `Próximo: ${nextModule.titulo}`;
            button.addEventListener("click", () => {
                activeSlug = nextModule.slug;
                setActiveAcademyModule(activeSlug);
                feedbackMessage = `Você avançou para ${nextModule.titulo}.`;
                render();
            });
            footer.appendChild(button);
        }

        return footer;
    }

    function getActiveModule() {
        const module = snapshot.modules.find((item) => item.slug === activeSlug);
        return module || snapshot.modules[0];
    }

    render();
}
