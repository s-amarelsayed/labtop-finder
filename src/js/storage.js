const prefix = "student-laptop-finder.";

function read(key, fallback) {
  try {
    const value = localStorage.getItem(prefix + key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}

export const getFavorites = () => read("favorites", []);
export const getComparison = () => read("comparison", []);
export const getTheme = () => read("theme", "battery");
export const saveTheme = theme => save("theme", theme);

export function toggleFavorite(id) {
  const favorites = getFavorites();
  if (favorites.includes(id)) {
    const remaining = favorites.filter(item => item !== id);
    save("favorites", remaining);
    if (getComparison().includes(id)) removeFromComparison(id);
    if (!remaining.length) localStorage.removeItem(prefix + "comparison");
  } else {
    save("favorites", [...favorites, id]);
  }
}

export function clearFavorites() {
  save("favorites", []);
  localStorage.removeItem(prefix + "comparison");
}

export function startComparison(favorites) {
  // Only suggest a first set. An empty saved array means the user cleared their choices.
  if (read("comparison", null) === null && favorites.length >= 2) {
    save("comparison", favorites.slice(0, 4).map(laptop => laptop.id));
  }
}

export function addToComparison(id) {
  const selected = getComparison();
  if (selected.includes(id)) return true;
  if (selected.length >= 4) return false;
  if (!getFavorites().includes(id)) toggleFavorite(id);
  save("comparison", [...selected, id]);
  return true;
}

export function removeFromComparison(id) {
  save("comparison", getComparison().filter(item => item !== id));
}
