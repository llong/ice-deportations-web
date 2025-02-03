import { DeportationData } from "../types";
import { calculateStats } from "../utils/statsCalculator";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}

const StatCard = ({ title, value, subtitle, highlight }: StatCardProps) => {
  return (
    <div
      className={`p-6 rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md
      ${highlight ? "border-l-4 border-blue-500" : ""}`}
    >
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

interface StatsDisplayProps {
  data: DeportationData[];
  loading: boolean;
}

export const StatsDisplay = ({ data, loading }: StatsDisplayProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  const stats = calculateStats(data);
  const today = new Date().toISOString().split("T")[0];
  const todayData = data.find((item) => item.date === today);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Tracking ICE enforcement actions since January 20, 2025
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayData && (
          <>
            <StatCard
              title="Today's Arrests"
              value={todayData.arrests.toLocaleString()}
              highlight
            />
            <StatCard
              title="Today's Detainers"
              value={todayData.detainers.toLocaleString()}
              highlight
            />
          </>
        )}
        <StatCard
          title="Total Arrests"
          value={stats.totalArrests.toLocaleString()}
        />
        <StatCard
          title="Total Detainers"
          value={stats.totalDetainers.toLocaleString()}
        />
        <StatCard
          title="Daily Avg. Arrests"
          value={Math.round(stats.dailyAvgArrests).toLocaleString()}
        />
        <StatCard
          title="Daily Avg. Detainers"
          value={Math.round(stats.dailyAvgDetainers).toLocaleString()}
        />
      </div>
    </div>
  );
};
