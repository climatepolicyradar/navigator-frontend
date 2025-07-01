import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import useCountries from "@/hooks/useCountries";

describe("useCountries", () => {
  it("successfully fetches geographies data", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

    const { result } = renderHook(() => useCountries(), { wrapper });

    await waitFor(() => {
      return result.current.isSuccess;
    });

    expect(result.current.data).toEqual({});
  });
});
