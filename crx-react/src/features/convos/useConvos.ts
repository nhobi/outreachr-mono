import browser from "webextension-polyfill";
import { useSession } from "../session/SessionContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateCollectionItem } from "../../utils/updateCollectionItem";
import { intervalToDuration } from "date-fns";
import { useCallback, useMemo } from "react";
import { ConvoPartial } from "./convoHelpers";

export const useConvos = (threadId?: string) => {
  const session = useSession();
  const queryClient = useQueryClient();

  async function getConvos() {
    const res = await browser.runtime.sendMessage({
      action: "fetch",
      value: {
        method: "GET",
        table: "convos",
        userToken: session.access_token,
        query: {
          user_id: `eq.${session.currentUser?.id}`,
        },
      },
    });

    return res.result as Convo[];
  }

  function upsertConvo(newConvo: Partial<Convo>) {
    if (newConvo.id) {
      return browser.runtime.sendMessage({
        action: "fetch",
        value: {
          method: "PATCH",
          table: "convos",
          select: "*",
          userToken: session.access_token,
          body: newConvo,
          query: {
            id: `eq.${newConvo.id}`,
          },
        },
      });
    } else {
      return browser.runtime.sendMessage({
        action: "fetch",
        value: {
          method: "POST",
          table: "convos",
          select: "*",
          userToken: session.access_token,
          body: {
            ...newConvo,
            user_id: session.currentUser?.id,
          },
        },
      });
    }
  }

  const queryKey = `convos`;
  const convoQuery = useQuery({
    queryKey: [queryKey],
    queryFn: getConvos,
    enabled: !!session.currentUser,
  });

  const convoMutation = useMutation({
    mutationKey: [threadId],

    mutationFn: upsertConvo,

    onSuccess: async (data) => {
      const newConvo = data.result[0] as Convo;
      queryClient.setQueryData([queryKey], (old: Convo[]) =>
        updateCollectionItem(old, newConvo),
      );
    },

    onSettled: async () => {
      // return await queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
  const match = convoQuery.data?.find((c) => c.thread_id === threadId);

  const currentConvo = { ...match };

  const convos = convoQuery.data ?? [];
  const tags = session.currentUser?.tags ?? [];
  const today = useMemo(() => {
    return convos.filter((c) => {
      if (c.tags === null) return false;
      const overdueTags = tags.filter((ct) => {
        const tagId = ct.id ?? "";
        if (!(c.tags ?? {})[tagId]) return false;

        if (!c.last_touchpoint) {
          return true;
        }

        const duration = intervalToDuration({
          start: new Date(c.last_touchpoint),
          end: new Date(),
        });
        console.log(
          duration,
          "duration",
          new Date(c.last_touchpoint),
          c.last_touchpoint,
        );

        if (duration?.days ?? 0 >= ct.remindMeDays) {
          return true;
        } else {
          return false;
        }
      });

      return overdueTags.length !== 0;
    });
  }, [tags, convos]);

  return {
    convoQuery,
    currentConvo: currentConvo,
    convoMutation,
    convos,
    tags,
    today,
  };
};

export type Convo = {
  id: number;
  thread_id: string;
  tags: Record<string, true> | null;
  last_touchpoint: string | null;
  created_at: string;
  meta: {
    name: string;
  };
};

export const getConvoTags = (convo: Convo | null) => {
  return Object.keys(convo?.tags || {});
};

export const useConvoPartial = (convoPartial: ConvoPartial) => {
  const { convoMutation, currentConvo } = useConvos(convoPartial?.threadId);

  const updateConvo = useCallback(
    function(updatedData: Partial<Convo>) {
      if (currentConvo?.id) {
        convoMutation.mutate({
          ...updatedData,
          id: currentConvo.id,
        });
      } else {
        convoPartial &&
          convoMutation.mutate({
            ...updatedData,
            thread_id: convoPartial.threadId,
            meta: {
              name: convoPartial.name,
            },
          });
      }
    },
    [currentConvo, convoPartial, convoMutation],
  );
  function updateLastTouched() {
    console.log("updating last touchd", currentConvo, "partial", convoPartial);
    updateConvo({
      last_touchpoint: new Date().toISOString(),
    });
  }

  return {
    updateConvo,
    updateLastTouched,
    currentConvo,
    convoMutation,
  };
};
