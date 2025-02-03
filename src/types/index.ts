export interface DeportationData {
  date: string;
  arrests: number;
  detainers: number;
  imageUrl?: string;
}

export interface StatsDisplayProps {
  data: DeportationData[];
}

export interface DeportationChartProps {
  data: DeportationData[];
}

export interface ErrorDisplayProps {
  error: Error;
}

export interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}
