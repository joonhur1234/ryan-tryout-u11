// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navlinks = document.getElementById('navlinks');
if (navToggle && navlinks) {
  navToggle.addEventListener('click', () => {
    const open = navlinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navlinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navlinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Interactive, persistent pre-game checklist
const STORAGE_KEY = 'ryan-prospects-checklist';

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* storage unavailable — checklist still works for this session */
  }
}

function applyState() {
  const state = loadState();
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(input => {
    const key = input.dataset.key;
    input.checked = !!state[key];
    input.closest('.check-item').classList.toggle('is-checked', input.checked);
  });
}

document.querySelectorAll('#checklist input[type="checkbox"]').forEach(input => {
  input.addEventListener('change', () => {
    const state = loadState();
    state[input.dataset.key] = input.checked;
    saveState(state);
    input.closest('.check-item').classList.toggle('is-checked', input.checked);
  });
});

const resetBtn = document.getElementById('checklistReset');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    saveState({});
    applyState();
  });
}

applyState();

const quizData = [
  {
    question: 'When should a forward use full speed most aggressively?',
    options: [
      'When carrying the puck through the neutral zone with no pressure',
      'During a forecheck or backcheck when the play is changing direction quickly',
      'Every single time they touch the puck for 60 seconds straight',
      'Only while standing still to warm up'
    ],
    answer: 'During a forecheck or backcheck when the play is changing direction quickly'
  },
  {
    question: 'Why is 70%–80% controlled speed useful while carrying the puck in the middle of the ice?',
    options: [
      'It keeps your head up so you can read the ice and protect the puck',
      'It makes your stick taller so defenders miss the puck',
      'It guarantees a goal without a pass',
      'It removes the need for angling or body position'
    ],
    answer: 'It keeps your head up so you can read the ice and protect the puck'
  },
  {
    question: 'What is the best approach when attacking a defender 1-on-1?',
    options: [
      'Rush straight at them at 100% from the start every time',
      'Approach at a controlled pace, then explode at the moment of contact',
      'Stop completely to fake a shot and wait for them to stop',
      'Skate backwards to bait them into a turnover'
    ],
    answer: 'Approach at a controlled pace, then explode at the moment of contact'
  },
  {
    question: 'In the defensive zone, what is the best first priority?',
    options: [
      'Stand in the slot and watch the puck until it is loose',
      'Take smart angles, protect the middle, and force play wide',
      'Chase the puck all the way to the blue line',
      'Stay in the corner and never check the middle lane'
    ],
    answer: 'Take smart angles, protect the middle, and force play wide'
  }
];

const quizContainer = document.getElementById('quizApp');

if (quizContainer) {
  let currentIndex = 0;
  let score = 0;
  const answered = new Set();

  const buildQuestion = () => {
    const question = quizData[currentIndex];
    quizContainer.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'quiz-question';

    const heading = document.createElement('h4');
    heading.textContent = `${currentIndex + 1}. ${question.question}`;
    card.appendChild(heading);

    const optionGroup = document.createElement('div');
    optionGroup.className = 'quiz-options';

    question.options.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = option;

      button.addEventListener('click', () => {
        if (answered.has(currentIndex)) return;
        answered.add(currentIndex);

        const isCorrect = option === question.answer;
        if (isCorrect) score += 1;

        Array.from(optionGroup.children).forEach(btn => {
          btn.disabled = true;
          if (btn.textContent === question.answer) {
            btn.classList.add('correct');
          } else if (btn === button && !isCorrect) {
            btn.classList.add('wrong');
          }
        });

        const result = document.createElement('div');
        result.className = 'quiz-result visible';
        result.textContent = isCorrect
          ? 'Correct — that is the right read and timing.'
          : `Not quite — the best answer is: ${question.answer}`;
        card.appendChild(result);

        const nextWrap = document.createElement('div');
        nextWrap.style.marginTop = '18px';
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'quiz-option';
        nextBtn.textContent = currentIndex === quizData.length - 1 ? 'See score' : 'Next question';
        nextBtn.addEventListener('click', () => {
          if (currentIndex < quizData.length - 1) {
            currentIndex += 1;
            buildQuestion();
          } else {
            const scoreText = document.createElement('div');
            scoreText.className = 'quiz-score';
            scoreText.innerHTML = `Score: <strong>${score}/${quizData.length}</strong>`;
            quizContainer.innerHTML = '';
            quizContainer.appendChild(scoreText);
            const summary = document.createElement('div');
            summary.className = 'quiz-result visible';
            summary.textContent = score === quizData.length
              ? 'Perfect read. You understand when to attack with speed and when to control the play.'
              : 'Solid work. Keep studying the zone reads and the timing of your bursts.';
            quizContainer.appendChild(summary);
          }
        });
        nextWrap.appendChild(nextBtn);
        card.appendChild(nextWrap);
      });

      optionGroup.appendChild(button);
    });

    card.appendChild(optionGroup);
    quizContainer.appendChild(card);
  };

  buildQuestion();
}
