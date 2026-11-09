const games = [
  { title: "Звуковая охота", genre: "Звуки Ш, Ж, Щ, Ч", description: "Ищи предметы со звуками Ш, Ж и Ч, слушай слова и собирай золотые монеты.", symbol: "Ш", tag: "Ш · Ж · Ч", colors: ["#b75d35", "#f7c968"], url: "./games/zvukovaya-ohota/index.html", isLive: true, cover: "treasure" },
];

const grid = document.querySelector("#games-grid");
const filters = document.querySelector("#filters");
const search = document.querySelector("#search");
const emptyState = document.querySelector("#empty-state");
const genres = ["Все", "Чтение", "Звуки С, З, Ц", "Звуки Ш, Ж, Щ, Ч", "Звук Р", "Звук Л", "АГ"];
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
      ? `<svg class="treasure-chest" aria-hidden="true" viewBox="0 0 48 48">
          <circle cx="15" cy="12" r="7" fill="#ffd95e" stroke="#bd7814" stroke-width="2"/>
          <circle cx="29" cy="10" r="7" fill="#ffe998" stroke="#bd7814" stroke-width="2"/>
          <path d="M7 22h34v17H7z" rx="4" fill="#a85d27" stroke="#70401f" stroke-width="2.5"/>
          <path d="M9 24h30v5H9zm0 9h30v4H9z" fill="#d58a3d"/>
          <path d="M21 21h7v19h-7z" fill="#f5d166" stroke="#9c681e" stroke-width="1.5"/>
          <path d="M21 28h7v6h-7z" fill="#ffe28a" stroke="#9c681e" stroke-width="1.2"/>
          <circle cx="24.5" cy="31" r="1" fill="#8b571a"/>
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
