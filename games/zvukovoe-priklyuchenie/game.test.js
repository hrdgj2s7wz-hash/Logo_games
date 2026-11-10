"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { SOUND_LEVELS, OBJECT_MODELS, objectModelMarkup, containsTargetSound, createRound, answerItem, continueRound } = require("./game.js");

test("phoneme matching is case-insensitive and uses the selected Russian letter", () => {
  assert.equal(containsTargetSound("Шапка", "ш"), true);
  assert.equal(containsTargetSound("Чашка", "щ"), false);
  assert.equal(containsTargetSound("щётка", "щ"), true);
  assert.equal(containsTargetSound("ножницы", "ж"), true);
  assert.equal(containsTargetSound("чайник", "ч"), true);
  assert.equal(containsTargetSound("", "ш"), false);
  assert.equal(containsTargetSound("шапка", ""), false);
});

test("each location contains both target and non-target words", () => {
  for (const [sound, level] of Object.entries(SOUND_LEVELS)) {
    const matches = level.items.filter(({ word }) => containsTargetSound(word, sound));
    assert.ok(matches.length > 0, `sound ${sound} should have matching words`);
    assert.ok(matches.length < level.items.length, `sound ${sound} should have distractors`);
    assert.equal(level.items.length, 8);
  }
});

test("each location's collectible words match its setting", () => {
  const expected = {
    ш: ["шишка", "шмель", "шалаш", "гриб", "лист", "цветок", "яблоко", "улитка"],
    ж: ["жук", "жаба", "жёлудь", "шмель", "бабочка", "ромашка", "улитка", "трава"],
    ч: ["часы", "чемодан", "свеча", "сундучок", "книга", "фонарь", "кукла", "шляпа"],
    щ: ["щука", "лещ", "щепка", "камыш", "лодка", "волна", "песок", "берег"],
  };
  for (const [sound, level] of Object.entries(SOUND_LEVELS)) {
    assert.ok(level.theme);
    assert.deepEqual(level.items.map(({ word }) => word), expected[sound]);
  }
});

test("every distinct game word has an illustrated model", () => {
  const words = new Set(Object.values(SOUND_LEVELS).flatMap(({ items }) => items.map(({ word }) => word)));
  assert.deepEqual(new Set(Object.keys(OBJECT_MODELS)), words);
  for (const word of words) {
    const markup = objectModelMarkup({ word, emoji: "🌟" });
    assert.match(markup, new RegExp(`model-${OBJECT_MODELS[word].shape}`));
    assert.match(markup, /class="model-shell"/);
    assert.match(markup, /class="model-mark">🌟<\/span>/);
  }
});

test("a round moves through answer feedback to the next item and completion", () => {
  let round = createRound("ш");
  assert.equal(round.status, "playing");
  assert.equal(round.items[round.index].word, "шишка");

  round = answerItem(round, true);
  assert.equal(round.status, "feedback");
  assert.equal(round.correct, true);
  assert.equal(round.score, 1);
  round = continueRound(round);
  assert.equal(round.status, "playing");
  assert.equal(round.index, 1);

  for (let index = 1; index < round.items.length; index += 1) {
    const hasSound = containsTargetSound(round.items[round.index].word, round.sound);
    round = answerItem(round, hasSound);
    round = continueRound(round);
  }
  assert.equal(round.status, "complete");
  assert.equal(round.score, 8);
});

test("answers are checked against the selected item, not the next progress position", () => {
  const round = createRound("ш");
  const result = answerItem(round, false, 7);
  assert.equal(result.answeredIndex, 7);
  assert.equal(result.correct, true);
  assert.equal(result.score, 1);
});

test("invalid answers and unknown sound selections do not mutate a round", () => {
  const round = createRound("ж");
  assert.equal(answerItem(round, "yes"), round);
  assert.equal(answerItem(round, true, 8), round);
  assert.throws(() => createRound("р"), RangeError);
});
