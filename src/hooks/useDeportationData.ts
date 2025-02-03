import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import {
  fetchDeportationData,
  fetchFreshData,
} from "../services/deportationService";
import { DeportationData } from "../types";

export function useDeportationData() {
  const [data, setData] = useState<DeportationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedFetch = useCallback(
    debounce(async () => {
      try {
        const { data: initialData, isStale } = await fetchDeportationData();
        setData(initialData);

        if (isStale) {
          await fetchFreshData();
          const { data: freshData } = await fetchDeportationData();
          setData(freshData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  return { data, loading, error };
}
