import { Convo, useConvos } from "./useConvos";
import clsx from "clsx";
import { useRef } from "react";
import { formatDistance } from "date-fns";
import { remove } from "../../utils/removeFromCollection";
import { Tag } from "../user/currentUser";
import { useCurrentThread } from "../../utils/useCurrentThread";

type Props = {
  tagFilters: string[];
  setTagFilters: (filters: string[]) => void;
};
export const ConvoList = ({ tagFilters, setTagFilters }: Props) => {
  const { convos, tags } = useConvos();

  const filteredConvos =
    tagFilters.length === 0
      ? convos
      : convos.filter((c) => {
        const firstMatchingTag = tagFilters.find((t) => (c.tags ?? {})[t]);
        return !!firstMatchingTag;
      });

  function toggleTag(id: string) {
    if (tagFilters.includes(id)) {
      setTagFilters(remove(id, tagFilters));
    } else {
      setTagFilters([...tagFilters, id]);
    }
  }

  return (
    <>
      <div className="mb-4">
        {tags.map((t) => (
          <button
            className={clsx(
              "py-1 px-4 mb-2 text-xs rounded-full mr-2 shadow",
              tagFilters.includes(t.id) && "bg-white",
            )}
            onClick={() => toggleTag(t.id)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {filteredConvos.map((convo) => (
        <ConvoListItem allTags={tags} convo={convo} />
      ))}
    </>
  );
};

export const ConvoListItem = ({
  allTags,
  convo,
}: {
  convo: Convo;
  allTags: Tag[];
}) => {
  const { threadId } = useCurrentThread();
  const isActive = convo.thread_id && convo.thread_id === threadId;
  const clickIntervalRef = useRef<number | undefined>();
  const tags = allTags.filter((t) => convo.tags && convo.tags[t.id]);

  function handleButtonClick() {
    triggerThreadId(convo, clickIntervalRef);
  }

  const lastTouchpoiunt =
    convo.last_touchpoint &&
    formatDistance(new Date(convo.last_touchpoint), new Date(), {
      addSuffix: true,
    });

  return (
    <button
      className={clsx(
        "p-2 text-sm  text-left w-full rounded relative",
        isActive && "bg-white",
      )}
      onClick={handleButtonClick}
    >
      <div>{convo.meta.name}</div>

      <div className="absolute right-0 bottom-0 p-4 flex text-xs">
        {tags
          .filter((t) => t)
          .map((t) => (
            <>
              {t && (
                <div className="ml-1 group p-2">
                  {t.emoji}
                  <span className="hide group-hover:inline">
                    &nbsp;{t.label}
                  </span>
                </div>
              )}
            </>
          ))}
      </div>
      <div className="opacity-50">
        {convo.last_touchpoint && (
          <span className="text-xs capitalize">{lastTouchpoiunt}</span>
        )}

        {!convo.last_touchpoint && (
          <span className="text-xs">No interaction yet</span>
        )}
      </div>
    </button>
  );
};

const triggerThreadId = (
  convo: Convo,
  timerRef: React.MutableRefObject<number | undefined>,
) => {
  const name = convo.meta.name;
  const convoName = name.replace(/[^\w\s]/gi, "");

  if (!location.pathname.includes("messaging/thread")) {
    location.href = `/messaging/thread/${convo.thread_id}/`;
    return;
  }
  const link: HTMLAnchorElement | null = document.querySelector(
    `[href="/messaging/thread/${convo.thread_id}/"]`,
  );
  clearInterval(timerRef.current);

  if (link) {
    link.click();
  } else {
    const input: HTMLInputElement | null = document.querySelector(
      "#search-conversations",
    );

    if (!input) {
      return;
    }

    input.value = convoName;

    const keyupEvent = new KeyboardEvent("keyup", {
      key: "Enter",
      code: "Enter",
      which: 13,
      keyCode: 13,
    });

    // need this to show cancel button
    const changeEvent = new Event("change");

    input.dispatchEvent(changeEvent);

    // dispatch the event on some DOM element
    input.dispatchEvent(keyupEvent);

    timerRef.current = setInterval(() => {
      const link: HTMLAnchorElement | null = document.querySelector(
        `[href*="${convo.thread_id}"]`,
      );
      if (link) {
        link.click();

        clearInterval(timerRef.current);

        const input: HTMLInputElement | null = document.querySelector(
          ".msg-search-form__cancel-search",
        );

        input?.click();
      }
    }, 100);
  }
};
