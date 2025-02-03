import { useState } from "react";
import axios from "axios";

export const TestImageProcessor = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testProcessing = async () => {
    if (!imageUrl) {
      setError("Please enter an image URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/test-image-processing`,
        { imageUrl }
      );

      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-2">Test Image Processing</h4>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter image URL"
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={testProcessing}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Test Process Image"}
      </button>

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
