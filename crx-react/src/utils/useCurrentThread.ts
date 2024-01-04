import { useEffect, useState } from "react";
import { getThreadIdFromPath } from "./useLinkedInPath";

export const useCurrentThread = () => {
  const initialThread = getThreadIdFromPath(location.pathname);
  const [threadId, setThreadId] = useState<string | null | undefined>(
    initialThread,
  );

  useEffect(() => {
    const mutObs = new MutationObserver(() => {
      setThreadId(getThreadIdFromPath(location.pathname) ?? null);
    });

    const messagePageMainEl = document.querySelector(".msg__list-detail");

    if (messagePageMainEl) {
      mutObs.observe(messagePageMainEl, { childList: true, subtree: true });
    }

    return () => {
      mutObs.disconnect();
    };
  }, []);

  return {
    threadId,
  };
};
