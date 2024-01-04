import { useEffect } from "react";
import { useConvoPartial } from "../convos/useConvos";
import { useCurrentThread } from "../../utils/useCurrentThread";
import { getConvoPartialFromThreadId } from "../convos/convoHelpers";

export const SendMessageWatcher = () => {
  const { threadId } = useCurrentThread();
  const partial = getConvoPartialFromThreadId(threadId ?? undefined);
  const { updateLastTouched } = useConvoPartial(partial ?? null);
  function checkForSentMessage(e: React.KeyboardEvent) {
    if (
      partial &&
      e.key === "Enter" &&
      e.target === document.querySelector(".msg-form__contenteditable")
    ) {
      console.log("updating last touched?", partial);
      updateLastTouched();
    }
  }

  useEffect(() => {
    document.addEventListener("keyup", checkForSentMessage);

    return () => document.removeEventListener("keyup", checkForSentMessage);
  }, [checkForSentMessage, threadId]);

  return <></>;
};
