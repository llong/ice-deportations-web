import axios from "axios";
import { DeportationData } from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // Increased timeout for image processing
});

export async function fetchDeportationData(): Promise<DeportationData[]> {
  try {
    const response = await api.get<DeportationData[]>("/api/deportation-data");
    return response.data;
  } catch (error) {
    console.error("Error fetching deportation data:", error);
    throw error;
  }
}

export async function processImage(
  imageUrl: string
): Promise<{ arrests: number; detainers: number } | null> {
  try {
    const response = await api.post("/api/process-image", { imageUrl });
    return response.data;
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
}
