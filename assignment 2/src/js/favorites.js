import { laptopCard, startPage } from "./ui.js";
import { clearFavorites, getFavorites } from "./storage.js";
import { money } from "./specs.js";

let laptops = [];

function showFavorites() {
  const ids = getFavorites();
  const saved = laptops.filter(laptop => ids.includes(laptop.id));
  const total = saved.reduce((sum, laptop) => sum + laptop.price, 0);
  document.querySelector("#saved-count").textContent = saved.length;
  document.querySelector("#total").textContent = money(total);
  document.querySelector("#average").textContent = saved.length ? money(total / saved.length) : "—";
  document.querySelector("#cards").innerHTML = saved.map(laptopCard).join("");
  document.querySelector("#saved-actions").hidden = saved.length === 0;
  document.querySelector("#empty").hidden = saved.length > 0;
}

document.querySelector("#clear").addEventListener("click", () => {
  clearFavorites();
  showFavorites();
  document.querySelector("#announcement").textContent = "All favorites cleared.";
  document.querySelector("#empty a").focus();
});

startPage("Favorites", data => {
  laptops = data;
  showFavorites();
});
