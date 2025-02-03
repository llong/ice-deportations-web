import React from "react";
import { ErrorDisplayProps } from "../types";

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div
      role="alert"
      className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      <h3 className="font-bold mb-2">Error</h3>
      <p>{error.message || "Failed to load deportation data"}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
};
