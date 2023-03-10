import { useMutation, useQueryClient } from "react-query";

// Sets the searches collection - at the moment just used to reset to empty when returning to the landing page
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
