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
