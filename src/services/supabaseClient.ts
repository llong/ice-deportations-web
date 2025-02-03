import { createClient } from "@supabase/supabase-js";
import { DeportationData } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getStoredData(): Promise<DeportationData[]> {
  try {
    const { data, error } = await supabase
      .from("deportation_data")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map((item) => ({
      date: item.date,
      arrests: item.arrests,
      detainers: item.detainers,
      imageUrl: item.image_url,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function storeData(data: DeportationData): Promise<void> {
  try {
    const { error } = await supabase
      .from("deportation_data")
      .upsert({
        date: data.date,
        arrests: data.arrests,
        detainers: data.detainers,
        image_url: data.imageUrl,
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return;
    }
  } catch (error) {
    console.error("Error storing data:", error);
  }
}
