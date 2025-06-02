export function formatPriceRange(num1: number, num2: number): string {
  const [min, max] = num1 < num2 ? [num1, num2] : [num2, num1];

  const format = (val: number) => (Number.isInteger(val) ? val.toString() : val.toFixed(1));

  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (max < million) {
    return "<1 juta";
  }

  if (min >= billion) {
    const minB = min / billion;
    const maxB = max / billion;
    return minB === maxB ? `${format(minB)} miliar` : `${format(minB)}~${format(maxB)} miliar`;
  }

  if (min >= million) {
    const minM = min / million;
    const maxM = max / million;
    return minM === maxM ? `${format(minM)} juta` : `${format(minM)}~${format(maxM)} juta`;
  }

  const maxM = max / million;
  return `<1~${format(maxM)} juta`;
}
