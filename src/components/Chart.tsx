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
  ChartOptions,
  Filler,
} from "chart.js";
import { DeportationData } from "../types";

// Override Chart.js defaults
ChartJS.defaults.color = "#000";
ChartJS.defaults.borderColor = "#e5e7eb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: DeportationData[];
}

export const DeportationChart = ({ data }: ChartProps) => {
  // Reverse the data array to show oldest to newest
  const sortedData = [...data].reverse();

  const chartData = {
    labels: sortedData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Arrests",
        data: sortedData.map((item) => item.arrests),
        borderColor: "#2563eb", // Blue
        backgroundColor: "rgba(37, 99, 235, 0.1)", // Slightly more opaque
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
        fill: "origin",
        pointBackgroundColor: "#2563eb", // Add this - same as border color
        pointBorderWidth: 0,
      },
      {
        label: "Detainers",
        data: sortedData.map((item) => item.detainers),
        borderColor: "#dc2626", // Red
        backgroundColor: "rgba(220, 38, 38, 0.1)", // Slightly more opaque
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
        fill: "origin",
        pointBackgroundColor: "#dc2626", // Add this - same as border color
        pointBorderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      filler: {
        propagate: true,
      },
      tooltip: {
        usePointStyle: true,
        boxWidth: 0,
        boxHeight: 0,
        padding: 10,
        callbacks: {
          labelColor: (context) => ({
            borderColor: "transparent",
            backgroundColor: context.dataset.borderColor as string,
          }),
        },
      },
      legend: {
        position: "top",
        align: "end",
        labels: {
          font: {
            size: 12,
            weight: 700,
          },
          usePointStyle: true,
          padding: 15,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 700,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        ticks: {
          font: {
            weight: 700,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
};
