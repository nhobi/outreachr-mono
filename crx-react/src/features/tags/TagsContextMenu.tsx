import { useEffect, useState } from "react";
import { ConvoPartial, getConvoPartial } from "../convos/convoHelpers";
import { useConvoPartial } from "../convos/useConvos";
import { useSession } from "../session/SessionContext";
import clsx from "clsx";

export const TagsContextMenu = () => {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [convoPartial, setConvoPartial] = useState<ConvoPartial | null>(null);
  const session = useSession();

  const { updateLastTouched, convoMutation, currentConvo, updateConvo } =
    useConvoPartial(convoPartial);

  function hasTag(tagId: string) {
    const convoTags = convoMutation.variables?.tags || currentConvo?.tags;

    return convoTags && convoTags[tagId];
  }

  function closeMenu() {
    setConvoPartial(null);
    setMenuPos(null);
  }

  function handleContextMenu(this: Document, e: MouseEvent) {
    const target = e.target as HTMLElement;

    const targetParentMessageListItem = target?.closest(
      ".msg-conversation-listitem",
    ) as HTMLElement | null | undefined;

    if (!targetParentMessageListItem) return;

    e.preventDefault();

    setMenuPos({
      x: e.x,
      y: e.y,
    });

    const convoPartial = getConvoPartial(targetParentMessageListItem);

    setConvoPartial(convoPartial);
  }

  function checkForTeardown(this: Document, e: MouseEvent) {
    if (
      e.target instanceof HTMLElement &&
      e.target.closest("#outreachr-context-menu")
    )
      return;

    closeMenu();
  }

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousedown", checkForTeardown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousedown", checkForTeardown);
    };
  }, []);

  if (!menuPos) return null;

  const menuPosStyle = {
    top: `${menuPos.y}px`,
    left: `${menuPos.x}px`,
  };

  const tags = session.currentUser?.tags;

  function toggleTag(tagId: string) {
    const newTags = currentConvo?.tags ?? {};

    if (newTags[tagId]) {
      delete newTags[tagId];
    } else {
      newTags[tagId] = true;
    }
    debugger;
    updateConvo({
      tags: newTags,
    });
  }

  if (tags) {
    return (
      <div
        className="fixed text-sm rounded-sm overflow-hidden border bg-gradient-to-r from-purple-100 to-blue-200 rounded-md shadow-xl rounded"
        style={{ ...menuPosStyle, width: "200px" }}
        id="outreachr-context-menu"
      >
        <h1 className="p-4 py-2 font-bold text-center text-slate-50 text-xs bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {convoPartial?.name}
        </h1>

        {tags.map((tag) => {
          if (tag.id === undefined) {
            return null;
          }

          return (
            <button
              className={clsx(
                hasTag(tag.id) && "bg-blue-600 font-bold text-white",
                "p-4 w-full border-t border text-left text-[12px]",
              )}
              onClick={() => toggleTag(tag.id)}
            >
              {tag.emoji}&nbsp;
              {tag.label}
            </button>
          );
        })}
        <hr className="m-0" />
        <button
          onClick={updateLastTouched}
          className="text-sm p-4 border-t border-zinc-800 italic bg-grey-100"
        >
          Update Last Touchpoint to Now
        </button>
      </div>
    );
  } else {
    return null;
  }
};
