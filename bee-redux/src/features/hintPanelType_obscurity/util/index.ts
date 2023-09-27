export const usageExplanation = (frequency: number) => {
  if (frequency >= 100) return "Ubiquitous";
  if (frequency >= 10) return "Very Common";
  if (frequency >= 1) return "Common";
  if (frequency >= 0.1) return "Uncommon";
  if (frequency >= 0.01) return "Obscure";
  return "Very Obscure";
};
