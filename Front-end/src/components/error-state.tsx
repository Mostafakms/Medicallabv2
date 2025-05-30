import React from 'react';
import { Button } from '@/components/ui/button';
import { QueryClient } from '@tanstack/react-query';

interface ErrorStateProps {
  error: Error | null;
  queryKey: string[];
  queryClient: QueryClient;
}

export function ErrorState({ error, queryKey, queryClient }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <h2 className="text-xl font-semibold text-red-600">Failed to load data</h2>
      <p className="text-gray-600">{error?.message || "An error occurred while fetching the data"}</p>
      <Button onClick={() => queryClient.invalidateQueries({ queryKey })}>
        Try Again
      </Button>
    </div>
  );
}
