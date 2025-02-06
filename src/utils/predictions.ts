interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

export function linearRegression(
  data: Array<[number, number]>
): RegressionResult {
  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const [x, y] of data) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  let totalSS = 0;
  let residualSS = 0;

  for (const [x, y] of data) {
    const prediction = slope * x + intercept;
    residualSS += Math.pow(y - prediction, 2);
    totalSS += Math.pow(y - yMean, 2);
  }

  const rSquared = 1 - residualSS / totalSS;

  return { slope, intercept, rSquared };
}

export function predictFutureValue(
  data: Array<[Date, number]>,
  targetDate: Date
): number {
  const startDate = data[0][0].getTime();
  const normalizedData: [number, number][] = data.map(([date, value]) => [
    (date.getTime() - startDate) / (1000 * 60 * 60 * 24),
    value,
  ]);

  const regression = linearRegression(normalizedData);
  const targetDays = (targetDate.getTime() - startDate) / (1000 * 60 * 60 * 24);

  return Math.round(regression.slope * targetDays + regression.intercept);
}
