"use strict";

const SOUND_LEVELS = {
  ш: {
    room: "Шуршащий сад",
    theme: "сад",
    items: [
      { word: "шишка", emoji: "🌰", x: 21, y: 29 },
      { word: "шмель", emoji: "🐝", x: 45, y: 24 },
      { word: "шалаш", emoji: "⛺", x: 72, y: 31 },
      { word: "гриб", emoji: "🍄", x: 31, y: 54 },
      { word: "лист", emoji: "🍃", x: 61, y: 53 },
      { word: "цветок", emoji: "🌼", x: 82, y: 61 },
      { word: "яблоко", emoji: "🍎", x: 19, y: 72 },
      { word: "улитка", emoji: "🐌", x: 53, y: 75 },
    ],
  },
  ж: {
    room: "Жужжащая поляна",
    theme: "цветочная поляна",
    items: [
      { word: "жук", emoji: "🪲", x: 19, y: 30 },
      { word: "жаба", emoji: "🐸", x: 45, y: 25 },
      { word: "жёлудь", emoji: "🌰", x: 72, y: 31 },
      { word: "шмель", emoji: "🐝", x: 30, y: 54 },
      { word: "бабочка", emoji: "🦋", x: 59, y: 53 },
      { word: "ромашка", emoji: "🌼", x: 82, y: 61 },
      { word: "улитка", emoji: "🐌", x: 20, y: 72 },
      { word: "трава", emoji: "🌱", x: 53, y: 75 },
    ],
  },
  ч: {
    room: "Чудесный чердак",
    theme: "чердак со старыми вещами",
    items: [
      { word: "часы", emoji: "🕰️", x: 20, y: 30 },
      { word: "чемодан", emoji: "🧳", x: 45, y: 25 },
      { word: "свеча", emoji: "🕯️", x: 72, y: 31 },
      { word: "сундучок", emoji: "🧰", x: 30, y: 54 },
      { word: "книга", emoji: "📚", x: 59, y: 53 },
      { word: "фонарь", emoji: "🏮", x: 82, y: 61 },
      { word: "кукла", emoji: "🪆", x: 20, y: 72 },
      { word: "шляпа", emoji: "🎩", x: 53, y: 75 },
    ],
  },
  щ: {
    room: "Щучье озеро",
    theme: "озеро и его берег",
    items: [
      { word: "щука", emoji: "🐟", x: 20, y: 30 },
      { word: "лещ", emoji: "🐠", x: 45, y: 25 },
      { word: "щепка", emoji: "🪵", x: 72, y: 31 },
      { word: "камыш", emoji: "🎋", x: 30, y: 54 },
      { word: "лодка", emoji: "🛶", x: 59, y: 53 },
      { word: "волна", emoji: "🌊", x: 82, y: 61 },
      { word: "песок", emoji: "🏖️", x: 20, y: 72 },
      { word: "берег", emoji: "🪨", x: 53, y: 75 },
    ],
  },
};

const OBJECT_MODELS = {
  шишка: { shape: "pinecone", color: "#92552e" },
  шмель: { shape: "bee", color: "#e6b83f" },
  шалаш: { shape: "tent", color: "#6d9c67" },
  гриб: { shape: "mushroom", color: "#d97950" },
  лист: { shape: "leaf", color: "#70b76c" },
  цветок: { shape: "flower", color: "#e5a5bb" },
  яблоко: { shape: "apple", color: "#dc6657" },
  улитка: { shape: "snail", color: "#d8a969" },
  жук: { shape: "beetle", color: "#4b9b67" },
  жаба: { shape: "frog", color: "#72b852" },
  жёлудь: { shape: "acorn", color: "#a67545" },
  бабочка: { shape: "butterfly", color: "#aa85cb" },
  ромашка: { shape: "daisy", color: "#f0e2b9" },
  трава: { shape: "grass", color: "#72b76b" },
  часы: { shape: "clock", color: "#d5a35b" },
  чемодан: { shape: "suitcase", color: "#9d704b" },
  свеча: { shape: "candle", color: "#e4c881" },
  сундучок: { shape: "chest", color: "#a56c43" },
  книга: { shape: "book", color: "#6485a4" },
  фонарь: { shape: "lantern", color: "#d98a50" },
  кукла: { shape: "doll", color: "#d998a8" },
  шляпа: { shape: "hat", color: "#795c91" },
  щука: { shape: "fish", color: "#4e9bb0" },
  лещ: { shape: "fish", color: "#80a5ad" },
  щепка: { shape: "wood", color: "#ae8257" },
  камыш: { shape: "reed", color: "#80a963" },
  лодка: { shape: "boat", color: "#c78650" },
  волна: { shape: "wave", color: "#438fbd" },
  песок: { shape: "sand", color: "#d9c17b" },
  берег: { shape: "stone", color: "#84968a" },
};

function objectModelMarkup(item) {
  const model = OBJECT_MODELS[item.word];
  if (!model) throw new RangeError(`Неизвестная модель предмета: ${item.word}`);
  return `<span class="object-model model-${model.shape}" style="--model-color:${model.color}" aria-hidden="true">
    <span class="model-shell"><span class="model-mark">${item.emoji}</span></span>
  </span>`;
}

function containsTargetSound(word, sound) {
  if (typeof word !== "string" || typeof sound !== "string" || !sound.trim()) return false;
  return word.toLocaleLowerCase("ru").includes(sound.toLocaleLowerCase("ru"));
}

function createRound(sound) {
  const level = SOUND_LEVELS[sound];
  if (!level) throw new RangeError(`Неизвестный звук: ${sound}`);
  return {
    status: "playing",
    sound,
    items: level.items.map((item) => ({ ...item })),
    index: 0,
    score: 0,
    correct: null,
  };
}

function answerItem(round, guess, itemIndex = round.index) {
  if (
    round.status !== "playing"
    || typeof guess !== "boolean"
    || !Number.isInteger(itemIndex)
    || itemIndex < 0
    || itemIndex >= round.items.length
  ) return round;
  const item = round.items[itemIndex];
  const correct = containsTargetSound(item.word, round.sound) === guess;
  return {
    ...round,
    status: "feedback",
    score: round.score + Number(correct),
    correct,
    answeredIndex: itemIndex,
  };
}

function continueRound(round) {
  if (round.status !== "feedback") return round;
  if (round.index === round.items.length - 1) return { ...round, status: "complete" };
  return { ...round, status: "playing", index: round.index + 1, correct: null };
}

const soundAdventure = { SOUND_LEVELS, OBJECT_MODELS, objectModelMarkup, containsTargetSound, createRound, answerItem, continueRound };
if (typeof module !== "undefined" && module.exports) {
  module.exports = soundAdventure;
} else {
  globalThis.SoundAdventure = soundAdventure;
}

if (typeof document !== "undefined") {
  const soundList = document.querySelector("#sound-list");
  const introScreen = document.querySelector("#intro-screen");
  const playScreen = document.querySelector("#play-screen");
  const finishScreen = document.querySelector("#finish-screen");
  const startButton = document.querySelector("#start-button");
  const chooseSoundButton = document.querySelector("#choose-sound-button");
  const fullscreenButton = document.querySelector("#fullscreen-button");
  const soundChoices = Object.keys(SOUND_LEVELS);
  const soundNames = { ш: "Ш", ж: "Ж", ч: "Ч", щ: "Щ" };
  const interactionRange = 11;
  const feedbackDelay = 1600;
  let selectedSound = "ш";
  let round = null;
  let player = { x: 50, y: 86 };
  let focusedItemIndex = null;
  let answered = new Set();
  let advanceTimer = null;
  let speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  function speak(text) {
    if (!speechSupported) {
      document.querySelector("#stage-hint").textContent = "В этом браузере нет озвучки. Прочитай слово вслух!";
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = 0.82;
    utterance.pitch = 1.04;
    window.speechSynthesis.speak(utterance);
  }

  function renderSoundChoices() {
    soundList.innerHTML = soundChoices.map((sound) => `
      <button class="sound-choice" type="button" data-sound="${sound}" aria-pressed="${sound === selectedSound}">
        <span class="sound-letter">${soundNames[sound]}</span><span class="sound-room">${SOUND_LEVELS[sound].room}</span>
      </button>`).join("");
  }

  function showScreen(screen) {
    introScreen.hidden = screen !== "intro";
    playScreen.hidden = screen !== "play";
    finishScreen.hidden = screen !== "finish";
  }

  function startRound(sound) {
    clearTimeout(advanceTimer);
    advanceTimer = null;
    selectedSound = sound;
    round = createRound(sound);
    player = { x: 50, y: 86 };
    focusedItemIndex = null;
    answered = new Set();
    document.querySelector("#room-title").textContent = `Звук ${soundNames[sound]}`;
    document.querySelector("#level-label").textContent = `ЛОКАЦИЯ ${soundChoices.indexOf(sound) + 1} ИЗ ${soundChoices.length} · ${SOUND_LEVELS[sound].room.toLocaleUpperCase("ru")}`;
    document.querySelector("#target-sound").textContent = soundNames[sound];
    document.querySelector("#yes-sound").textContent = soundNames[sound];
    document.querySelector("#no-sound").textContent = soundNames[sound];
    const stage = document.querySelector("#stage");
    stage.classList.remove("location-sh", "location-zh", "location-ch", "location-shch");
    const locationClass = { ш: "sh", ж: "zh", ч: "ch", щ: "shch" }[sound];
    stage.classList.add(`location-${locationClass}`);
    stage.setAttribute("aria-label", `${SOUND_LEVELS[sound].room}: иллюстрированная 2D-локация`);
    document.querySelector("#room-instruction").textContent =
      `Исследуй локацию «${SOUND_LEVELS[sound].room}»! Подойди к предмету, чтобы узнать его название.`;
    document.querySelector("#answer-card").hidden = true;
    document.querySelector("#stage-hint").textContent = "Ищи предметы в локации!";
    showScreen("play");
    renderRound();
  }

  function renderRound() {
    const objects = document.querySelector("#objects");
    objects.innerHTML = round.items.map((item, index) => `
      <button class="object-button${answered.has(index) ? " is-found" : ""}" type="button"
        data-item-index="${index}" aria-label="Предмет ${item.word}" style="left:${item.x}%;top:${item.y}%">
        ${objectModelMarkup(item)}
        <span class="object-name">${item.word}</span>
      </button>`).join("");
    updatePlayer();
    updateProgress();
  }

  function updatePlayer() {
    const avatar = document.querySelector("#player");
    avatar.style.left = `${player.x}%`;
    avatar.style.top = `${player.y}%`;
    const activeItems = round.items.map((item, index) => ({ item, index }))
      .filter(({ index }) => !answered.has(index));
    const stage = document.querySelector("#stage");
    const horizontalScale = stage.clientWidth / stage.clientHeight;
    const closest = activeItems
      .map(({ item, index }) => ({
        index,
        item,
        distance: Math.hypot((item.x - player.x) * horizontalScale, item.y - player.y),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    const isNear = closest && closest.distance <= interactionRange;
    const nearbyCard = document.querySelector("#nearby-card");
    nearbyCard.hidden = !isNear;
    document.querySelector("#distance-hint").textContent = isNear
      ? `Рядом: ${closest.item.word}`
      : "Подойди к любому предмету";
    document.querySelectorAll(".object-button").forEach((button) => {
      const index = Number(button.dataset.itemIndex);
      button.classList.toggle("is-near", Boolean(isNear && index === closest.index));
      button.style.zIndex = String(Math.round(round.items[index].y * 10));
    });
    document.querySelectorAll(".garden-tree").forEach((tree) => {
      const depth = parseFloat(getComputedStyle(tree).top) / stage.clientHeight * 100;
      tree.style.zIndex = String(Math.round(depth * 10));
    });
    avatar.style.zIndex = String(Math.round(player.y * 10 + 1));
    if (isNear) {
      document.querySelector("#nearby-name").textContent = `Нашёл: ${closest.item.word}`;
      document.querySelector("#nearby-button").dataset.itemIndex = String(closest.index);
    }
  }

  function updateProgress() {
    const done = answered.size;
    document.querySelector("#progress-copy").textContent = `Предмет ${Math.min(round.index + 1, round.items.length)} из ${round.items.length}`;
    document.querySelector("#score-copy").textContent = `⭐ ${round.score}`;
    document.querySelector("#progress-fill").style.width = `${done / round.items.length * 100}%`;
    document.querySelector("#progress-track").setAttribute("aria-valuenow", String(done));
  }

  function move(direction) {
    if (!round || round.status !== "playing" || !document.querySelector("#answer-card").hidden) return;
    const step = 5;
    if (direction === "up") player.y -= step;
    if (direction === "down") player.y += step;
    if (direction === "left") player.x -= step;
    if (direction === "right") player.x += step;
    player.x = Math.min(93, Math.max(7, player.x));
    player.y = Math.min(88, Math.max(16, player.y));
    updatePlayer();
  }

  function openQuestion(index) {
    if (answered.has(index) || round.status !== "playing") return;
    const item = round.items[index];
    const card = document.querySelector("#answer-card");
    focusedItemIndex = index;
    document.querySelector("#answer-object").innerHTML = objectModelMarkup(item);
    document.querySelector("#question-title").textContent = `Это ${item.word}. Есть в слове звук ${soundNames[round.sound]}?`;
    document.querySelector("#feedback").hidden = true;
    document.querySelector("#feedback").classList.remove("is-wrong");
    document.querySelector("#answer-buttons").hidden = false;
    document.querySelector("#close-answer").hidden = false;
    document.querySelector("#listen-word").dataset.word = item.word;
    card.hidden = false;
    document.querySelector("#stage-hint").textContent = `Слушай слово «${item.word}» и выбери ответ.`;
    card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    speak(item.word);
  }

  function submitAnswer(hasSound) {
    if (focusedItemIndex === null || round.status !== "playing") return;
    round = answerItem(round, hasSound, focusedItemIndex);
    answered.add(focusedItemIndex);
    const item = round.items[focusedItemIndex];
    const hasTarget = containsTargetSound(item.word, round.sound);
    const feedback = document.querySelector("#feedback");
    feedback.hidden = false;
    feedback.classList.toggle("is-wrong", !round.correct);
    feedback.textContent = round.correct
      ? `Верно! В слове «${item.word}» ${hasTarget ? `есть звук ${soundNames[round.sound]}` : `нет звука ${soundNames[round.sound]}`}.`
      : `Не совсем. В слове «${item.word}» ${hasTarget ? `есть звук ${soundNames[round.sound]}` : `нет звука ${soundNames[round.sound]}`}.`;
    document.querySelector("#answer-buttons").hidden = true;
    document.querySelector("#close-answer").hidden = true;
    updateProgress();
    updatePlayer();
    const answeredRound = round;
    advanceTimer = setTimeout(() => {
      if (round !== answeredRound || round.status !== "feedback") return;
      advanceTimer = null;
      advanceRound();
    }, feedbackDelay);
  }

  function advanceRound() {
    if (!round || round.status !== "feedback") return;
    round = continueRound(round);
    focusedItemIndex = null;
    document.querySelector("#answer-card").hidden = true;
    if (round.status === "complete") {
      finishRound();
      return;
    }
    document.querySelector("#stage-hint").textContent = "Ищи следующий предмет!";
    renderRound();
  }

  function finishRound() {
    document.querySelector("#finish-title").textContent = round.score >= 6 ? "Звуковой сыщик!" : "Локация исследована!";
    document.querySelector("#finish-copy").textContent = `Ты нашёл ${round.score} правильных ответов из ${round.items.length}. Звук ${soundNames[round.sound]} больше не спрячется!`;
    const nextSound = soundChoices[(soundChoices.indexOf(round.sound) + 1) % soundChoices.length];
    document.querySelector("#next-sound-button").textContent = `Искать звук ${soundNames[nextSound]} →`;
    document.querySelector("#next-sound-button").dataset.sound = nextSound;
    showScreen("finish");
  }

  soundList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sound]");
    if (!button) return;
    selectedSound = button.dataset.sound;
    renderSoundChoices();
  });
  startButton.addEventListener("click", () => startRound(selectedSound));
  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === playScreen) {
        await document.exitFullscreen();
      } else if (playScreen.requestFullscreen) {
        await playScreen.requestFullscreen();
      } else {
        document.querySelector("#stage-hint").textContent = "Полноэкранный режим не поддерживается этим браузером.";
      }
    } catch (error) {
      document.querySelector("#stage-hint").textContent = `Не удалось включить полный экран: ${error.message}`;
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const isFullscreen = document.fullscreenElement === playScreen;
    fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
    fullscreenButton.setAttribute("aria-label", isFullscreen ? "Выйти из полного экрана" : "На весь экран");
    fullscreenButton.querySelector("span").textContent = isFullscreen ? "Обычный экран" : "На весь экран";
  });
  chooseSoundButton.addEventListener("click", () => {
    clearTimeout(advanceTimer);
    advanceTimer = null;
    showScreen("intro");
    renderSoundChoices();
  });
  document.querySelector("#restart-button").addEventListener("click", () => {
    clearTimeout(advanceTimer);
    advanceTimer = null;
    selectedSound = "ш";
    renderSoundChoices();
    showScreen("intro");
  });
  document.querySelector("#next-sound-button").addEventListener("click", (event) => startRound(event.currentTarget.dataset.sound));
  document.querySelector("#listen-target").addEventListener("click", () => speak(`Звук ${soundNames[round.sound]}`));
  document.querySelector("#listen-word").addEventListener("click", (event) => speak(event.currentTarget.dataset.word));
  document.querySelector("#objects").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-item-index]");
    if (!button) return;
    const index = Number(button.dataset.itemIndex);
    const item = round.items[index];
    const horizontalScale = document.querySelector("#stage").clientWidth / document.querySelector("#stage").clientHeight;
    const distance = Math.hypot((item.x - player.x) * horizontalScale, item.y - player.y);
    if (distance > interactionRange) {
      document.querySelector("#stage-hint").textContent = `Иди поближе к предмету «${item.word}».`;
      return;
    }
    openQuestion(index);
  });
  document.querySelector("#nearby-button").addEventListener("click", (event) => openQuestion(Number(event.currentTarget.dataset.itemIndex)));
  document.querySelector("#answer-buttons").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-answer]");
    if (button) submitAnswer(button.dataset.answer === "yes");
  });
  document.querySelector("#close-answer").addEventListener("click", () => {
    if (round.status !== "playing") return;
    focusedItemIndex = null;
    document.querySelector("#answer-card").hidden = true;
    document.querySelector("#stage-hint").textContent = "Продолжай исследовать локацию.";
  });
  document.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => move(button.dataset.move)));
  document.addEventListener("keydown", (event) => {
    if (playScreen.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    const keyDirections = {
      ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
    };
    const direction = keyDirections[event.key];
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
    if (direction && !isTyping) {
      event.preventDefault();
      move(direction);
    }
  });

  renderSoundChoices();
}
