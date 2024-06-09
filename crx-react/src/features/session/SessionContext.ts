import { createContext, useContext } from "react";
import { CurrentUser } from "../user/currentUser";
import { Session } from "@supabase/supabase-js";

export type SessionContextValue = Session & {
  currentUser: CurrentUser;
};
export const SessionContext = createContext<SessionContextValue | null>(null);

export const useSession = () => {
  const sessionContextValue = useContext(SessionContext);
  return { ...sessionContextValue };
};
