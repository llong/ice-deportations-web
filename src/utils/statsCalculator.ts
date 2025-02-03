import { DeportationData } from '../types';

export function calculateStats(data: DeportationData[]) {
  const totalArrests = data.reduce((sum, item) => sum + item.arrests, 0);
  const totalDetainers = data.reduce((sum, item) => sum + item.detainers, 0);
  
  const dailyAvgArrests = totalArrests / data.length;
  const dailyAvgDetainers = totalDetainers / data.length;
  
  const weeklyAvgArrests = dailyAvgArrests * 7;
  const weeklyAvgDetainers = dailyAvgDetainers * 7;
  
  const monthlyAvgArrests = dailyAvgArrests * 30;
  const monthlyAvgDetainers = dailyAvgDetainers * 30;

  return {
    totalArrests,
    totalDetainers,
    dailyAvgArrests,
    dailyAvgDetainers,
    weeklyAvgArrests,
    weeklyAvgDetainers,
    monthlyAvgArrests,
    monthlyAvgDetainers,
  };
} 