import { useState, useCallback } from "react";
import { DevTools } from "./DevTools";

interface HeaderProps {
  readonly onForceRefresh: () => Promise<void>;
  readonly loading: boolean;
}

export function Header({ onForceRefresh, loading }: HeaderProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showDevTools, setShowDevTools] = useState(false);

  const handleActionClick = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setShowDevTools(true);
        return 0;
      }
      return newCount;
    });
  }, []);

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-2">ICE Deportation Tracker</h1>
          <p className="text-blue-100">
            <span>Real-time tracking of ICE enforcement </span>
            <button
              onClick={handleActionClick}
              className={`select-none bg-transparent border-none text-blue-100 cursor-text ${
                clickCount > 0 ? "opacity-" + (60 + clickCount * 10) : ""
              }`}
              aria-label="Toggle developer tools"
            >
              actions
            </button>
            {/* Hidden element for screen readers */}
            <span className="sr-only">
              {clickCount > 0 && `${5 - clickCount} clicks remaining`}
            </span>
          </p>
        </div>
      </header>

      {showDevTools && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Developer Tools</h2>
              <button
                onClick={() => {
                  setShowDevTools(false);
                  setClickCount(0);
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close developer tools"
              >
                ✕
              </button>
            </div>
            <DevTools onForceRefresh={onForceRefresh} loading={loading} />
          </div>
        </div>
      )}
    </>
  );
}
