// Replace these clearly marked examples with your own games and real URLs.
const games = [
  { title: "Собери слово", genre: "Чтение", description: "Складывай слоги и читай новые слова.", symbol: "А", tag: "Читаем", colors: ["#f3a276", "#f7c4a0"], url: "https://example.com/" },
  { title: "Звуковой поезд", genre: "Звуки С, З, Ц", description: "Помоги вагончикам найти слова с нужными звуками.", symbol: "С", tag: "С · З · Ц", colors: ["#a9d943", "#d7ed7b"], url: "https://example.com/" },
  { title: "Шипящий лабиринт", genre: "Звуки Ш, Ж, Ч", description: "Ищи дорожку к картинкам со звуками Ш, Ж и Ч.", symbol: "Ш", tag: "Ш · Ж · Ч", colors: ["#75c9e8", "#b9e8f4"], url: "https://example.com/" },
  { title: "Ракета для Р", genre: "Звук Р", description: "Собирай картинки и тренируй звук Р в словах.", symbol: "Р", tag: "Звук Р", colors: ["#ee805a", "#ffc27d"], url: "https://example.com/" },
  { title: "Лесные дорожки", genre: "Звук Л", description: "Помоги героям пройти путь и назови слова со звуком Л.", symbol: "Л", tag: "Звук Л", colors: ["#b2d94d", "#e3ef8f"], url: "https://example.com/" },
  { title: "Алфавитный город", genre: "АГ", description: "Исследуй буквы и выполняй задания в игровом городе.", symbol: "Б", tag: "АГ", colors: ["#73c8ea", "#c2e8f5"], url: "https://example.com/" }
];

const grid = document.querySelector("#games-grid");
const filters = document.querySelector("#filters");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#empty-state");
const genres = ["Все", "Чтение", "Звуки С, З, Ц", "Звуки Ш, Ж, Ч", "Звук Р", "Звук Л", "АГ"];
let activeGenre = "Все";

function renderFilters() {
  filters.innerHTML = genres.map((genre) =>
    `<button class="filter-button" type="button" aria-pressed="${genre === activeGenre}" data-genre="${genre}">${genre}</button>`
  ).join("");
}

function renderGames() {
  const query = search.value.trim().toLocaleLowerCase("ru");
  const visibleGames = games.filter((game) => {
    const matchesGenre = activeGenre === "Все" || game.genre === activeGenre;
    const searchable = `${game.title} ${game.genre} ${game.description}`.toLocaleLowerCase("ru");
    return matchesGenre && searchable.includes(query);
  });

  grid.innerHTML = visibleGames.map((game) => {
    const [startColor, endColor] = game.colors;
    return `<article class="game-card">
      <div class="game-cover" style="background:radial-gradient(circle at 50% 45%,${endColor},${startColor} 76%)">
        <span class="cover-index">ИГРА ${String(games.indexOf(game) + 1).padStart(2, "0")}</span>
        <span class="cover-symbol" aria-hidden="true">${game.symbol}</span><span class="cover-tag">${game.tag}</span>
      </div>
      <div class="game-info"><div class="game-meta"><span class="game-genre">${game.genre}</span><span>ДЕМО</span></div>
        <h3 class="game-title">${game.title}</h3><p class="game-description">${game.description}</p>
        <a class="card-link" href="${game.url}" target="_blank" rel="noopener noreferrer" aria-label="Демонстрационная ссылка для игры «${game.title}» (откроется в новой вкладке)">Демо-ссылка <span aria-hidden="true">↗</span></a>
      </div></article>`;
  }).join("");
  emptyState.hidden = visibleGames.length > 0;
  document.querySelector("#hero-count").textContent = String(games.length).padStart(2, "0");
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-genre]");
  if (!button) return;
  activeGenre = button.dataset.genre;
  renderFilters();
  renderGames();
});
search.addEventListener("input", renderGames);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape" && document.activeElement === search) {
    search.value = "";
    renderGames();
    search.blur();
  }
});
renderFilters();
renderGames();
