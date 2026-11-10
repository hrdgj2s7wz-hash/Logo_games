const games = [
  { title: "Приключение на звуки", genre: "Звуки Ш, Ж, Щ, Ч", description: "Исследуй яркие 2D-локации, слушай названия предметов и ищи звук Ш, Ж, Ч или Щ.", symbol: "😊", tag: "Ш · Ж · Ч · Щ", colors: ["#267c84", "#b9e8a4"], url: "./games/zvukovoe-priklyuchenie/index.html", isLive: true, cover: "adventure" },
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
      : game.cover === "adventure"
        ? `<svg class="adventure-cover-art" aria-hidden="true" viewBox="0 0 180 130">
            <path d="M0 85Q42 55 88 82T180 73v57H0z" fill="#75bd6d"/>
            <path d="M0 100q42-19 90 1t90-1v30H0z" fill="#9bd77d"/>
            <path d="M76 130q-6-20 9-30t-5-20 5-18" fill="none" stroke="#c99d63" stroke-linecap="round" stroke-width="14"/>
            <path d="M24 80V52" stroke="#8c5a37" stroke-linecap="round" stroke-width="8"/>
            <circle cx="24" cy="43" r="20" fill="#4a9f5d"/><circle cx="17" cy="36" r="7" fill="#85d274"/>
            <path d="M151 79V50" stroke="#8c5a37" stroke-linecap="round" stroke-width="8"/>
            <circle cx="151" cy="41" r="21" fill="#4a9f5d"/><circle cx="144" cy="34" r="7" fill="#85d274"/>
            <circle cx="90" cy="54" r="24" fill="#ffd46a" stroke="#fff4c2" stroke-width="4"/>
            <circle cx="82" cy="50" r="2.5" fill="#55463d"/><circle cx="98" cy="50" r="2.5" fill="#55463d"/>
            <path d="M81 61q9 9 18 0" fill="none" stroke="#8e5747" stroke-linecap="round" stroke-width="3"/>
            <path d="m60 31 4-8 4 8 8 4-8 4-4 8-4-8-8-4zM125 68l3-6 3 6 6 3-6 3-3 6-3-6-6-3z" fill="#fff3a7"/>
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
