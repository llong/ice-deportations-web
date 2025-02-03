import { renderHook, waitFor } from '@testing-library/react';
import { useDeportationData } from '../useDeportationData';
import { mockDeportationData } from '../../utils/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import * as api from '../../services/api';
import * as supabase from '../../services/supabase';

vi.mock('../../services/api');
vi.mock('../../services/supabase');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useDeportationData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('fetches and returns deportation data', async () => {
    vi.spyOn(api, 'fetchDeportationData').mockResolvedValueOnce(mockDeportationData);
    vi.spyOn(supabase, 'getCachedData').mockResolvedValueOnce([]);
    vi.spyOn(supabase, 'updateCachedData').mockResolvedValueOnce();

    const { result } = renderHook(() => useDeportationData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockDeportationData);
  });

  it('returns cached data when available and recent', async () => {
    const today = new Date();
    const recentData = [
      { ...mockDeportationData[0], date: today.toISOString().split('T')[0] }
    ];

    vi.spyOn(supabase, 'getCachedData').mockResolvedValueOnce(recentData);
    vi.spyOn(api, 'fetchDeportationData').mockResolvedValueOnce([]);

    const { result } = renderHook(() => useDeportationData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(recentData);
    expect(api.fetchDeportationData).not.toHaveBeenCalled();
  });
}); 