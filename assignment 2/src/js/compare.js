import { specs, specValue } from "./specs.js";

function compareRow(laptops, spec) {
  const values = laptops.map(laptop => laptop[spec.key]);
  let best = null;
  if (spec.best === "min") best = Math.min(...values);
  if (spec.best === "max") best = Math.max(...values);

  // Compare the raw numbers first so tied values all get the same highlight.
  const cells = laptops.map(laptop => {
    const wins = best !== null && laptop[spec.key] === best;
    const color = wins ? "bg-tint font-bold text-accent" : "";
    const badge = wins ? '<span class="ml-1 text-xs font-semibold">Best</span>' : "";
    return `<td class="border-l border-line px-4 py-3 align-top ${color}">${specValue(laptop, spec)} ${badge}</td>`;
  }).join("");
  return `<tr class="border-t border-line">
    <th scope="row" class="sticky left-0 bg-card px-4 py-3 text-left align-top font-medium">${spec.label}</th>${cells}</tr>`;
}

export function comparisonTable(laptops) {
  const headers = laptops.map(laptop => `<th scope="col" class="min-w-36 border-l border-line px-4 py-3 text-left align-bottom sm:min-w-44">
    <span class="block text-xs font-medium text-muted">${laptop.brand}</span>
    <a class="text-link" href="details.html?id=${laptop.id}">${laptop.name}</a></th>`).join("");
  const rows = specs.map(spec => compareRow(laptops, spec)).join("");
  return `<h2 id="table-title" class="section-title">Specification comparison</h2>
    <p class="mt-2 mb-4 text-sm text-muted">Lower price and weight score best. Higher RAM, storage and battery life score best. Ties share the highlight.</p>
    <div class="panel max-w-full overflow-x-auto" tabindex="0" role="region" aria-label="Scrollable specification comparison">
      <table class="w-full border-separate border-spacing-0 text-sm" aria-labelledby="table-title">
        <thead><tr><th scope="col" class="sticky left-0 min-w-28 bg-card px-4 py-3 text-left align-bottom">Specification</th>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
