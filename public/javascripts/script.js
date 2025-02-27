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
  portugues: [
    {
      pergunta: "Qual é o plural de 'cidadão'?",
      opcoes: ["Cidadãos", "Cidadões", "Cidadães", "Cidadãos"],
      resposta: "Cidadãos",
    },
  ],
  ciencias: [
    {
      pergunta: "Qual é o elemento químico com símbolo 'H'?",
      opcoes: ["Hélio", "Hidrogênio", "Háfnio", "Hassio"],
      resposta: "Hidrogênio",
    },
  ],
  ingles: [
    {
      pergunta: "Como se diz 'obrigado' em inglês?",
      opcoes: ["Thank you", "Please", "Sorry", "Hello"],
      resposta: "Thank you",
    },
  ],
};

// Função para exibir o formulário de criação de quiz
document.getElementById("createQuizButton").addEventListener("click", function () {
  const form = document.getElementById("createQuizForm");
  form.classList.toggle("hidden"); // Alterna a visibilidade do formulário
});

// Função para adicionar um novo quiz
// Function to add a new quiz
document.getElementById("quizForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  // Capture form values
  const category = document.getElementById("quizCategory").value.toLowerCase();
  const question = document.getElementById("quizQuestion").value;
  const options = document.getElementById("quizOptions").value.split(",").map(opt => opt.trim());
  const answer = document.getElementById("quizAnswer").value;
  const imageUrl = document.getElementById("quizImage").value; // Capture image URL

  // Add new quiz to local state
  if (!quizzes[category]) {
    quizzes[category] = []; // Create category if it doesn't exist
  }
  const newQuiz = {
    categoria: category,
    pergunta: question,
    opcoes: options,
    resposta: answer,
    imagem: imageUrl
  };
  quizzes[category].push(newQuiz); // Add to the specific category

  // Send the new quiz to the server
  fetch('/api/quizzes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newQuiz)
  })
  .then(response => {
    if (response.ok) {
      alert("Quiz added successfully!");

      // Fetch quizzes again to update the UI (Optional, or update UI directly)
      fetchQuizzes();
    } else {
      alert("Error adding quiz");
    }
  })
  .catch(error => console.error('Error adding quiz:', error));

  // Reset form and hide it after submission
  document.getElementById("quizForm").reset();
  document.getElementById("createQuizForm").classList.add("hidden"); // Hide the form

  // Dynamically add the new quiz card to the UI (local update)
  const quizCardsContainer = document.querySelector("#quiz-list .row");
  const newQuizCard = document.createElement("div");
  newQuizCard.classList.add("col-md-4", "mb-3");
  newQuizCard.innerHTML = `
    <div class="quiz-card" onclick="startQuiz('${category}')">
      <img src="${imageUrl || 'https://via.placeholder.com/150'}" alt="${category}" onerror="this.src='https://via.placeholder.com/150'">
      <h5 class="mt-2">${question}</h5>
    </div>
  `;
  quizCardsContainer.appendChild(newQuizCard);
});

// Function to fetch and display quizzes
function fetchQuizzes() {
  fetch('/api/quizzes')
    .then(response => response.json())
    .then(data => {
      const quizCardsContainer = document.querySelector("#quiz-list .row");

      // Clear existing cards
      quizCardsContainer.innerHTML = '';

      // Loop through quizzes and create a card for each
      data.forEach(quiz => {
        const newQuizCard = document.createElement("div");
        newQuizCard.classList.add("col-md-4", "mb-3");
        newQuizCard.innerHTML = `
          <div class="quiz-card" onclick="startQuiz('${quiz.categoria}')">
            <img src="${quiz.imagem || 'https://via.placeholder.com/150'}" alt="${quiz.categoria}" onerror="this.src='https://via.placeholder.com/150'">
            <h5 class="mt-2">${quiz.pergunta}</h5>
          </div>
        `;
        quizCardsContainer.appendChild(newQuizCard);
      });
    })
    .catch(error => console.error('Error fetching quizzes:', error));
}

// Initial fetch when page loads
fetchQuizzes();

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