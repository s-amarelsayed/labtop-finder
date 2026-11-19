import { loadLaptops } from "./api.js";
import { getFavorites, toggleFavorite } from "./storage.js";
import { setupLayout } from "./layout.js";
import { categoryName, money } from "./specs.js";

export function favoriteButton(laptop, longLabel = false) {
  const saved = getFavorites().includes(laptop.id);
  let label = saved ? "Saved" : "Save";
  if (longLabel) label = saved ? "Remove from favorites" : "Save to favorites";
  const action = saved ? "Remove from favorites" : "Save to favorites";
  return `<button type="button" class="btn-secondary" data-favorite="${laptop.id}"
    aria-pressed="${saved}" title="${action}" aria-label="${action}, ${laptop.brand} ${laptop.name}">${label}</button>`;
}

export function laptopCard(laptop) {
  return `<article class="laptop-card">
    <a href="details.html?id=${laptop.id}" tabindex="-1" aria-hidden="true">
      <img src="${laptop.image}" alt="" loading="lazy" width="480" height="300" class="aspect-[8/5] w-full border-b border-line object-cover">
    </a>
    <div class="flex grow flex-col p-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-sm font-semibold text-muted">${laptop.brand}</span>
        <span class="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-accent">${categoryName(laptop.category)}</span>
      </div>
      <h3 class="mt-2 text-xl font-bold tracking-tight">
        <a href="details.html?id=${laptop.id}" class="hover:text-accent">${laptop.name}</a>
      </h3>
      <p class="mt-1 text-sm text-muted">${laptop.ramGB} GB RAM · ${laptop.storageGB} GB storage · ${laptop.batteryHours} h battery</p>
      <p class="mt-4 text-xl font-bold tabular-nums">${money(laptop.price)}</p>
      <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <a class="text-link text-sm" href="details.html?id=${laptop.id}" aria-label="View details for ${laptop.name}">View details</a>
        ${favoriteButton(laptop)}
      </div>
    </div>
  </article>`;
}

function skeletons() {
  const card = `<div aria-hidden="true" class="panel animate-pulse overflow-hidden motion-reduce:animate-none">
    <div class="aspect-[8/5] bg-tint"></div>
    <div class="space-y-3 p-5"><div class="h-3 w-1/3 rounded bg-line"></div>
      <div class="h-5 w-2/3 rounded bg-line"></div><div class="h-3 w-3/4 rounded bg-line"></div>
      <div class="h-8 w-24 rounded bg-tint"></div></div></div>`;
  return `<span class="sr-only">Loading laptops…</span><div class="card-grid">${card.repeat(3)}</div>`;
}

export async function startPage(name, render) {
  setupLayout(name);
  const loading = document.querySelector("#loading");
  loading.innerHTML = skeletons();
  const laptops = await loadLaptops();
  if (!laptops) {
    loading.innerHTML = `<div class="panel p-6" role="alert"><h2 class="text-xl font-bold">Couldn’t load the laptops</h2>
      <p class="my-3 text-muted">Check that the site is running on a local server and that data/laptops.json is available.</p>
      <button type="button" id="retry" class="btn-secondary">Try again</button></div>`;
    document.querySelector("#retry").addEventListener("click", () => location.reload());
    return;
  }

  const refresh = () => render(laptops);
  refresh();
  loading.hidden = true;
  document.querySelector("#content").hidden = false;

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const id = Number(button.dataset.favorite);
    toggleFavorite(id);
    refresh();
    const message = getFavorites().includes(id) ? "Added to favorites." : "Removed from favorites.";
    document.querySelector("#announcement").textContent = message;
    const nextButton = document.querySelector(`[data-favorite="${id}"]`)
      || document.querySelector("#cards [data-favorite], #empty:not([hidden]) a");
    nextButton?.focus({ preventScroll: true });
  });
  window.addEventListener("storage", refresh);
  window.addEventListener("pageshow", event => {
    if (event.persisted) refresh();
  });
}
