import browser from "webextension-polyfill";
import { useEffect, useState } from "react";
import { SignIn } from "./features/signIn/SignIn";
import "./assets/css/App.css";
import { useCurrentUser } from "./features/user/currentUser";
import { TagsContextMenu } from "./features/tags/TagsContextMenu";
import { SessionContext } from "./features/session/SessionContext";
import { TagPreviewInjector } from "./features/tags/TagPreviewInjector";
import { Screen, ScreenContext } from "./features/screen/ScreenContext";
import { ScreenRouter } from "./features/screen/ScreenRouter";
import { SendMessageWatcher } from "./features/sendMessageWatcher/SendMessageWatcher";
import { Session } from "@supabase/supabase-js";
import { Layout } from "./Layout";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  const [error, setError] = useState("");
  const currentUser = useCurrentUser(session ?? undefined);

  const [screen, setScreen] = useState<Screen>("TODAY");

  async function getSession() {
    const {
      data: { session },
    } = await browser.runtime.sendMessage({ action: "getSession" });

    if (session) {
      setSession(session);
    }
  }

  useEffect(() => {
    getSession();
  }, []);

  async function handleSignUp(email: string, password: string) {
    await browser.runtime.sendMessage({
      action: "signup",
      value: { email, password },
    });
    setScreen("SIGN_IN");
  }

  async function handleSignIn(email: string, password: string) {
    const { data, error } = await browser.runtime.sendMessage({
      action: "signin",
      value: { email, password },
    });
    if (error) return setError(error.message);

    setSession(data.session);
  }

  async function handleSignOut() {
    const signOutResult = await browser.runtime.sendMessage({
      action: "signout",
    });
    setScreen("SIGN_IN");
    setSession(signOutResult.data);
  }

  if (!session) {
    if (screen === "SIGN_UP") {
      return (
        <SignIn
          onSignIn={handleSignUp}
          title={"Sign Up"}
          onScreenChange={() => {
            setScreen("SIGN_IN");
            setError("");
          }}
          helpText={"Got an account? Sign in"}
          error={error}
        />
      );
    }

    return (
      <SignIn
        title="Sign In"
        onSignIn={handleSignIn}
        onScreenChange={() => {
          setScreen("SIGN_UP");
          setError("");
        }}
        helpText={"Create an account"}
        error={error}
      />
    );
  }
  if (!currentUser) return null;

  return (
    <ScreenContext.Provider value={{ setScreen, screen }}>
      <SessionContext.Provider value={{ ...session, currentUser }}>
        <Layout>
          <ScreenRouter />
        </Layout>
        <TagsContextMenu />
        <TagPreviewInjector />
        <SendMessageWatcher />
      </SessionContext.Provider>
    </ScreenContext.Provider>
  );
};

export default App;
