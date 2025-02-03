import { useMemo } from "react";
import { DeportationData } from "../types";
import { predictFutureValue, linearRegression } from "../utils/predictions";

interface PredictionDisplayProps {
  data: DeportationData[];
}

export const PredictionDisplay = ({ data }: PredictionDisplayProps) => {
  const predictions = useMemo(() => {
    if (data.length < 2) return null;

    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const arrestsData = sortedData.map(
      (d) => [new Date(d.date), d.arrests] as [Date, number]
    );
    const detainersData = sortedData.map(
      (d) => [new Date(d.date), d.detainers] as [Date, number]
    );

    const targetDate = new Date("2026-01-01");

    const normalizedArrestsData: Array<[number, number]> = arrestsData.map(
      ([d, v]) => [
        (d.getTime() - arrestsData[0][0].getTime()) / (1000 * 60 * 60 * 24),
        v,
      ]
    );

    const normalizedDetainersData: Array<[number, number]> = detainersData.map(
      ([d, v]) => [
        (d.getTime() - detainersData[0][0].getTime()) / (1000 * 60 * 60 * 24),
        v,
      ]
    );

    return {
      arrests: predictFutureValue(arrestsData, targetDate),
      detainers: predictFutureValue(detainersData, targetDate),
      confidence: {
        arrests: Math.round(
          linearRegression(normalizedArrestsData).rSquared * 100
        ),
        detainers: Math.round(
          linearRegression(normalizedDetainersData).rSquared * 100
        ),
      },
    };
  }, [data]);

  if (!predictions) return null;

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">
        Projected Numbers for January 1, 2026
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-2">Projected Arrests</h3>
          <p className="text-3xl font-bold">
            {predictions.arrests.toLocaleString()}
          </p>
          <p className="text-sm opacity-75">
            Confidence: {predictions.confidence.arrests}%
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-2">Projected Detainers</h3>
          <p className="text-3xl font-bold">
            {predictions.detainers.toLocaleString()}
          </p>
          <p className="text-sm opacity-75">
            Confidence: {predictions.confidence.detainers}%
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-75">
        * Predictions based on historical trend analysis using linear regression
      </p>
    </div>
  );
};
