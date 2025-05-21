import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { EventRegister } from 'react-native-event-listeners';
import { api } from './api';

// Create a custom event listener for loading state
export const LOADING_EVENT = 'loading-state-changed';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Set up global loading state tracking
queryClient.getQueryCache().subscribe(() => {
  const isLoading = queryClient.isFetching() > 0;
  EventRegister.emit(LOADING_EVENT, isLoading);
});

// Types for API operations
type ApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

// Generic API hooks factory
export const apiHooks = {
  // Query hook for GET requests
  useGet: <TData = unknown, TTransformed = TData>(
    endpoint: string,
    options?: Omit<UseQueryOptions<TData, AxiosError, TTransformed>, 'queryKey' | 'queryFn'>,
  ) => {
    return useQuery<TData, AxiosError, TTransformed>({
      queryKey: [endpoint],
      queryFn: async () => {
        const {data} = await api.get(endpoint);
        return data?.data?.data || data?.data;
      },
      ...options,
    });
  },

  // Mutation hook for POST requests
  usePost: <TData = unknown, TVariables = unknown>(
    endpoint: string,
    options?: Omit<
      UseMutationOptions<ApiResponse<TData>, AxiosError, TVariables>,
      'mutationFn'
    >,
  ) => {
    return useMutation<ApiResponse<TData>, AxiosError, TVariables>({
      mutationFn: async (variables) => {
        const {data} = await api.post(endpoint, variables);
        return data;
      },
      ...options,
    });
  },

  // Mutation hook for PUT requests
  usePut: <TData = unknown, TVariables = unknown>(
    endpoint: string,
    options?: Omit<
      UseMutationOptions<ApiResponse<TData>, AxiosError, TVariables>,
      'mutationFn'
    >,
  ) => {
    return useMutation<ApiResponse<TData>, AxiosError, TVariables>({
      mutationFn: async (variables) => {
        const {data} = await api.put(endpoint, variables);
        return data;
      },
      ...options,
    });
  },

  // Mutation hook for DELETE requests
  useDelete: <TData = unknown>(
    endpoint: string,
    options?: Omit<
      UseMutationOptions<ApiResponse<TData>, AxiosError, string>,
      'mutationFn'
    >,
  ) => {
    return useMutation<ApiResponse<TData>, AxiosError, string>({
      mutationFn: async (id) => {
        const {data} = await api.delete(`${endpoint}/${id}`);
        return data;
      },
      ...options,
    });
  },
};
