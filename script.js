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
  },
  {
    question: 'What should a winger do when the defenseman gains control of the puck during a breakout?',
    options: [
      'Explode to the breakout position and become a passing option',
      'Stop behind the net and wait for the play to finish',
      'Skate directly toward the puck carrier and block the passing lane',
      'Leave the zone before the puck is ready to move'
    ],
    answer: 'Explode to the breakout position and become a passing option'
  },
  {
    question: 'After reaching a breakout position, what speed helps you receive a pass cleanly?',
    options: [
      'A controlled glide while facing the puck',
      'A full sprint with your back to the puck',
      'A complete stop facing the boards',
      'Random changes of direction'
    ],
    answer: 'A controlled glide while facing the puck'
  },
  {
    question: 'What should you do immediately after receiving the puck in the neutral zone?',
    options: [
      'Accelerate to attack before the defense can regroup',
      'Hold the puck until every teammate stops skating',
      'Turn back toward your own net every time',
      'Shoot the puck out of play'
    ],
    answer: 'Accelerate to attack before the defense can regroup'
  },
  {
    question: 'Why should a forward protect the middle of the ice without the puck?',
    options: [
      'To take away dangerous passing and scoring options',
      'To avoid helping the defense',
      'To stay as far from the play as possible',
      'To force teammates to defend alone'
    ],
    answer: 'To take away dangerous passing and scoring options'
  },
  {
    question: 'What is the best defensive angle when pressuring an opponent along the boards?',
    options: [
      'An angle that guides the opponent away from the middle',
      'A straight line that gives the opponent the center lane',
      'An angle that sends the opponent behind your own net',
      'No angle; follow directly behind the opponent'
    ],
    answer: 'An angle that guides the opponent away from the middle'
  },
  {
    question: 'What makes a strong teammate during a breakout?',
    options: [
      'Moving into open space and communicating clearly',
      'Standing behind the puck carrier',
      'Calling for the puck without getting open',
      'Leaving the zone early every time'
    ],
    answer: 'Moving into open space and communicating clearly'
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
