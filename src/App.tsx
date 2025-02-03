import { useEffect, useState } from "react";
import {
  Header,
  StatsDisplay,
  Chart,
  Footer,
  ErrorBoundary,
  PredictionDisplay,
} from "./components";
import {
  fetchDeportationData,
  fetchFreshData,
} from "./services/deportationService";
import { DeportationData } from "./types";
import { toast, Toaster } from "react-hot-toast";
import { supabase } from "./lib/supabase";

export default function App() {
  const [data, setData] = useState<DeportationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: deportationData, error } = await supabase
        .from("deportation_data")
        .select("*")
        .order("date", { ascending: false })
        .throwOnError();

      if (error) throw error;
      setData(deportationData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const subscription = supabase
      .channel("deportation_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deportation_data",
        },
        () => {
          console.log("Database changed, refreshing data...");
          fetchData();
        }
      )
      .subscribe();

    // Also poll every minute as a fallback
    const pollInterval = setInterval(fetchData, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const { data: initialData, isStale } = await fetchDeportationData();
      setData(initialData);

      if (isStale && !refreshing) {
        setRefreshing(true);
        toast.loading("Checking for new data...", { id: "refresh-toast" });

        await fetchFreshData();

        const { data: freshData } = await fetchDeportationData();
        setData(freshData);

        toast.success("Data updated!", { id: "refresh-toast" });
        setRefreshing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = async () => {
    try {
      setLoading(true);
      toast.loading("Refreshing data...", { id: "refresh-toast" });

      // Clear backend cache and trigger new fetch
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clear-cache`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh data");
      }

      // Wait a moment for the backend to process new data
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Fetch fresh data from Supabase
      await fetchData();

      toast.success("Data refreshed!", { id: "refresh-toast" });
    } catch (error) {
      console.error("Error forcing refresh:", error);
      toast.error("Failed to refresh data", { id: "refresh-toast" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Header onForceRefresh={forceRefresh} loading={loading} />
        <main className="container mx-auto px-4 py-8">
          {error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-700">
              {error}
              <button
                onClick={loadData}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <StatsDisplay data={data} loading={loading} />
              {data.length > 0 && (
                <>
                  <div className="mt-12">
                    <Chart data={data} />
                  </div>
                  <PredictionDisplay data={data} />
                </>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
