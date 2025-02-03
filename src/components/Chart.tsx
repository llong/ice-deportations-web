import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DeportationData } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: DeportationData[];
}

export const Chart = ({ data }: ChartProps) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Arrests",
        data: data.map((item) => item.arrests),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "Detainers",
        data: data.map((item) => item.detainers),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "ICE Enforcement Actions Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
};
