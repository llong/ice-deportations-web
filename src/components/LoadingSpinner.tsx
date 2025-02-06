export const LoadingSpinner = () => {
  return (
    <output className="flex justify-center items-center h-64">
      <div
        data-testid="spinner-animation"
        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"
      ></div>
      <span className="sr-only">Loading deportation data...</span>
    </output>
  );
};
