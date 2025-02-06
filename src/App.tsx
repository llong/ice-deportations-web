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
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["deportationData"],
    queryFn: async () => {
      const { data: deportationData, error } = await supabase
        .from("deportation_data")
        .select("*")
        .order("date", { ascending: false })
        .throwOnError();

      if (error) throw error;
      return deportationData || [];
    },
  });

  // Handle query error
  useEffect(() => {
    if (queryError) {
      setError(
        queryError instanceof Error ? queryError.message : "Failed to load data"
      );
    }
  }, [queryError]);

  useEffect(() => {
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
          toast.loading("Fetching new data...", { id: "realtime-update" });
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ["deportationData"] });
          toast.success("Data updated!", { id: "realtime-update" });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const forceRefresh = async () => {
    try {
      setRefreshing(true);
      toast.loading("Refreshing data...", { id: "refresh-toast" });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clear-cache`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to refresh data");

      // Wait for backend processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["deportationData"] });

      toast.success("Data refreshed!", { id: "refresh-toast" });
    } catch (error) {
      console.error("Error forcing refresh:", error);
      toast.error("Failed to refresh data", { id: "refresh-toast" });
    } finally {
      setRefreshing(false);
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
                onClick={forceRefresh}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <StatsDisplay data={data} loading={loading} />
              {data?.length > 0 && (
                <>
                  <div className="mt-12">
                    <Chart key={JSON.stringify(data)} data={data} />
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
