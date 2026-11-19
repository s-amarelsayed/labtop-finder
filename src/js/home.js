import { laptopCard, startPage } from "./ui.js";
import { getFavorites } from "./storage.js";
import { money } from "./specs.js";

startPage("Home", laptops => {
  const lowest = laptops.reduce((min, laptop) => Math.min(min, laptop.price), Infinity);
  const favoriteIds = getFavorites();
  const saved = laptops.filter(laptop => favoriteIds.includes(laptop.id));
  document.querySelector("#laptop-count").textContent = laptops.length;
  document.querySelector("#lowest-price").textContent = laptops.length ? money(lowest) : "—";
  document.querySelector("#favorite-count").textContent = saved.length;

  const picks = ["budget", "ultrabook", "gaming"]
    .map(category => laptops.find(laptop => laptop.category === category))
    .filter(Boolean);
  document.querySelector("#picks").innerHTML = picks.length
    ? picks.map(laptopCard).join("")
    : '<p class="text-muted">No campus picks are available.</p>';
});
