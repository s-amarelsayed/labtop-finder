export async function loadLaptops() {
  try {
    const response = await fetch("./data/laptops.json");
    if (!response.ok) throw new Error("Could not open laptops.json");
    return await response.json();
  } catch (error) {
    console.error("Laptop catalogue:", error);
    return null;
  }
}
