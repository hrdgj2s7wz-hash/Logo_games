const games = [
  { title: "Звуковая охота", genre: "Звуки Ш, Ж, Ч", description: "Ищи предметы со звуками Ш, Ж и Ч, слушай слова и собирай золотые монеты.", symbol: "Ш", tag: "Ш · Ж · Ч", colors: ["#b75d35", "#f7c968"], url: "./games/zvukovaya-ohota/index.html", isLive: true, cover: "treasure" },
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
    const coverArt = game.cover === "treasure"
      ? `<svg class="treasure-chest" aria-hidden="true" viewBox="0 0 160 120">
          <ellipse cx="78" cy="104" rx="54" ry="8" fill="#6b351f" opacity=".22"/>
          <circle cx="45" cy="35" r="13" fill="#ffd95e" stroke="#a85d27" stroke-width="3"/>
          <circle cx="71" cy="25" r="15" fill="#ffe998" stroke="#bd7814" stroke-width="3"/>
          <circle cx="101" cy="32" r="13" fill="#ffd95e" stroke="#a85d27" stroke-width="3"/>
          <path d="M37 67c0-22 18-39 41-39s42 17 42 39H37Z" fill="#c47a30" stroke="#70401f" stroke-width="4"/>
          <path d="M31 65h99v38H31z" rx="7" fill="#a85d27" stroke="#70401f" stroke-width="4"/>
          <path d="M36 72h89v9H36zm0 22h89v5H36z" fill="#d58a3d"/>
          <path d="M75 64h14v40H75z" fill="#f5d166" stroke="#9c681e" stroke-width="3"/>
          <path d="M75 78h14v12H75z" fill="#ffe28a" stroke="#9c681e" stroke-width="2"/>
          <circle cx="82" cy="84" r="2" fill="#8b571a"/>
        </svg>`
      : `<span class="cover-symbol" aria-hidden="true">${game.symbol}</span>`;
    return `<article class="game-card">
      <div class="game-cover" style="background:radial-gradient(circle at 50% 45%,${endColor},${startColor} 76%)">
        <span class="cover-index">ИГРА ${String(games.indexOf(game) + 1).padStart(2, "0")}</span>
        ${coverArt}<span class="cover-tag">${game.tag}</span>
      </div>
      <div class="game-info"><div class="game-meta"><span class="game-genre">${game.genre}</span><span>${game.isLive ? "ИГРА" : "ДЕМО"}</span></div>
        <h3 class="game-title">${game.title}</h3><p class="game-description">${game.description}</p>
        <a class="card-link" href="${game.url}" ${game.isLive ? "" : 'target="_blank" rel="noopener noreferrer"'} aria-label="${game.isLive ? "Открыть игру" : "Демонстрационная ссылка"} «${game.title}»${game.isLive ? "" : " (откроется в новой вкладке)"}">${game.isLive ? "Играть" : "Демо-ссылка"} <span aria-hidden="true">↗</span></a>
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
