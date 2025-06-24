import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

export const renderWithQueryClient = (children: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
};
