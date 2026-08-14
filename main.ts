// Speed of Thought — reaction-time dot test.
// Rounds get faster as you go; each reaction time feeds the running stats,
// and the average (in localStorage) is what the timeline section will later
// use to place you against deep time, geology, and the rest.

const readout = document.querySelector<HTMLElement>(
  '[data-testid="reaction-readout"]',
);
const startButton = document.querySelector<HTMLButtonElement>(
  '[data-testid="start-button"]',
);
const playField = document.querySelector<HTMLElement>(
  '[data-testid="play-field"]',
);
const dot = document.querySelector<HTMLButtonElement>(
  '[data-testid="dot-target"]',
);

const TOTAL_ROUNDS = 8;
const START_DELAY_MS = 1400;
const MIN_DELAY_MS = 350;
const REACTION_STORAGE_KEY = "speedOfThought.avgReactionMs";

const TAUNTS = [
  "Was that a flinch? Try again.",
  "A sundial could do better.",
  "Now we're talking.",
  "Suspiciously fast. We're watching you.",
  "The dot regrets nothing.",
];

let round = 0;
let times: number[] = [];
let dotShownAt = 0;
let spawnTimer: number | undefined;

function delayForRound(n: number): number {
  const t = n / TOTAL_ROUNDS;
  return Math.max(MIN_DELAY_MS, START_DELAY_MS - t * (START_DELAY_MS - MIN_DELAY_MS));
}

function randomPosition() {
  if (!playField || !dot) return { x: 0, y: 0 };
  const fieldRect = playField.getBoundingClientRect();
  const size = dot.offsetWidth || 48;
  const x = Math.random() * Math.max(0, fieldRect.width - size);
  const y = Math.random() * Math.max(0, fieldRect.height - size);
  return { x, y };
}

function setReadout(text: string) {
  if (readout) readout.textContent = text;
}

function spawnDot() {
  if (!dot) return;
  const { x, y } = randomPosition();
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  dot.hidden = false;
  dotShownAt = performance.now();
}

function scheduleNextDot() {
  const delay = delayForRound(round) * (0.5 + Math.random());
  spawnTimer = window.setTimeout(spawnDot, delay);
}

function finish() {
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  localStorage.setItem(REACTION_STORAGE_KEY, String(avg));
  setReadout(
    `Done. Average reaction time: ${avg.toFixed(0)}ms across ${times.length} rounds. ` +
      `Scroll on to see how that stacks up against literally everything else.`,
  );
  if (startButton) {
    startButton.textContent = "Run it again";
    startButton.hidden = false;
  }
}

function onDotClick() {
  if (!dot) return;
  const reaction = performance.now() - dotShownAt;
  times.push(reaction);
  dot.hidden = true;
  round += 1;

  const taunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
  setReadout(`Round ${round}/${TOTAL_ROUNDS}: ${reaction.toFixed(0)}ms. ${taunt}`);

  if (round >= TOTAL_ROUNDS) {
    finish();
  } else {
    scheduleNextDot();
  }
}

function startGame() {
  round = 0;
  times = [];
  window.clearTimeout(spawnTimer);
  if (startButton) startButton.hidden = true;
  setReadout("Get ready...");
  scheduleNextDot();
}

dot?.addEventListener("click", onDotClick);
startButton?.addEventListener("click", startGame);
