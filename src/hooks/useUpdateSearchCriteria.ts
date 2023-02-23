import { useMutation, useQueryClient } from "react-query";

export default function useUpdateSearchCriteria() {
  const queryClient = useQueryClient();

  return useMutation(
    async (value: any) => {
      return queryClient.setQueryData("searchCriteria", (old: Object) => ({
        ...old,
        ...value,
      }));
    },

    {
      onError: (err) => {
        console.log(err);
      },
    }
  );
}
