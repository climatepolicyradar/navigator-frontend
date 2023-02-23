import { useMutation, useQueryClient } from "react-query";

export default function useUpdateSearch() {
  const queryClient = useQueryClient();

  return useMutation(
    async (value: any) => {
      return queryClient.setQueryData("searches", (old: Object) => ({
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
