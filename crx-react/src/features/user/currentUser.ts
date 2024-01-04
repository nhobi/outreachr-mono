import browser from "webextension-polyfill";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../session/SessionContext";

export const useCurrentUser = (s?: Session) => {
  const session = s || useSession();

  async function getCurrentUser() {
    if (!session?.user?.id) {
      return Promise.resolve(null);
    }
    const res = await browser.runtime.sendMessage({
      action: "fetch",
      value: {
        method: "GET",
        table: "users",
        select: "*",
        userToken: session?.access_token,
        query: {
          id: `eq.${session?.user?.id}`,
        },
      },
    });

    return res.result[0];
  }

  async function updateCurrentUser(updatedUser: { tags: Tag[] }) {
    const res = await browser.runtime.sendMessage({
      action: "fetch",
      value: {
        method: "PATCH",
        table: "users",
        userToken: session.access_token,
        body: { tags: updatedUser.tags },
        query: {
          id: `eq.${currentUser.id}`,
        },
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

  const mutation = useMutation({
    mutationFn: updateCurrentUser,
    onMutate: async (updatedUser) => {
      queryClient.setQueryData([queryKey], () => updatedUser);
    },
  });
  const currentUser = query.data;

  if (!query.isFetched || !session) {
    return null;
  }

  return {
    loggedIn: !!currentUser?.id,
    id: currentUser?.id,
    tags: (currentUser?.tags ?? []) as Tag[],
    userMutation: mutation,
  };
};

export type CurrentUser = {
  id: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  emoji: string;
  label: string;
  remindMeDays: number;
};
