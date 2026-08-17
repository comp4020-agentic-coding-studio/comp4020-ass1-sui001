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

// Timeline — place the visitor's own reaction time among the other scales,
// and highlight whichever stage is currently in view while scrolling.

const STAGE_DURATIONS_MS: Record<string, number> = {
  "deep-time": 13_800_000_000 * 365.25 * 24 * 60 * 60 * 1000,
  galactic: 230_000_000 * 365.25 * 24 * 60 * 60 * 1000,
  geological: 5_000_000 * 365.25 * 24 * 60 * 60 * 1000,
  "plant-life": 12 * 60 * 60 * 1000,
  "slow-animals": 3_000,
  "venus-flytrap": 100,
  "fast-animals": 2.7,
  computing: 0.0000003,
};

function placeVisitorInTimeline() {
  const stored = localStorage.getItem(REACTION_STORAGE_KEY);
  const visitorLi = document.querySelector<HTMLElement>(
    '[data-testid="visitor-marker"]',
  );
  const durationEl = document.querySelector<HTMLElement>(
    '[data-testid="visitor-duration"]',
  );
  const stagesList = document.querySelector<HTMLElement>(
    '[data-testid="timeline-stages"]',
  );
  if (!stored || !visitorLi || !durationEl || !stagesList) return;

  const avgMs = Number(stored);
  durationEl.textContent = `~${avgMs.toFixed(0)} milliseconds (that's you)`;

  // Find the first stage slower than the visitor's own reaction time and
  // insert the visitor marker right before it — the list is already ordered
  // slowest to fastest.
  const otherStages = Array.from(
    stagesList.querySelectorAll<HTMLElement>("[data-stage]"),
  );
  const nextSlowerStage = otherStages.find((el) => {
    const duration = STAGE_DURATIONS_MS[el.dataset.stage ?? ""];
    return duration !== undefined && duration < avgMs;
  });

  if (nextSlowerStage) {
    stagesList.insertBefore(visitorLi, nextSlowerStage);
  } else {
    stagesList.appendChild(visitorLi);
  }
}

placeVisitorInTimeline();

// Powers-of-Ten-style zoom: each stage's icon scales up as it nears the
// centre of the viewport and shrinks away as you scroll past it, so images
// grow and shrink continuously as you move through them.
const timelineItems = document.querySelectorAll<HTMLElement>(
  '#timeline [data-stage], #timeline [data-testid="visitor-marker"]',
);

function updateTimelineZoom() {
  const viewportCenter = window.innerHeight / 2;
  for (const li of timelineItems) {
    const icon = li.querySelector<HTMLElement>(".stage-icon");
    if (!icon) continue;
    const rect = li.getBoundingClientRect();
    const stageCenter = rect.top + rect.height / 2;
    const distance = Math.abs(stageCenter - viewportCenter);
    const closeness = Math.max(0, 1 - distance / (window.innerHeight * 0.7));
    const scale = 0.5 + closeness * 1.5;
    icon.style.transform = `scale(${scale.toFixed(3)})`;
    li.dataset.active = String(closeness > 0.5);
  }
}

if (timelineItems.length) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateTimelineZoom();
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateTimelineZoom();
}
