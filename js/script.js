// Dados dos quizzes
const quizzes = {
  geografia: [
    {
      pergunta: "Qual é a capital da França?",
      opcoes: ["Paris", "Londres", "Madri", "Roma"],
      resposta: "Paris",
    },
  ],
  historia: [
    {
      pergunta: "Quem descobriu o Brasil?",
      opcoes: ["Pedro Álvares Cabral", "Cristóvão Colombo", "Vasco da Gama", "Fernão de Magalhães"],
      resposta: "Pedro Álvares Cabral",
    },
  ],
  matematica: [
    {
      pergunta: "Quanto é 2 + 2?",
      opcoes: ["3", "4", "5", "6"],
      resposta: "4",
    },
  ],
};

// Função para exibir o formulário de criação de quiz
document.getElementById("createQuizButton").addEventListener("click", function () {
  document.getElementById("createQuizForm").classList.toggle("hidden");
});

// Função para adicionar um novo quiz
document.getElementById("quizForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita o recarregamento da página

  // Captura os valores do formulário
  const category = document.getElementById("quizCategory").value.toLowerCase();
  const question = document.getElementById("quizQuestion").value;
  const options = document.getElementById("quizOptions").value.split(",").map(opt => opt.trim());
  const answer = document.getElementById("quizAnswer").value;

  // Adiciona o novo quiz ao array de quizzes
  if (!quizzes[category]) {
    quizzes[category] = []; // Cria a categoria se não existir
  }
  quizzes[category].push({
    pergunta: question,
    opcoes: options,
    resposta: answer
  });

  // Limpa o formulário
  document.getElementById("quizForm").reset();
  document.getElementById("createQuizForm").classList.add("hidden");

  // Atualiza a lista de quizzes na página
  updateQuizList();
});

// Função para atualizar a lista de quizzes na página
function updateQuizList() {
  const quizCards = document.getElementById("quizCards");
  quizCards.innerHTML = ""; // Limpa a lista atual

  // Itera sobre todas as categorias e quizzes
  for (const category in quizzes) {
    quizzes[category].forEach((quiz, index) => {
      const quizCard = document.createElement("div");
      quizCard.classList.add("col-md-4", "mb-3");
      quizCard.innerHTML = `
        <div class="quiz-card" onclick="startQuiz('${category}')">
          <img src="https://via.placeholder.com/150" alt="${category}">
          <h5 class="mt-2">${quiz.pergunta}</h5>
        </div>
      `;
      quizCards.appendChild(quizCard);
    });
  }
}

// Função para iniciar o quiz
function startQuiz(materia) {
  // Oculta a lista de quizzes
  document.getElementById("quiz-list").classList.add("hidden");

  // Exibe o container do quiz
  document.getElementById("quiz-container").classList.remove("hidden");

  // Exibe os botões "Verificar Respostas" e "Voltar"
  document.getElementById("checkAnswersButton").classList.remove("hidden");
  document.getElementById("goBackButton").classList.remove("hidden");

  // Define o título do quiz
  document.getElementById("quiz-title").innerText = `Quiz de ${materia.charAt(0).toUpperCase() + materia.slice(1)}`;

  // Limpa o conteúdo anterior do quiz
  const quizQuestionsDiv = document.getElementById("quiz-questions");
  quizQuestionsDiv.innerHTML = "";

  // Adiciona as perguntas ao container do quiz
  quizzes[materia].forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("mb-3");

    // Texto da pergunta
    const questionText = document.createElement("p");
    questionText.innerText = q.pergunta;
    questionDiv.appendChild(questionText);

    // Criação das opções com radio buttons e labels
    q.opcoes.forEach((opcao, i) => {
      const formCheckDiv = document.createElement("div");
      formCheckDiv.classList.add("form-check");

      const optionId = `q${index}_option${i}`;

      const input = document.createElement("input");
      input.type = "radio";
      input.classList.add("form-check-input");
      input.name = `q${index}`;
      input.id = optionId;
      input.value = opcao;

      const label = document.createElement("label");
      label.classList.add("form-check-label");
      label.htmlFor = optionId;
      label.innerText = opcao;

      formCheckDiv.appendChild(input);
      formCheckDiv.appendChild(label);
      questionDiv.appendChild(formCheckDiv);
    });

    quizQuestionsDiv.appendChild(questionDiv);
  });
}

// Função para verificar as respostas
function checkAnswers() {
  const quizTitle = document.getElementById("quiz-title").innerText.replace("Quiz de ", "").toLowerCase();
  const quiz = quizzes[quizTitle];
  let correct = 0;

  quiz.forEach((q, index) => {
    const inputs = document.getElementsByName(`q${index}`);
    let selected = null;

    Array.from(inputs).forEach(input => {
      if (input.checked) {
        selected = input;
      }
    });

    Array.from(inputs).forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (input.value === q.resposta) {
        label.classList.add("text-success");
      }
      if (input.checked && input.value !== q.resposta) {
        label.classList.add("text-danger");
      }
      input.disabled = true;
    });

    if (selected && selected.value === q.resposta) {
      correct++;
    }
  });

  document.getElementById("quiz-result").innerText = `Você acertou ${correct} de ${quiz.length} perguntas.`;
}

// Função para voltar à lista de quizzes
function goBack() {
  // Oculta o container do quiz
  document.getElementById("quiz-container").classList.add("hidden");

  // Oculta os botões "Verificar Respostas" e "Voltar"
  document.getElementById("checkAnswersButton").classList.add("hidden");
  document.getElementById("goBackButton").classList.add("hidden");

  // Exibe a lista de quizzes
  document.getElementById("quiz-list").classList.remove("hidden");

  // Limpa o resultado do quiz
  document.getElementById("quiz-result").innerText = "";
}

// Inicializa a lista de quizzes ao carregar a página
updateQuizList();