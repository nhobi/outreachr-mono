import { useState } from "react";
import { useSession } from "../session/SessionContext";
import { TagForm } from "../tags/TagForm";

type Props = {
  handleViewContactsClick: (tagId: string) => void;
};

export const TagsPage = ({ handleViewContactsClick }: Props) => {
  const [editingTagId, setEditingTagId] = useState<string | null | "new">(null);
  const { currentUser } = useSession();

  const tags = currentUser?.tags ?? [];

  const editingTag =
    editingTagId === "new"
      ? { label: "", remindMeDays: 3, emoji: "" }
      : tags.find((t) => t.id === editingTagId);

  if (editingTag) {
    return <TagForm tag={editingTag} onClose={() => setEditingTagId(null)} />;
  }

  return (
    <div className="pt-4">
      {tags.map((t) => (
        <div className="group flex justify-between mb-5 hover:bg-white rounded px-1 items-center">
          <span>
            {t.emoji} {t.label}
          </span>

          <div className="group-hover:opacity-100 opacity-0 text-xs">
            <button
              className="mr-4"
              onClick={() => setEditingTagId(t.id ?? "")}
            >
              Edit
            </button>

            <button onClick={() => handleViewContactsClick(t.id ?? "")}>
              View Convos &rarr;
            </button>
          </div>
        </div>
      ))}
      <button className="px-1" onClick={() => setEditingTagId("new")}>
        + New Tag
      </button>
    </div>
  );
};
