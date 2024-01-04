import { useEffect, useRef, useState } from "react";

// Events to trigger our path change check.
const EVENT_CHECK = ["mouseover", "mouseup"];

// Checks for the presence of this string when looking at the path to see if we're in a thread.
const THREAD_STRING_CHECK = "messaging/thread/2-";

const THREAD_CHECK_TIMEOUT = 100;

// /messaging/thread/2-NzNlM2Y4ZTQtNTljMi00OTNjLWI5MDAtZjcyZmZkZGZmYWE0XzAxMg==/
// should return 2-NzNlM2Y4ZTQtNTljMi00OTNjLWI5MDAtZjcyZmZkZGZmYWE0XzAxMg==
export const getThreadIdFromPath = (path: string | undefined) => {
  if (!path) return undefined;

  return path.includes(THREAD_STRING_CHECK) ? path.split("/")[3] : null;
};

export const useLinkedInPath = () => {
  const [path, setPath] = useState(window.location.pathname);
  const timer = useRef<number | undefined>(undefined);

  function handleLocationChange() {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (window.location.pathname !== path) {
        setPath(window.location.pathname);
      }
    }, THREAD_CHECK_TIMEOUT);
  }

  useEffect(() => {
    EVENT_CHECK.forEach((e) =>
      window.addEventListener(e, handleLocationChange),
    );

    return () =>
      EVENT_CHECK.forEach((e) =>
        window.removeEventListener(e, handleLocationChange),
      );
  }, []);

  return {
    path,
    threadId: getThreadIdFromPath(path),
  };
};
