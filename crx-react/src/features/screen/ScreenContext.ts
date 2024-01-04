import { createContext } from "react";

export type Screen = "SIGN_IN" | "SIGN_UP" | "CONVOS" | "TAGS" | "TODAY";

export type TScreenContext = {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>> | undefined;
};

export const ScreenContext = createContext<TScreenContext>({
  screen: "TODAY",
  setScreen: undefined,
});
