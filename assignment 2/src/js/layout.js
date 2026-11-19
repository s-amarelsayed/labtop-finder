import { getTheme, saveTheme } from "./storage.js";

const pages = [
  ["Home", "index.html"], ["Catalogue", "laptops.html"],
  ["Favorites", "favorites.html"], ["Compare", "compare.html"]
];

export function setupLayout(activePage) {
  const links = pages.map(([name, file]) => {
    const current = name === activePage ? 'aria-current="page"' : "";
    return `<a class="nav-link" href="${file}" ${current}>${name}</a>`;
  }).join("");

  document.querySelector("#site-header").innerHTML = `
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-card focus:p-3">Skip to content</a>
    <div class="border-b border-line bg-card">
      <div class="page-width flex flex-wrap items-center justify-between gap-2 py-3">
        <a href="index.html" class="flex items-center gap-2 text-base font-bold tracking-tight sm:text-xl">
          <span aria-hidden="true" class="grid size-8 place-content-center rounded-lg bg-accent text-on-accent">
            <span class="mx-auto h-3 w-4 rounded-xs border-2 border-current"></span>
            <span class="mt-0.5 h-0.5 w-5 rounded-full bg-current"></span>
          </span>
          Laptop Finder
        </a>
        <div class="ml-auto flex items-center gap-2 lg:order-3 lg:ml-0">
          <button class="btn-secondary" type="button" id="theme-toggle"></button>
          <button class="btn-secondary lg:hidden" type="button" id="menu-toggle" aria-controls="main-nav" aria-expanded="false">Menu</button>
        </div>
        <nav id="main-nav" aria-label="Main navigation" class="hidden w-full flex-col gap-1 pt-2 lg:order-2 lg:flex lg:w-auto lg:flex-row lg:pt-0">
          ${links}
        </nav>
      </div>
    </div>
    <p id="announcement" role="status" class="sr-only"></p>`;
  document.querySelector("#site-footer").innerHTML = `
    <div class="page-width flex flex-wrap items-center justify-between gap-2 py-5 text-sm text-muted">
      <span class="font-semibold text-ink">Student Laptop Finder</span><span>Sample prices in USD</span>
    </div>`;

  const themeButton = document.querySelector("#theme-toggle");
  function showTheme() {
    const performance = getTheme() === "performance";
    document.documentElement.dataset.theme = performance ? "performance" : "battery";
    const mode = performance ? "Performance" : "Battery Saver";
    const nextMode = performance ? "Battery Saver Mode" : "Performance Mode";
    themeButton.innerHTML = `<span>${mode}<span class="hidden sm:inline"> Mode</span></span>`;
    themeButton.setAttribute("aria-label", `Switch to ${nextMode}`);
    themeButton.title = `Switch to ${nextMode}`;
  }

  showTheme();
  themeButton.addEventListener("click", () => {
    saveTheme(getTheme() === "performance" ? "battery" : "performance");
    showTheme();
  });
  window.addEventListener("storage", showTheme);
  window.addEventListener("pageshow", showTheme);

  const menuButton = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#main-nav");
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("flex");
    nav.classList.toggle("hidden", !open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
}
