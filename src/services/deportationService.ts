import { DeportationData } from "../types";
import { supabase } from "../lib/supabase";
import { api } from "./api";

export async function fetchDeportationData(): Promise<{
  data: DeportationData[];
  isStale: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from("deportation_data")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    const isStale = isDataStale(data);
    return { data: data || [], isStale };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], isStale: true };
  }
}

export async function updateDeportationData(
  data: DeportationData
): Promise<void> {
  console.log("Updating Supabase with data:", data);
  const { error } = await supabase.from("deportation_data").upsert(
    {
      date: data.date,
      arrests: data.arrests,
      detainers: data.detainers,
      image_url: data.imageUrl,
    },
    {
      onConflict: "date",
    }
  );

  if (error) {
    console.error("Error updating Supabase:", error);
    throw new Error(`Failed to update data: ${error.message}`);
  }
}

export async function processAndStoreNewData(
  imageUrl: string,
  date: string
): Promise<void> {
  try {
    // Use the api instance instead of axios directly
    const response = await api.post("/api/process-image", { imageUrl });

    if (response.data) {
      const newData: DeportationData = {
        date,
        arrests: response.data.arrests,
        detainers: response.data.detainers,
        imageUrl,
      };

      // Store in Supabase
      await storeData(newData);
    }
  } catch (error) {
    console.error("Error processing and storing data:", error);
    throw error;
  }
}

export async function storeData(data: DeportationData): Promise<void> {
  try {
    const { error } = await supabase.from("deportation_data").upsert(
      {
        date: data.date,
        arrests: data.arrests,
        detainers: data.detainers,
        image_url: data.imageUrl,
      },
      { onConflict: "date" }
    );

    if (error) throw error;
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
}

function isDataStale(data: DeportationData[] | null): boolean {
  if (!data || data.length === 0) return true;

  const mostRecentDate = new Date(data[0].date);
  const today = new Date();
  const timeDiff = today.getTime() - mostRecentDate.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return hoursDiff > 12; // Consider data stale if more than 12 hours old
}

// Separate function to fetch fresh data in the background
export async function fetchFreshData(): Promise<void> {
  try {
    console.log("Fetching fresh data in background...");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/deportation-data`
    );

    if (!response.ok) {
      throw new Error(`API error (${response.status})`);
    }

    const result = await response.json();
    if (result.status !== "success" || !result.data) {
      return; // No new data available
    }

    // Store any new data in Supabase
    await Promise.all(
      result.data.map((item: DeportationData) => storeData(item))
    );

    console.log("Fresh data stored successfully");
  } catch (error) {
    console.error("Error fetching fresh data:", error);
  }
}
