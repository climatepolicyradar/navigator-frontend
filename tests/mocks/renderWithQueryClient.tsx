import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

export const renderWithQueryClient = (children: React.ReactElement) => {
  const queryClient = new QueryClient();
  render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
};
