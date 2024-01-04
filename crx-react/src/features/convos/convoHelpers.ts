export function getConvoPartial(convoLi: HTMLElement) {
    const anchor = convoLi.querySelector("a");
    const nameEl = convoLi.querySelector(
        ".msg-conversation-listitem__participant-names",
    ) as HTMLElement | null | undefined;
    if (!anchor || !nameEl) return null;

    const convoId = anchor?.href.split("/")[5];

    return {
        name: nameEl.innerText,
        url: anchor.href,
        threadId: convoId,
    };
}

export const getConvoPartialFromThreadId = (threadId?: string) => {
    if (!threadId) return;

    const li = document.querySelector(`[href*='${threadId}']`)?.closest("li");

    if (li) {
        return getConvoPartial(li);
    } else {
        return undefined;
    }
};
export type ConvoPartial = ReturnType<typeof getConvoPartial>;
