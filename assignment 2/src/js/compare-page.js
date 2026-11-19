import { startPage } from "./ui.js";
import { addToComparison, getComparison, getFavorites, removeFromComparison, startComparison } from "./storage.js";
import { comparisonTable } from "./compare.js";

const choices = document.querySelector("#choices");
const message = document.querySelector("#compare-message");
let laptops = [];

function showComparison() {
  const ids = getFavorites();
  const favorites = laptops.filter(laptop => ids.includes(laptop.id));
  startComparison(favorites);
  const selectedIds = getComparison();
  const selected = favorites.filter(laptop => selectedIds.includes(laptop.id));

  document.querySelector("#empty").hidden = favorites.length > 0;
  document.querySelector("#compare-content").hidden = favorites.length === 0;
  document.querySelector("#selected-count").textContent = `${selected.length} of 4 selected`;
  choices.innerHTML = favorites.map(laptop => `<label class="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-page p-3 text-sm hover:border-accent">
    <input type="checkbox" class="size-4 rounded border-line bg-card text-accent focus:ring-accent" value="${laptop.id}"
           ${selectedIds.includes(laptop.id) ? "checked" : ""}>
    <span>${laptop.brand} ${laptop.name}</span></label>`).join("");
  message.textContent = "";
  const comparison = document.querySelector("#comparison");
  if (selected.length >= 2) {
    comparison.innerHTML = comparisonTable(selected);
  } else {
    const hint = favorites.length < 2
      ? 'Save one more laptop from the <a class="text-link" href="laptops.html">catalogue</a> to start a comparison.'
      : "Select at least two favorites above to see the comparison.";
    comparison.innerHTML = `<p class="panel p-5 text-muted">${hint}</p>`;
  }
}

choices.addEventListener("change", event => {
  const box = event.target;
  const id = Number(box.value);
  if (box.checked && !addToComparison(id)) {
    box.checked = false;
    message.textContent = "You can compare up to four laptops. Remove one before adding another.";
    return;
  }
  if (!box.checked) removeFromComparison(id);
  showComparison();
  choices.querySelector(`input[value="${id}"]`).focus({ preventScroll: true });
});

startPage("Compare", data => {
  laptops = data;
  showComparison();
});
