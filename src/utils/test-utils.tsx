import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
      ),
  };
}

export const mockDeportationData = [
  { date: '2024-01-01', arrests: 100, detainers: 50, imageUrl: 'test1.jpg' },
  { date: '2024-01-02', arrests: 150, detainers: 75, imageUrl: 'test2.jpg' },
  { date: '2024-01-03', arrests: 125, detainers: 60, imageUrl: 'test3.jpg' },
]; 