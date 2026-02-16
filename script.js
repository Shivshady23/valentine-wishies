/* Shared site configuration */
const herName = "Honey Shivang Kumar Chauhan";
const secretPassword = "2109";
const musicStateKey = "valentineMusicState";
const musicSyncIntervalMs = 1000;
const honeyModeStateKey = "honeyModeEnabled";
const honeyModeMessage = "You found the secret… just like you found my heart.";
const relationshipStart = new Date("2024-09-21T00:00:00");

const rainSymbols = ["💖", "💘", "💞", "❤"];
const finalRainSymbols = ["💖", "💘", "💗", "❤"];
const secondMs = 1000;
const minuteMs = secondMs * 60;
const hourMs = minuteMs * 60;
const dayMs = hourMs * 24;

let heartEngine = null;
let typewriterTimer = null;
let yesScale = 1;
let relationshipTimerInterval = null;
let miniHeartTimerInterval = null;
let finalRainTimer = null;
let musicCrescendoRaf = 0;

document.addEventListener("DOMContentLoaded", () => {
  applyDynamicText();
  setupHoneyModeShortcut();

  const requiresUnlock = document.body.dataset.requiresUnlock === "true";
  const unlocked = isUnlocked();

  if (requiresUnlock && !unlocked) {
    window.location.href = "index.html";
    return;
  }

  setupPasswordGate(unlocked);
  setupKissFeature();
  setupProposalFeature();
  setupRelationshipTimer();
  setupFinalSurprise();
  restoreHoneyMode();

  if (unlocked) {
    revealMainSite();
    startTypewriter();
    startMusic();
  }

  startFloatingHeartEngine();
  seedInitialHearts();
});

function isUnlocked() {
  return sessionStorage.getItem("valentineUnlocked") === "true";
}

function isHoneyModeEnabled() {
  return sessionStorage.getItem(honeyModeStateKey) === "true";
}

function applyDynamicText() {
  document.querySelectorAll("[data-her-name]").forEach((node) => {
    node.textContent = herName;
  });

  const proposalQuestion = document.getElementById("proposal-question");
  if (proposalQuestion) {
    proposalQuestion.textContent = `Will you be my Valentine, ${herName}?`;
  }
}

function setupHoneyModeShortcut() {
  document.addEventListener("keydown", (event) => {
    if (event.repeat || event.key.toLowerCase() !== "h") {
      return;
    }

    const activeTag = document.activeElement?.tagName?.toLowerCase() || "";
    if (activeTag === "input" || activeTag === "textarea" || activeTag === "select" || document.activeElement?.isContentEditable) {
      return;
    }

    activateHoneyMode();
  });
}

function restoreHoneyMode() {
  if (isHoneyModeEnabled()) {
    activateHoneyMode();
  }
}

function activateHoneyMode() {
  if (!document.body.classList.contains("honey-mode")) {
    document.body.classList.add("honey-mode");
  }

  sessionStorage.setItem(honeyModeStateKey, "true");
  applyHoneyModeMessage();
}

function applyHoneyModeMessage() {
  const existingTarget = document.querySelector("[data-secret-line]") || document.querySelector(".hero-subtitle");
  if (existingTarget) {
    existingTarget.textContent = honeyModeMessage;
    existingTarget.classList.add("secret-reveal-text");
    return;
  }

  const hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  const line = document.createElement("p");
  line.className = "hero-subtitle secret-reveal-text";
  line.setAttribute("data-secret-line", "true");
  line.textContent = honeyModeMessage;
  hero.appendChild(line);
}

function setupRelationshipTimer() {
  const section = document.getElementById("relationship-timer");
  if (!section || relationshipTimerInterval) {
    return;
  }

  const togetherNodes = {
    years: document.getElementById("together-years"),
    months: document.getElementById("together-months"),
    days: document.getElementById("together-days"),
    hours: document.getElementById("together-hours"),
    minutes: document.getElementById("together-minutes"),
    seconds: document.getElementById("together-seconds")
  };

  const anniversaryNodes = {
    days: document.getElementById("anniv-days"),
    hours: document.getElementById("anniv-hours"),
    minutes: document.getElementById("anniv-minutes"),
    seconds: document.getElementById("anniv-seconds")
  };

  const noteNode = document.getElementById("anniversary-note");
  const startDate = getSafeRelationshipStartDate();

  const updateCounters = () => {
    const now = new Date();

    const togetherTime = calculateTogetherDuration(startDate, now);
    renderTimerGroup(togetherNodes, togetherTime, true);

    const nextAnniversary = getNextAnniversaryDate(now, startDate);
    const untilAnniversary = calculateCountdown(now, nextAnniversary);
    renderTimerGroup(anniversaryNodes, untilAnniversary, false);
    updateAnniversaryNote(noteNode, untilAnniversary.days);
  };

  updateCounters();
  relationshipTimerInterval = setInterval(updateCounters, secondMs);
  startMiniTimerHearts(section);

  window.addEventListener(
    "pagehide",
    () => {
      clearInterval(relationshipTimerInterval);
      relationshipTimerInterval = null;
      stopMiniTimerHearts();
    },
    { once: true }
  );
}

function getSafeRelationshipStartDate() {
  // Keep the requested parser, with a fallback for inconsistent Date parsing behavior.
  if (Number.isNaN(relationshipStart.getTime())) {
    return new Date(2024, 8, 21, 0, 0, 0, 0);
  }

  return new Date(
    relationshipStart.getFullYear(),
    relationshipStart.getMonth(),
    relationshipStart.getDate(),
    relationshipStart.getHours(),
    relationshipStart.getMinutes(),
    relationshipStart.getSeconds(),
    relationshipStart.getMilliseconds()
  );
}

function calculateTogetherDuration(startDate, now) {
  if (now <= startDate) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  const cursor = new Date(startDate.getTime());
  let years = 0;
  let months = 0;

  // Calendar-aware stepping prevents month-length drift in year/month totals.
  while (addYears(cursor, 1) <= now) {
    cursor.setFullYear(cursor.getFullYear() + 1);
    years += 1;
  }

  while (addMonths(cursor, 1) <= now) {
    cursor.setMonth(cursor.getMonth() + 1);
    months += 1;
  }

  let remainingMs = now.getTime() - cursor.getTime();
  if (remainingMs < 0) {
    remainingMs = 0;
  }

  const days = Math.floor(remainingMs / dayMs);
  remainingMs -= days * dayMs;

  const hours = Math.floor(remainingMs / hourMs);
  remainingMs -= hours * hourMs;

  const minutes = Math.floor(remainingMs / minuteMs);
  remainingMs -= minutes * minuteMs;

  const seconds = Math.floor(remainingMs / secondMs);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds
  };
}

function getNextAnniversaryDate(now, startDate) {
  const anniversaryMonth = startDate.getMonth();
  const anniversaryDay = startDate.getDate();

  let target = new Date(now.getFullYear(), anniversaryMonth, anniversaryDay, 0, 0, 0, 0);
  if (now >= target) {
    target = new Date(now.getFullYear() + 1, anniversaryMonth, anniversaryDay, 0, 0, 0, 0);
  }

  return target;
}

function calculateCountdown(now, target) {
  let diffMs = target.getTime() - now.getTime();
  if (diffMs < 0) {
    diffMs = 0;
  }

  const days = Math.floor(diffMs / dayMs);
  diffMs -= days * dayMs;

  const hours = Math.floor(diffMs / hourMs);
  diffMs -= hours * hourMs;

  const minutes = Math.floor(diffMs / minuteMs);
  diffMs -= minutes * minuteMs;

  const seconds = Math.floor(diffMs / secondMs);

  return {
    days,
    hours,
    minutes,
    seconds
  };
}

function renderTimerGroup(nodes, values, includeYearMonth) {
  setTimerValue(nodes.days, values.days, false);
  setTimerValue(nodes.hours, values.hours, true);
  setTimerValue(nodes.minutes, values.minutes, true);
  setTimerValue(nodes.seconds, values.seconds, true);

  if (includeYearMonth) {
    setTimerValue(nodes.years, values.years, false);
    setTimerValue(nodes.months, values.months, false);
  }
}

function setTimerValue(node, value, padTwoDigits) {
  if (!node) {
    return;
  }

  const safeValue = Math.max(0, Math.floor(Number(value) || 0));
  const nextText = padTwoDigits ? String(safeValue).padStart(2, "0") : String(safeValue);

  if (node.textContent === nextText) {
    return;
  }

  node.textContent = nextText;
  node.classList.remove("tick-pulse");
  void node.offsetWidth;
  node.classList.add("tick-pulse");
}

function updateAnniversaryNote(noteNode, daysLeft) {
  if (!noteNode) {
    return;
  }

  let nextMessage = "Every second with you feels like my favorite memory 💞";
  if (daysLeft < 30) {
    nextMessage = `Anniversary is getting closer ${herName} 😘`;
  } else if (daysLeft > 100) {
    nextMessage = "Counting days until our next Anniversary 💕";
  }

  if (noteNode.textContent !== nextMessage) {
    noteNode.textContent = nextMessage;
  }
}

function startMiniTimerHearts(section) {
  const miniHeartHost = section.querySelector("#timer-mini-hearts");
  if (!miniHeartHost || miniHeartTimerInterval) {
    return;
  }

  for (let i = 0; i < 6; i += 1) {
    setTimeout(() => {
      spawnMiniTimerHeart(miniHeartHost);
    }, i * 210);
  }

  miniHeartTimerInterval = setInterval(() => {
    spawnMiniTimerHeart(miniHeartHost);
  }, 1100);
}

function stopMiniTimerHearts() {
  if (miniHeartTimerInterval) {
    clearInterval(miniHeartTimerInterval);
    miniHeartTimerInterval = null;
  }
}

function setupFinalSurprise() {
  const stage = document.getElementById("final-stage");
  const triggerButton = document.getElementById("final-surprise-btn");
  const overlay = document.getElementById("final-surprise-overlay");
  const messageNode = document.getElementById("final-message");
  const backButton = document.getElementById("final-overlay-back-btn");

  if (!stage || !triggerButton || !overlay || !messageNode) {
    return;
  }

  messageNode.textContent = `You are my forever, ${herName} 💍`;

  triggerButton.addEventListener("click", () => {
    if (stage.classList.contains("finale-started")) {
      return;
    }

    stage.classList.add("finale-started");
    triggerButton.disabled = true;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("finale-cinema");

    startFinalHeartRain();
    startMusicCrescendo();
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      const rainHost = document.getElementById("final-heart-rain");

      stopFinalSurpriseEffects();
      if (rainHost) {
        rainHost.replaceChildren();
      }

      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("finale-cinema");
      stage.classList.remove("finale-started");
      triggerButton.disabled = false;

      const music = document.getElementById("romantic-music");
      if (music) {
        music.volume = 0.2;
        persistMusicState(music);
      }
    });
  }

  window.addEventListener(
    "pagehide",
    () => {
      stopFinalSurpriseEffects();
    },
    { once: true }
  );
}

function startFinalHeartRain() {
  const host = document.getElementById("final-heart-rain");
  if (!host) {
    return;
  }

  stopFinalHeartRain();

  for (let i = 0; i < 12; i += 1) {
    setTimeout(() => {
      spawnFinalRainHeart(host);
    }, i * 150);
  }

  finalRainTimer = setInterval(() => {
    spawnFinalRainHeart(host);
  }, 320);
}

function stopFinalHeartRain() {
  if (finalRainTimer) {
    clearInterval(finalRainTimer);
    finalRainTimer = null;
  }
}

function spawnFinalRainHeart(host) {
  if (!host || host.childElementCount > 72) {
    return;
  }

  const heart = document.createElement("span");
  heart.className = "final-rain-heart";
  heart.textContent = finalRainSymbols[Math.floor(Math.random() * finalRainSymbols.length)];
  heart.style.left = `${randomBetween(2, 98).toFixed(2)}%`;
  heart.style.fontSize = `${randomBetween(14, 30).toFixed(1)}px`;
  heart.style.animationDuration = `${randomBetween(7.2, 12).toFixed(2)}s`;
  heart.style.opacity = `${randomBetween(0.42, 0.9).toFixed(2)}`;

  host.appendChild(heart);
  heart.addEventListener(
    "animationend",
    () => {
      heart.remove();
    },
    { once: true }
  );
}

function startMusicCrescendo() {
  const music = document.getElementById("romantic-music");
  if (!music) {
    return;
  }

  if (musicCrescendoRaf) {
    window.cancelAnimationFrame(musicCrescendoRaf);
    musicCrescendoRaf = 0;
  }

  const startVolume = Math.max(0.2, Number.isFinite(music.volume) ? music.volume : 0.2);
  const targetVolume = 0.85;
  const crescendoDurationMs = 9000;
  const startTime = performance.now();

  const playPromise = music.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      /* Ignore playback restrictions if user settings block media. */
    });
  }

  const step = (nowTs) => {
    const progress = Math.min(1, (nowTs - startTime) / crescendoDurationMs);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    music.volume = Math.min(1, startVolume + (targetVolume - startVolume) * easedProgress);

    if (progress < 1) {
      musicCrescendoRaf = window.requestAnimationFrame(step);
      return;
    }

    musicCrescendoRaf = 0;
    persistMusicState(music);
  };

  musicCrescendoRaf = window.requestAnimationFrame(step);
}

function stopFinalSurpriseEffects() {
  stopFinalHeartRain();

  if (musicCrescendoRaf) {
    window.cancelAnimationFrame(musicCrescendoRaf);
    musicCrescendoRaf = 0;
  }
}

function spawnMiniTimerHeart(host) {
  if (!host || host.childElementCount > 18) {
    return;
  }

  const heart = document.createElement("span");
  heart.className = "mini-timer-heart";
  heart.textContent = rainSymbols[Math.floor(Math.random() * rainSymbols.length)];
  heart.style.left = `${randomBetween(8, 92)}%`;
  heart.style.fontSize = `${randomBetween(10, 16).toFixed(1)}px`;
  heart.style.animationDuration = `${randomBetween(3.6, 5.8).toFixed(2)}s`;
  heart.style.setProperty("--rise-distance", `${randomBetween(110, 170).toFixed(0)}px`);
  heart.style.setProperty("--heart-alpha", `${randomBetween(0.32, 0.9).toFixed(2)}`);

  host.appendChild(heart);
  heart.addEventListener(
    "animationend",
    () => {
      heart.remove();
    },
    { once: true }
  );
}

function addYears(date, amount) {
  const result = new Date(date.getTime());
  result.setFullYear(result.getFullYear() + amount);
  return result;
}

function addMonths(date, amount) {
  const result = new Date(date.getTime());
  result.setMonth(result.getMonth() + amount);
  return result;
}

function setupPasswordGate(unlocked) {
  const unlockBtn = document.getElementById("unlock-btn");
  const passwordScreen = document.getElementById("password-screen");
  const passwordCard = document.getElementById("password-card");
  const passwordInput = document.getElementById("password-input");
  const passwordMessage = document.getElementById("password-message");

  if (!unlockBtn || !passwordInput || !passwordMessage) {
    return;
  }

  if (unlocked) {
    if (passwordScreen) {
      passwordScreen.classList.add("hidden");
    }
    revealMainSite();
    return;
  }

  unlockBtn.addEventListener("click", unlockSite);

  passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      unlockSite();
    }
  });

  if (passwordCard) {
    passwordCard.addEventListener("animationend", () => {
      passwordCard.classList.remove("shake");
    });
  }

  function unlockSite() {
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === secretPassword) {
      sessionStorage.setItem("valentineUnlocked", "true");
      passwordMessage.textContent = `Welcome ${herName} 💖`;

      if (passwordScreen) {
        passwordScreen.classList.add("hidden");
      }

      setTimeout(() => {
        revealMainSite();
      }, 180);

      startTypewriter();
      startMusic();
      return;
    }

    passwordMessage.textContent = `Oops ${herName}… try again 💕`;

    if (passwordCard) {
      passwordCard.classList.remove("shake");
      void passwordCard.offsetWidth;
      passwordCard.classList.add("shake");
    }

    passwordInput.focus();
    passwordInput.select();
  }
}

function revealMainSite() {
  const mainSite = document.getElementById("main-site");
  if (mainSite) {
    mainSite.classList.add("visible");
  }
}

function startTypewriter() {
  const loveLetterText = document.getElementById("love-letter-text");
  if (!loveLetterText) {
    return;
  }

  if (typewriterTimer) {
    clearInterval(typewriterTimer);
  }

  const letter = [
    `My dearest ${herName},`,
    "",
    "Every heartbeat of mine whispers your name.",
    "Since the day you entered my life, love has felt softer, brighter, and real.",
    "",
    "Thank you for every smile, every lesson, every little memory that became magic.",
    "I still choose you, in every universe, every day, forever.",
    "",
    "With all my love,",
    "Your forever valentine ❤️"
  ].join("\n");

  loveLetterText.textContent = "";
  let index = 0;

  typewriterTimer = setInterval(() => {
    loveLetterText.textContent += letter.charAt(index);
    index += 1;

    if (index >= letter.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }, 35);
}

function startMusic() {
  const music = document.getElementById("romantic-music");
  if (!music) {
    return;
  }

  music.volume = 0.2;
  music.loop = true;
  restoreMusicPosition(music);
  wireMusicPersistence(music);

  const playPromise = music.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      document.addEventListener(
        "click",
        () => {
          music.play().catch(() => {
            /* Ignore blocked autoplay retries. */
          });
          persistMusicState(music);
        },
        { once: true }
      );
    });
    playPromise.then(() => {
      persistMusicState(music);
    });
  }
}

function wireMusicPersistence(music) {
  const syncTimer = setInterval(() => {
    persistMusicState(music);
  }, musicSyncIntervalMs);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      persistMusicState(music);
    }
  });

  window.addEventListener(
    "pagehide",
    () => {
      persistMusicState(music);
      clearInterval(syncTimer);
    },
    { once: true }
  );

  document.querySelectorAll("a[href$='.html']").forEach((link) => {
    link.addEventListener("click", () => {
      persistMusicState(music);
    });
  });
}

function restoreMusicPosition(music) {
  const state = readMusicState();
  if (!state) {
    return;
  }

  let resumeTime = Number(state.currentTime) || 0;
  if (state.isPlaying && Number.isFinite(state.savedAt)) {
    resumeTime += (Date.now() - state.savedAt) / 1000;
  }

  const applyResumeTime = () => {
    if (Number.isFinite(music.duration) && music.duration > 0) {
      resumeTime %= music.duration;
    }

    try {
      music.currentTime = Math.max(0, resumeTime);
    } catch {
      /* Skip resume time if browser blocks early seek. */
    }
  };

  if (music.readyState >= 1) {
    applyResumeTime();
  } else {
    music.addEventListener("loadedmetadata", applyResumeTime, { once: true });
  }
}

function persistMusicState(music) {
  if (!music) {
    return;
  }

  const state = {
    currentTime: Number.isFinite(music.currentTime) ? music.currentTime : 0,
    isPlaying: !music.paused && !music.ended,
    savedAt: Date.now()
  };

  sessionStorage.setItem(musicStateKey, JSON.stringify(state));
}

function readMusicState() {
  const raw = sessionStorage.getItem(musicStateKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setupKissFeature() {
  const kissBtn = document.getElementById("kiss-btn");
  if (!kissBtn) {
    return;
  }

  kissBtn.addEventListener("click", () => {
    kissBtn.classList.remove("pulse");
    void kissBtn.offsetWidth;
    kissBtn.classList.add("pulse");

    const rect = kissBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createHeartExplosion(x, y, 18);
    createKissToast(`Mwahhh ${herName} 💖`, x, y - 10);
  });
}

function setupProposalFeature() {
  const proposalButtons = document.getElementById("proposal-buttons");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const yesOverlay = document.getElementById("yes-overlay");
  const yesOverlayBackBtn = document.getElementById("yes-overlay-back-btn");

  if (!proposalButtons || !yesBtn || !noBtn) {
    return;
  }

  const maxYesScale = 2.8;
  yesScale = 1;

  noBtn.addEventListener("click", () => {
    yesScale = Math.min(yesScale + 0.18, maxYesScale);
    yesBtn.style.transform = `scale(${yesScale.toFixed(2)})`;

    if (yesScale >= maxYesScale) {
      noBtn.style.display = "none";
      noBtn.disabled = true;
      return;
    }

    const containerRect = proposalButtons.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(18, (containerRect.width - noRect.width) / 2 - 8);
    const maxY = Math.max(18, (containerRect.height - noRect.height) / 2 - 8);

    const shiftX = randomBetween(-maxX, maxX);
    const shiftY = randomBetween(-maxY, maxY);

    noBtn.style.transform = `translate(${shiftX.toFixed(0)}px, ${shiftY.toFixed(0)}px)`;
  });

  yesBtn.addEventListener("click", () => {
    proposalButtons.classList.add("locked");
    yesBtn.disabled = true;
    noBtn.disabled = true;

    if (yesOverlay) {
      yesOverlay.classList.add("show");
      yesOverlay.setAttribute("aria-hidden", "false");
    }

    createHeartRain(130);
  });

  if (yesOverlay && yesOverlayBackBtn) {
    yesOverlayBackBtn.addEventListener("click", () => {
      yesOverlay.classList.remove("show");
      yesOverlay.setAttribute("aria-hidden", "true");
    });
  }
}

function startFloatingHeartEngine() {
  const host = document.getElementById("floating-hearts");
  if (!host || heartEngine) {
    return;
  }

  heartEngine = createHeartCanvasEngine(host);
  heartEngine.start();

  window.addEventListener(
    "pagehide",
    () => {
      if (heartEngine) {
        heartEngine.destroy();
        heartEngine = null;
      }
    },
    { once: true }
  );
}

function seedInitialHearts() {
  if (!heartEngine) {
    return;
  }

  heartEngine.seed(12);
}

function createHeartCanvasEngine(host) {
  const canvas = document.createElement("canvas");
  canvas.className = "heart-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.replaceChildren(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      start() {},
      seed() {},
      destroy() {}
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const petalColors = ["#ef5f8f", "#f777a0", "#ff99ba", "#ffd2df"];
  const heartColors = ["#ff4f8b", "#ff78a7", "#ffc1d8"];
  const petalSprites = petalColors.map((color, index) => createPetalSprite(color, index));
  const heartSprites = heartColors.map((color) => createHeartSprite(color));

  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = 0;
  let lastTime = 0;
  let spawnAccumulator = 0;

  const maxParticles = reducedMotion ? 28 : 90;
  const spawnRate = reducedMotion ? 2.4 : 11;

  function resizeCanvas() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnParticle(seedOffset = 0, forcePetal = false) {
    if (particles.length >= maxParticles) {
      return;
    }

    const isPetal = forcePetal || Math.random() < 0.82;
    const wobblePhase = randomBetween(0, Math.PI * 2);

    if (isPetal) {
      particles.push({
        kind: "petal",
        x: randomBetween(0, width),
        y: -randomBetween(20, 170) + seedOffset,
        vx: randomBetween(-9, 9),
        vy: randomBetween(24, 54),
        direction: 1,
        wobblePhase,
        wobbleSpeed: randomBetween(0.7, 1.45),
        wobbleAmp: randomBetween(10, 28),
        size: randomBetween(14, 30),
        rotation: randomBetween(-0.6, 0.6),
        rotationSpeed: randomBetween(-1.2, 1.2),
        alpha: randomBetween(0.4, 0.88),
        fadeRate: randomBetween(0.02, 0.05),
        sprite: petalSprites[Math.floor(Math.random() * petalSprites.length)]
      });
      return;
    }

    particles.push({
      kind: "heart",
      x: randomBetween(0, width),
      y: height + randomBetween(16, 120) + seedOffset,
      vx: randomBetween(-7, 7),
      vy: randomBetween(20, 44),
      direction: -1,
      wobblePhase,
      wobbleSpeed: randomBetween(0.7, 1.6),
      wobbleAmp: randomBetween(8, 18),
      size: randomBetween(14, 30),
      rotation: randomBetween(-0.25, 0.25),
      rotationSpeed: randomBetween(-0.5, 0.5),
      alpha: randomBetween(0.38, 0.72),
      fadeRate: randomBetween(0.04, 0.09),
      sprite: heartSprites[Math.floor(Math.random() * heartSprites.length)]
    });
  }

  function update(deltaSeconds) {
    spawnAccumulator += deltaSeconds * spawnRate;
    const burstCount = Math.min(3, Math.floor(spawnAccumulator));
    spawnAccumulator -= burstCount;

    for (let i = 0; i < burstCount; i += 1) {
      spawnParticle();
    }

    const nextParticles = [];
    for (const particle of particles) {
      particle.wobblePhase += particle.wobbleSpeed * deltaSeconds;
      particle.x += (particle.vx + Math.sin(particle.wobblePhase) * particle.wobbleAmp) * deltaSeconds;
      particle.y += particle.direction * particle.vy * deltaSeconds;
      particle.rotation += particle.rotationSpeed * deltaSeconds;
      particle.alpha -= particle.fadeRate * deltaSeconds;

      const withinHorizontalBounds = particle.x > -120 && particle.x < width + 120;
      const withinVerticalBounds =
        particle.kind === "petal"
          ? particle.y < height + 120
          : particle.y > -120;

      if (particle.alpha > 0 && withinHorizontalBounds && withinVerticalBounds) {
        nextParticles.push(particle);
      }
    }

    particles = nextParticles;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, particle.alpha);
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.drawImage(particle.sprite, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();
    }
  }

  function frame(timeStamp) {
    if (!lastTime) {
      lastTime = timeStamp;
    }

    const deltaSeconds = Math.min((timeStamp - lastTime) / 1000, 0.033);
    lastTime = timeStamp;

    update(deltaSeconds);
    render();
    rafId = window.requestAnimationFrame(frame);
  }

  function start() {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    rafId = window.requestAnimationFrame(frame);
  }

  function seed(count) {
    for (let i = 0; i < count; i += 1) {
      spawnParticle(randomBetween(-200, 30), true);
    }
  }

  function destroy() {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resizeCanvas);
    particles = [];
    host.replaceChildren();
  }

  return {
    start,
    seed,
    destroy
  };
}

function createPetalSprite(color, variantIndex) {
  const spriteSize = 72;
  const sprite = document.createElement("canvas");
  sprite.width = spriteSize;
  sprite.height = spriteSize;

  const ctx = sprite.getContext("2d");
  if (!ctx) {
    return sprite;
  }

  const skew = (variantIndex - 1.5) * 0.08;

  ctx.translate(spriteSize / 2, spriteSize / 2 - 2);
  ctx.shadowColor = "rgba(255, 108, 154, 0.45)";
  ctx.shadowBlur = 8;

  const fill = ctx.createLinearGradient(0, -26, 0, 30);
  fill.addColorStop(0, "#ffeaf2");
  fill.addColorStop(1, color);
  ctx.fillStyle = fill;

  drawPetalPath(ctx, 20, skew);
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255, 223, 236, 0.55)";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.quadraticCurveTo(-3 + skew * 16, 2, 0, 20);
  ctx.stroke();

  return sprite;
}

function createHeartSprite(color) {
  const spriteSize = 64;
  const sprite = document.createElement("canvas");
  sprite.width = spriteSize;
  sprite.height = spriteSize;

  const ctx = sprite.getContext("2d");
  if (!ctx) {
    return sprite;
  }

  ctx.translate(spriteSize / 2, spriteSize / 2 - 2);
  ctx.shadowColor = "rgba(255, 84, 148, 0.45)";
  ctx.shadowBlur = 10;

  const fill = ctx.createLinearGradient(0, -24, 0, 30);
  fill.addColorStop(0, "#ffe5ef");
  fill.addColorStop(1, color);
  ctx.fillStyle = fill;

  drawHeartPath(ctx, 18);
  ctx.fill();

  return sprite;
}

function drawPetalPath(ctx, radius, skew) {
  ctx.beginPath();
  ctx.moveTo(0, -radius * 1.08);
  ctx.bezierCurveTo(
    radius * (0.82 + skew),
    -radius * 0.78,
    radius * (1.04 + skew),
    radius * 0.2,
    0,
    radius * 1.18
  );
  ctx.bezierCurveTo(
    -radius * (1.04 - skew),
    radius * 0.2,
    -radius * (0.82 - skew),
    -radius * 0.78,
    0,
    -radius * 1.08
  );
  ctx.closePath();
}

function drawHeartPath(ctx, radius) {
  ctx.beginPath();
  ctx.moveTo(0, radius * 0.45);
  ctx.bezierCurveTo(radius * 0.95, -radius * 0.45, radius * 1.25, radius * 0.55, 0, radius * 1.35);
  ctx.bezierCurveTo(-radius * 1.25, radius * 0.55, -radius * 0.95, -radius * 0.45, 0, radius * 0.45);
  ctx.closePath();
}

function createHeartExplosion(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const distance = 35 + Math.random() * 95;

    heart.className = "burst-heart";
    heart.textContent = rainSymbols[Math.floor(Math.random() * rainSymbols.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heart.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);

    document.body.appendChild(heart);
    heart.addEventListener(
      "animationend",
      () => {
        heart.remove();
      },
      { once: true }
    );
  }
}

function createKissToast(text, x, y) {
  const toast = document.createElement("div");
  toast.className = "kiss-toast";
  toast.textContent = text;
  toast.style.left = `${x}px`;
  toast.style.top = `${y}px`;

  document.body.appendChild(toast);
  toast.addEventListener(
    "animationend",
    () => {
      toast.remove();
    },
    { once: true }
  );
}

function createHeartRain(count) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    const duration = 2 + Math.random() * 2.2;
    const delay = Math.random() * 1.4;

    heart.className = "rain-heart";
    heart.textContent = rainSymbols[Math.floor(Math.random() * rainSymbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${12 + Math.random() * 24}px`;
    heart.style.animationDuration = `${duration.toFixed(2)}s`;
    heart.style.animationDelay = `${delay.toFixed(2)}s`;

    document.body.appendChild(heart);

    const totalLifetime = (duration + delay) * 1000 + 200;
    setTimeout(() => {
      heart.remove();
    }, totalLifetime);
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
