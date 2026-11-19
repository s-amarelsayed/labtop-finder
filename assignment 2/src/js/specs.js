const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  trailingZeroDisplay: "stripIfInteger"
});

export const money = value => dollars.format(value);

const categories = {
  ultrabook: "Ultrabook", gaming: "Gaming", "2-in-1": "2-in-1",
  creator: "Creator", budget: "Budget"
};

export const categoryName = key => categories[key];

export const specs = [
  { key: "price", label: "Price", best: "min" },
  { key: "cpu", label: "Processor" },
  { key: "ramGB", label: "RAM", unit: "GB", best: "max" },
  { key: "storageGB", label: "Storage", unit: "GB", best: "max" },
  { key: "batteryHours", label: "Battery life", unit: "h", best: "max" },
  { key: "weightKg", label: "Weight", unit: "kg", best: "min" },
  { key: "screenInches", label: "Screen size", unit: "in" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "id", label: "Catalogue ID" }
];

export function specValue(laptop, spec) {
  const value = laptop[spec.key];
  if (spec.key === "price") return money(value);
  if (spec.key === "category") return categoryName(value);
  return spec.unit ? `${value} ${spec.unit}` : value;
}
