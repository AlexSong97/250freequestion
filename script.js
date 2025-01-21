document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('question-selector');
  const quizContainer = document.getElementById('quiz-container');
  const englishBtn = document.getElementById('english-btn');
  const chineseBtn = document.getElementById('chinese-btn');
  const submitBtn = document.getElementById('submit-btn');

  let currentLanguage = 'en'; // 默认语言
  let currentQuestions = []; // 当前加载的题目
  let userAnswers = {}; // 用户的答案

  // 初始加载第一组题目
  loadQuestions('json/questions_set_1.json');

  // 当选择器改变时加载对应的 JSON 文件
  selector.addEventListener('change', (event) => {
    const selectedFile = event.target.value;
    loadQuestions(selectedFile);
  });

  // 切换语言按钮的事件监听
  englishBtn.addEventListener('click', () => {
    currentLanguage = 'en';
    renderQuestions(currentQuestions);
  });

  chineseBtn.addEventListener('click', () => {
    currentLanguage = 'zh';
    renderQuestions(currentQuestions);
  });

  // 提交答案按钮的事件监听
  submitBtn.addEventListener('click', () => {
    showResults();
  });

  // 加载 JSON 文件并渲染题目
  function loadQuestions(file) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => {
        currentQuestions = data;
        userAnswers = {}; // 重置用户答案
        renderQuestions(data);
      })
      .catch((error) => console.error('Error loading JSON:', error));
  }

  // 渲染题目
  function renderQuestions(questions) {
    quizContainer.innerHTML = ''; // 清空已有题目
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.className = 'question';

      // 添加问题文本
      const questionText = document.createElement('h3');
      if (currentLanguage === 'zh') {
        // 中文模式：显示中英文
        questionText.textContent = `${index + 1}. ${question.question.zh} (${question.question.en})`;
      } else {
        // 英文模式：只显示英文
        questionText.textContent = `${index + 1}. ${question.question.en}`;
      }
      questionElement.appendChild(questionText);

      // 添加选项
      const optionsList = document.createElement('ul');
      question.options.zh.forEach((optionZh, i) => {
        const optionEn = question.options.en[i]; // 获取对应的英文选项
        const optionText = currentLanguage === 'zh' ? `${optionZh} (${optionEn})` : optionEn;

        const optionItem = document.createElement('li');
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = `question-${index}`; // 分组
        optionInput.value = String.fromCharCode(65 + i); // A, B, C, D
        optionInput.addEventListener('click', () => {
          userAnswers[index] = optionInput.value; // 保存用户答案
        });

        const optionLabel = document.createElement('label');
        optionLabel.textContent = optionText;

        optionItem.appendChild(optionInput);
        optionItem.appendChild(optionLabel);
        optionsList.appendChild(optionItem);
      });
      questionElement.appendChild(optionsList);

      quizContainer.appendChild(questionElement);
    });
  }

  // 显示答题结果
  function showResults() {
    currentQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correct_answer;

      if (userAnswer) {
        const resultText = userAnswer === correctAnswer
          ? `✅ Correct! ${question.explanation[currentLanguage]}`
          : `❌ Incorrect. Correct answer: ${correctAnswer}. ${question.explanation[currentLanguage]}`;

        const resultElement = document.createElement('p');
        resultElement.textContent = resultText;
        quizContainer.children[index].appendChild(resultElement);
      } else {
        const resultElement = document.createElement('p');
        resultElement.textContent = '⚠️ You did not answer this question.';
        quizContainer.children[index].appendChild(resultElement);
      }
    });
  }
});
