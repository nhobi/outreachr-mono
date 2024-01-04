import { useContext, useState } from "react";
import { useConvos } from "../convos/useConvos";
import { ScreenContext } from "./ScreenContext";
import clsx from "clsx";
import { ConvoList } from "../convos/ConvoList";
import { TagsPage } from "../tags/TagsPage";
import { createPortal } from "react-dom";
import { Today } from "../today/Today";

export const ScreenRouter = () => {
  const { setScreen, screen } = useContext(ScreenContext);
  const { tags, today } = useConvos();
  const portalTarget = document.getElementById("menu-items-portal");

  if (!setScreen || !screen) return null;

  const [tagFilters, setTagFilters] = useState<string[]>([]);

  return (
    <div>
      {portalTarget &&
        createPortal(
          <>
            <button
              type="button"
              className={clsx(
                "rounded px-2 py-1 mr-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 relative",
                screen === "TODAY" && "bg-indigo-50 shadow-sm",
              )}
              onClick={() => setScreen("TODAY")}
            >
              Today
              <div className="w-[18px] h-[18px] text-[10px] rounded-full flex items-center justify-center text-white bg-red-600 shadow-small font-bold absolute top-[-8px] right-[-8px]">
                {today.length}
              </div>
            </button>

            <button
              type="button"
              className={clsx(
                "rounded px-2 mr-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100",
                screen === "CONVOS" && "bg-indigo-50 shadow-sm",
              )}
              onClick={() => setScreen("CONVOS")}
            >
              Convos
            </button>

            <button
              type="button"
              className={clsx(
                "rounded px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100",
                screen === "TAGS" && "bg-indigo-50 shadow-sm",
              )}
              onClick={() => setScreen("TAGS")}
            >
              Tags
            </button>
          </>,
          portalTarget,
        )}
      {screen === "TODAY" && <Today tags={tags} convos={today} />}

      {screen === "CONVOS" && (
        <ConvoList tagFilters={tagFilters} setTagFilters={setTagFilters} />
      )}
      {screen === "TAGS" && (
        <TagsPage
          handleViewContactsClick={(tagId) => {
            setTagFilters([tagId]);
            setScreen("CONVOS");
          }}
        />
      )}
    </div>
  );
};
