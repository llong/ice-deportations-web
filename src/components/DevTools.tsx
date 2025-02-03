import { TestImageProcessor } from "./TestImageProcessor";

interface DevToolsProps {
  readonly onForceRefresh: () => Promise<void>;
  readonly loading: boolean;
}

export function DevTools({ onForceRefresh, loading }: DevToolsProps) {
  return (
    <div className="mt-8 border-t pt-4">
      <button
        onClick={onForceRefresh}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        Force Refresh
      </button>
      <TestImageProcessor />
    </div>
  );
}
