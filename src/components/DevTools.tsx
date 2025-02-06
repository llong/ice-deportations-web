import { TestImageProcessor } from "./TestImageProcessor";

interface DevToolsProps {
  loading: boolean;
  onForceRefresh: () => void;
}

export function DevTools({ loading, onForceRefresh }: DevToolsProps) {
  // Early return if not in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm mt-8">
      <h4 className="text-lg font-semibold mb-2">Test Image Processing</h4>
      <TestImageProcessor />
      <div className="mt-4">
        <button
          onClick={onForceRefresh}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Force Refresh Data"}
        </button>
      </div>
    </div>
  );
}
