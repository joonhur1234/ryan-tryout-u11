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

const hockeyIqQuizData = [
  {
    question: 'What is the biggest mental difference between an average U11 forward and an elite U11 Rep A1 forward?',
    options: [
      'The average player skates faster at the start of the game',
      'The elite player reads the game and processes options before the puck arrives',
      'The elite player always carries the puck through the neutral zone',
      'The average player never stops skating in the defensive zone'
    ],
    answer: 'The elite player reads the game and processes options before the puck arrives'
  },
  {
    question: 'In the offensive zone, what is the “Late Arrival” Cut designed to do?',
    options: [
      'Rush to the net immediately so the defenseman has to track the puck',
      'Delay the entry and jump into the slot as a teammate wins the wall battle',
      'Stay on the outside wall and wait for a pass from the point',
      'Chase the puck all the way to the corner every time'
    ],
    answer: 'Delay the entry and jump into the slot as a teammate wins the wall battle'
  },
  {
    question: 'Which offensive habit best creates passing lanes against a tight defense?',
    options: [
      'Looking down at the puck while carrying it',
      'Using your eyes and feet to freeze the defender before passing',
      'Passing right away without checking the defense',
      'Always shooting on the first touch'
    ],
    answer: 'Using your eyes and feet to freeze the defender before passing'
  },
  {
    question: 'What does “soft zone finding” mean for a smart U11 forward?',
    options: [
      'Always skating to the boards and waiting for a pass',
      'Finding the open pockets of ice between defenders and backchecking forwards',
      'Standing still near center ice and waiting for support',
      'Only moving when the puck is on the other side of the rink'
    ],
    answer: 'Finding the open pockets of ice between defenders and backchecking forwards'
  },
  {
    question: 'During transition, what is the smartest play when a defenseman is under pressure behind the net?',
    options: [
      'Wait high at the blue line and hope the D-man makes a safe play',
      'Skate low into the zone to provide a clean escape outlet',
      'Chase the puck into the corner and stop moving',
      'Leave the near side and drift to the wall'
    ],
    answer: 'Skate low into the zone to provide a clean escape outlet'
  },
  {
    question: 'If the center drives the middle and the wingers are moving wide, what is the most correct read?',
    options: [
      'Everyone keeps attacking the middle until a pass is available',
      'The wingers stretch the defense and a smart forward drops back if a defenseman pinches',
      'The winger stops skating and waits for the center to pass',
      'The weak-side winger always stays at the wall'
    ],
    answer: 'The wingers stretch the defense and a smart forward drops back if a defenseman pinches'
  },
  {
    question: 'In the defensive zone, what does “staying on the defensive side” require?',
    options: [
      'Standing in front of the net and hoping the puck hits you',
      'Positioning between the opponent and your own net to block shots or intercept passes',
      'Watching the puck from the blue line and never backing up',
      'Leaving the slot open to cheat toward the puck'
    ],
    answer: 'Positioning between the opponent and your own net to block shots or intercept passes'
  },
  {
    question: 'What is the best fix for a forward who is getting stripped of the puck?',
    options: [
      'Wait until the defender reaches them before looking up',
      'Pre-scan, shoulder-check, and protect the puck with their body before making a play',
      'Always skate backwards when under pressure',
      'Turn their back to the play and freeze in place'
    ],
    answer: 'Pre-scan, shoulder-check, and protect the puck with their body before making a play'
  },
  {
    question: 'Which habit helps a player stop missing passes?',
    options: [
      'Look at the receiver’s stick blade and scan the ice instead of staring at their own puck',
      'Keep their head down until they receive a pass',
      'Pass as soon as they see movement, even if no lane exists',
      'Only practice passes while completely stopped'
    ],
    answer: 'Look at the receiver’s stick blade and scan the ice instead of staring at their own puck'
  },
  {
    question: 'What is the most effective way to improve a player’s hockey IQ at U11?',
    options: [
      'Spend all practice time on one shooting drill',
      'Watch game film conceptually, focus on players without the puck, and play small-area games',
      'Only watch penalties and goals',
      'Skate as fast as possible without looking up'
    ],
    answer: 'Watch game film conceptually, focus on players without the puck, and play small-area games'
  }
];

const hockeyIqQuizContainer = document.getElementById('hockeyIqQuizApp');

if (hockeyIqQuizContainer) {
  let currentIndex = 0;
  let score = 0;
  const answered = new Set();

  const buildQuestion = () => {
    const question = hockeyIqQuizData[currentIndex];
    hockeyIqQuizContainer.innerHTML = '';

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
          ? 'Correct — that is a high-IQ read and exactly what elite U11 forwards do.'
          : `Not quite — the best answer is: ${question.answer}`;
        card.appendChild(result);

        const nextWrap = document.createElement('div');
        nextWrap.style.marginTop = '18px';
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'quiz-option';
        nextBtn.textContent = currentIndex === hockeyIqQuizData.length - 1 ? 'See score' : 'Next question';
        nextBtn.addEventListener('click', () => {
          if (currentIndex < hockeyIqQuizData.length - 1) {
            currentIndex += 1;
            buildQuestion();
          } else {
            const scoreText = document.createElement('div');
            scoreText.className = 'quiz-score';
            scoreText.innerHTML = `Score: <strong>${score}/${hockeyIqQuizData.length}</strong>`;
            hockeyIqQuizContainer.innerHTML = '';
            hockeyIqQuizContainer.appendChild(scoreText);
            const summary = document.createElement('div');
            summary.className = 'quiz-result visible';
            summary.textContent = score === hockeyIqQuizData.length
              ? 'Excellent. You understand the mental habits that separate a standard player from an elite Rep A1 forward.'
              : 'Strong start. Keep studying zone reads, support details, and the moment before the puck arrives.';
            hockeyIqQuizContainer.appendChild(summary);
          }
        });
        nextWrap.appendChild(nextBtn);
        card.appendChild(nextWrap);
      });

      optionGroup.appendChild(button);
    });

    card.appendChild(optionGroup);
    hockeyIqQuizContainer.appendChild(card);
  };

  buildQuestion();
}

const hockeySenseQuizData = [
  {
    question: 'What is the main job of a center at the U11 Rep A1 level?',
    options: [
      'Stay on the wall and wait for the puck every time',
      'Drive the play, control pace, and read the game before the puck arrives',
      'Only score goals from the slot',
      'Never support the defense behind the net'
    ],
    answer: 'Drive the play, control pace, and read the game before the puck arrives'
  },
  {
    question: 'What best describes a winger’s role in the offensive zone?',
    options: [
      'Chase the puck until the defense collapses',
      'Attack the wall, create separation, and attack the weak side with speed',
      'Stay at center ice and never support the boards',
      'Ignore all support plays and only pass at the blue line'
    ],
    answer: 'Attack the wall, create separation, and attack the weak side with speed'
  },
  {
    question: 'Why is hockey sense so important at the AAA/Rep A1 level?',
    options: [
      'Because the game is faster and players must read the play before it happens',
      'Because skating ability matters only in warmups',
      'Because defenders stop checking and only play the puck',
      'Because wingers should never move without the puck'
    ],
    answer: 'Because the game is faster and players must read the play before it happens'
  },
  {
    question: 'What is the correct skating sequence for an explosive start?',
    options: [
      'Glide, cross-over, curl, and stop',
      '3–4 quick steps, then accelerate into full stride',
      'Full speed immediately from a standstill with no stride count',
      'Backpedal before every burst'
    ],
    answer: '3–4 quick steps, then accelerate into full stride'
  },
  {
    question: 'When should a player use a longer, deeper stride?',
    options: [
      'During the top-speed cruise phase',
      'Only when they are stationary',
      'Every time they stop in the defensive zone',
      'Only when they are passing the puck'
    ],
    answer: 'During the top-speed cruise phase'
  },
  {
    question: 'What does the “evasive maneuver” phase require most?',
    options: [
      'A high center of gravity and a wide stance',
      'A low center of gravity and quick directional control',
      'A full stop and a hard turn into the boards',
      'A constant look back at the defender'
    ],
    answer: 'A low center of gravity and quick directional control'
  },
  {
    question: 'What is the purpose of a tight turn?',
    options: [
      'To instantly stop the play and reset',
      'To wrap around the net or loop back into the play while keeping momentum',
      'To skate directly into the corner and stop',
      'To make the defender move backward before contact'
    ],
    answer: 'To wrap around the net or loop back into the play while keeping momentum'
  },
  {
    question: 'Why is a punch turn effective against a defender behind you?',
    options: [
      'It creates a sudden, deceptive change of direction that can shake the checker',
      'It slows the skater down so the defender can close the gap',
      'It forces the defender to stand still',
      'It only works when the defender is facing the boards'
    ],
    answer: 'It creates a sudden, deceptive change of direction that can shake the checker'
  },
  {
    question: 'What is the best way to think about edge work at this age?',
    options: [
      'Speed alone wins every battle',
      'You need tight control and quick changes of direction to attack space and escape pressure',
      'The player with the biggest stride always wins the puck',
      'Turning only matters in the neutral zone'
    ],
    answer: 'You need tight control and quick changes of direction to attack space and escape pressure'
  },
  {
    question: 'Which habit best combines hockey sense and skating?',
    options: [
      'Skating as hard as possible without reading the play',
      'Reading the play, attacking the open lane, and changing direction with control',
      'Waiting for the defender to make the first move',
      'Always skating wide and never cutting to the middle'
    ],
    answer: 'Reading the play, attacking the open lane, and changing direction with control'
  }
];

const hockeySenseQuizContainer = document.getElementById('hockeySenseQuizApp');

if (hockeySenseQuizContainer) {
  let currentIndex = 0;
  let score = 0;
  const answered = new Set();

  const buildQuestion = () => {
    const question = hockeySenseQuizData[currentIndex];
    hockeySenseQuizContainer.innerHTML = '';

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
          ? 'Correct — that is the right read, timing, or skating concept.'
          : `Not quite — the best answer is: ${question.answer}`;
        card.appendChild(result);

        const nextWrap = document.createElement('div');
        nextWrap.style.marginTop = '18px';
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'quiz-option';
        nextBtn.textContent = currentIndex === hockeySenseQuizData.length - 1 ? 'See score' : 'Next question';
        nextBtn.addEventListener('click', () => {
          if (currentIndex < hockeySenseQuizData.length - 1) {
            currentIndex += 1;
            buildQuestion();
          } else {
            const scoreText = document.createElement('div');
            scoreText.className = 'quiz-score';
            scoreText.innerHTML = `Score: <strong>${score}/${hockeySenseQuizData.length}</strong>`;
            hockeySenseQuizContainer.innerHTML = '';
            hockeySenseQuizContainer.appendChild(scoreText);
            const summary = document.createElement('div');
            summary.className = 'quiz-result visible';
            summary.textContent = score === hockeySenseQuizData.length
              ? 'Excellent. You understand how hockey sense, skating mechanics, and edge work work together.'
              : 'Good read. Keep sharpening your footwork and scanning habits to finish the play faster.';
            hockeySenseQuizContainer.appendChild(summary);
          }
        });
        nextWrap.appendChild(nextBtn);
        card.appendChild(nextWrap);
      });

      optionGroup.appendChild(button);
    });

    card.appendChild(optionGroup);
    hockeySenseQuizContainer.appendChild(card);
  };

  buildQuestion();
}
