import { Session } from "@supabase/supabase-js";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "../session/SessionContext";
import { queryDb } from "../../api/api";

export const useCurrentUser = (s?: Session) => {
  const session = s || useSession();

  async function getCurrentUser() {
    if (!session?.user?.id || !session?.access_token) {
      console.error("No active session.");
      return Promise.resolve(null);
    }

    const res = await queryDb<CurrentUser[]>({
      method: "GET",
      table: "users",
      userToken: session?.access_token,
      searchParams: {
        id: `eq.${session?.user?.id}`,
      },
    });

    return res.result[0];
  }

  async function updateCurrentUser(updatedUser: { tags: Tag[] }) {
    if (!currentUser || !session?.access_token) {
      console.error("No active session.");
      return Promise.resolve(null);
    }

    const res = await queryDb<CurrentUser[]>({
      method: "PATCH",
      table: "users",
      userToken: session.access_token,
      body: { tags: updatedUser.tags },
      searchParams: {
        id: `eq.${currentUser.id}`,
      },
    });

    return res.result[0] as CurrentUser;
  }

  const userId = session?.user?.id ?? "anon";

  const queryClient = useQueryClient();
  const queryKey = `user.${userId}`;
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: getCurrentUser,
  });

  const currentUser = query.data;
  const mutation = useMutation({
    mutationFn: updateCurrentUser,
    onMutate: async (updatedUser) => {
      if (currentUser) {
        queryClient.setQueryData([queryKey], () => ({
          ...updatedUser,
          id: currentUser.id,
        }));
      }
    },
  });

  if (!query.isFetched || !session || !currentUser?.id) {
    return null;
  }

  return {
    loggedIn: true,
    id: currentUser.id,
    tags: (currentUser?.tags ?? []) as Tag[],
    userMutation: mutation,
  };
};

export type CurrentUser = {
  id: string;
  tags: Tag[];
  loggedIn: boolean;
  userMutation: UseMutationResult<
    CurrentUser | null,
    Error,
    { tags: Tag[] },
    void
  >;
};

export type Tag = {
  id: string;
  emoji: string;
  label: string;
  remindMeDays: number;
};
