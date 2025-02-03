import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const TestDatabaseButton = () => {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const testDatabase = async () => {
    try {
      setStatus("Testing...");
      setError("");

      // Test backend API database connection
      const apiResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/test-db`
      );
      const apiResult = await apiResponse.json();

      if (apiResult.status !== "success") {
        throw new Error(apiResult.message);
      }

      // Test frontend Supabase connection
      const { data, error } = await supabase
        .from("deportation_data")
        .select("*")
        .limit(1);

      if (error) throw error;

      setStatus(
        `Success! Backend DB: ${apiResult.written?.date}, Frontend DB: ${data?.[0]?.date}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Database test failed");
      setStatus("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={testDatabase}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Test Database
      </button>
      {status && (
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded shadow">
          {status}
        </div>
      )}
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-800 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};
