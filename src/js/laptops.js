import { laptopCard, startPage } from "./ui.js";

const form = document.querySelector("#filters");
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const maxPrice = document.querySelector("#max-price");
const minRam = document.querySelector("#min-ram");
const sort = document.querySelector("#sort");
let laptops = [];

function showResults() {
  const query = search.value.trim().toLowerCase();
  const limit = maxPrice.value === "" ? Infinity : Number(maxPrice.value);
  const matches = laptops.filter(laptop => {
    const fullName = (laptop.brand + " " + laptop.name).toLowerCase();
    return fullName.includes(query)
      && (!category.value || laptop.category === category.value)
      && laptop.price <= limit
      && laptop.ramGB >= Number(minRam.value);
  });

  const sorted = [...matches];
  if (sort.value) {
    const [key, direction] = sort.value.split("-");
    sorted.sort((a, b) => direction === "asc" ? a[key] - b[key] : b[key] - a[key]);
  }

  document.querySelector("#result-count").textContent =
    `${sorted.length} ${sorted.length === 1 ? "laptop" : "laptops"} found`;
  document.querySelector("#cards").innerHTML = sorted.map(laptopCard).join("");
  document.querySelector("#no-results").hidden = sorted.length > 0;
}

form.addEventListener("input", showResults);
form.addEventListener("submit", event => event.preventDefault());
document.querySelector("#reset").addEventListener("click", () => {
  form.reset();
  showResults();
});

startPage("Catalogue", data => {
  laptops = data;
  showResults();
});
