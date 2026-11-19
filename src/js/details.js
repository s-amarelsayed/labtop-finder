import { favoriteButton, startPage } from "./ui.js";
import { addToComparison, getComparison } from "./storage.js";
import { categoryName, money, specs, specValue } from "./specs.js";

const content = document.querySelector("#content");
const id = new URLSearchParams(location.search).get("id");

function showDetails(laptops) {
  const laptop = laptops.find(item => String(item.id) === id);
  if (!laptop) {
    content.innerHTML = `<section class="panel p-8"><h1 class="section-title">Laptop not found</h1>
      <p class="mt-2 mb-4 text-muted">Choose a laptop from the catalogue to view its specifications.</p>
      <a href="laptops.html" class="btn-action">Browse catalogue</a></section>`;
    return;
  }

  document.title = `${laptop.brand} ${laptop.name} | Student Laptop Finder`;
  const selected = getComparison().includes(laptop.id);
  const compareAction = selected
    ? '<a href="compare.html" class="btn-action">Open comparison</a>'
    : '<button type="button" id="add-compare" class="btn-action">Add to compare</button>';
  const rows = specs.map(spec => `<tr class="border-b border-line last:border-0">
    <th scope="row" class="px-4 py-3 text-left font-medium text-muted">${spec.label}</th>
    <td class="px-4 py-3">${specValue(laptop, spec)}</td></tr>`).join("");

  content.innerHTML = `
    <section class="panel grid items-center gap-5 overflow-hidden p-4 sm:p-6 md:grid-cols-2 lg:gap-9">
      <img src="${laptop.image}" alt="Illustration of ${laptop.brand} ${laptop.name}" width="480" height="300"
           class="aspect-[8/5] w-full rounded-xl object-cover">
      <div class="min-w-0">
        <p class="mb-2 text-sm font-semibold text-accent">${laptop.brand} · ${categoryName(laptop.category)}</p>
        <h1 class="page-title">${laptop.name}</h1>
        <p class="mt-4 max-w-xl leading-relaxed text-muted">${laptop.description}</p>
        <p class="my-5 text-3xl font-bold">${money(laptop.price)}</p>
        <div class="flex flex-wrap gap-2">${favoriteButton(laptop, true)} ${compareAction}</div>
        <p id="detail-message" role="status" class="mt-3 text-sm text-muted">
          ${selected ? "Selected for comparison." : "Adding to compare also saves this laptop to favorites."}
        </p>
      </div>
    </section>
    <section class="mt-7">
      <h2 id="spec-heading" class="section-title mb-4">Full specifications</h2>
      <div class="panel overflow-hidden"><table aria-labelledby="spec-heading" class="w-full border-collapse bg-card text-sm sm:text-base">
        <tbody>${rows}</tbody></table></div>
    </section>`;

  document.querySelector("#add-compare")?.addEventListener("click", () => {
    if (addToComparison(laptop.id)) {
      showDetails(laptops);
      content.querySelector('a[href="compare.html"]').focus();
    } else {
      document.querySelector("#detail-message").innerHTML =
        'Four laptops are already selected. <a class="text-link" href="compare.html">Open comparison</a> to remove one first.';
    }
  });
}

startPage("Catalogue", showDetails);
