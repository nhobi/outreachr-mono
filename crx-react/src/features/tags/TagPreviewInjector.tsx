import { useEffect, useState } from "react";
import { useCurrentUser } from "../user/currentUser";
import { getConvoTags, useConvos } from "../convos/useConvos";
import { ConvoPartial, getConvoPartial } from "../convos/convoHelpers";
import { createPortal } from "react-dom";

export const TagPreviewInjector = () => {
  const [nodes, setNodes] = useState<Element[]>([]);

  function handleMouseover() {
    const targetParentMessageListItems = document.querySelectorAll(
      ".msg-conversation-listitem:not(.has-preview)",
    );

    setNodes(Array.from(targetParentMessageListItems));
  }

  useEffect(() => {
    document.addEventListener("mouseover", handleMouseover);

    return () => document.removeEventListener("mouseover", handleMouseover);
  }, []);

  return (
    <>
      {nodes.map((el) => {
        const partial = getConvoPartial(el as HTMLElement);

        if (!partial) {
          return null;
        }

        return createPortal(
          <TagPreview convoPartial={partial} />,
          el,
          `convoLi.${partial.threadId}`,
        );
      })}
    </>
  );
};

const TagPreview = (props: { convoPartial: ConvoPartial }) => {
  const currentUser = useCurrentUser();
  const { currentConvo } = useConvos(props.convoPartial?.threadId);

  if (!currentUser || !currentConvo) {
    return;
  }

  const currentConvoTags = getConvoTags(currentConvo);

  const tags = currentConvoTags.map((tagId) => {
    return currentUser.tags.find((t) => t.id === tagId);
  });

  return (
    <div className="absolute right-0 bottom-0 p-4 flex text-xs">
      {tags
        .filter((t) => t)
        .map((t) => (
          <>
            {t && (
              <div className="group bg-gradient-to-l from-purple-100 to-blue-200 rounded-md shadow rounded-full ml-1  px-4">
                {t.emoji}{" "}
                <span className="hide group-hover:inline cursor-default">
                  {t.label}
                </span>
              </div>
            )}
          </>
        ))}
    </div>
  );
};
