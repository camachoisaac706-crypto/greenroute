export const T = {
  paper: "#E9EDE5", card: "#FFFFFF", ink: "#15201A", sub: "#5A6B5E", faint: "#8A998D",
  pine: "#13503B", pineDeep: "#0E3B2C", moss: "#6E8B5E", amber: "#DD8E2C",
  amberSoft: "#F6E6CB", line: "#D4DCCF", lineSoft: "#E3E9DD",
  good: "#2E7D52", warn: "#B9772A", bad: "#B4452F",
};
export const display = "'Archivo', system-ui, sans-serif";
export const body = "'Inter', system-ui, sans-serif";
export const mono = "'IBM Plex Mono', ui-monospace, monospace";

export const usd = (n) => "$" + Math.round(Number(n) || 0).toLocaleString("en-US");
