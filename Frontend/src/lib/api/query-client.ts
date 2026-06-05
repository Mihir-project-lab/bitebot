import { QueryClient } from '@tanstack/react-query';

export const queryClientOptions = {
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed GET requests 3 times
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute stale time
    },
    mutations: {
      retry: 0, // Never retry mutations automatically to avoid duplicate database operations
    },
  },
};

export function createQueryClient() {
  return new QueryClient(queryClientOptions);
}
