import { useContext, useState } from "react";
import { useConvos } from "../convos/useConvos";
import { ScreenContext } from "./ScreenContext";
import clsx from "clsx";
import { ConvoList } from "../convos/ConvoList";
import { TagsPage } from "../tags/TagsPage";
import { Today } from "../today/Today";
import { Layout } from "../../Layout";

export const ScreenRouter = (props: {
  handleSignOut: (e: React.MouseEvent) => void;
}) => {
  const { setScreen, screen } = useContext(ScreenContext);
  const { tags, today } = useConvos();

  if (!setScreen || !screen) return null;

  const [tagFilters, setTagFilters] = useState<string[]>([]);

  return (
    <Layout
      menuItems={
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
        </>
      }
    >
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

      <div className="flex justify-center align-center py-4">
        <button
          className="px-4 bg-white text-xs rounded-full border"
          onClick={props.handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </Layout>
  );
};
