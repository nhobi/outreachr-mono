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
import { AuthError, Session } from "@supabase/supabase-js";
import { Layout } from "./Layout";
import { supabase } from "./api/supabase";
import { handleUserSignUp } from "./api/authClient";

const App = () => {
  const [hasCheckedForSession, setHasCheckedForSession] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const [error, setError] = useState("");
  const currentUser = useCurrentUser(session ?? undefined);

  const [screen, setScreen] = useState<Screen>("TODAY");

  async function getSession() {
    const {
      data: { session },
    } = await supabase.auth.refreshSession();

    if (session) {
      setSession(session);
    }

    setHasCheckedForSession(true);
  }

  useEffect(() => {
    getSession();
  }, []);

  async function handleSignUp(email: string, password: string) {
    try {
      await handleUserSignUp(email, password);
      await getSession();
      setScreen("SIGN_IN");
    } catch (e) {
      if (e instanceof AuthError) {
        setError(e.message);
      } else {
        throw e;
      }
    }
  }

  async function handleSignIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setError(error.message);

    setSession(data.session);
    setScreen("TODAY");
  }

  async function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("Sign out of Outrachr?")) {
      return;
    }

    const signOutResult = await supabase.auth.signOut();
    if (!signOutResult.error) {
      setScreen("SIGN_IN");
      setSession(null);
    } else {
      throw signOutResult.error;
    }
  }

  if (!hasCheckedForSession) {
    return null;
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
        >
          <p className="text-sm">
            <strong>Welcome to Outreachr!</strong> This is an extension by{" "}
            <a href="https://codecareermastery.com">Code Career Mastery</a> that
            helps you track LinkedIn relationships. <br />
            <br />
            <i>
              Note that this extension is currently in beta. Please{" "}
              <a href="https://www.linkedin.com/in/annamiller/">
                reach out to me
              </a>{" "}
              with your feedback or any issues you encounter. -Anna
            </i>
          </p>
        </SignIn>
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
      ></SignIn>
    );
  }
  if (!currentUser || !currentUser.id) return null;

  return (
    <ScreenContext.Provider value={{ setScreen, screen }}>
      <SessionContext.Provider value={{ ...session, currentUser }}>
        <ScreenRouter handleSignOut={handleSignOut} />
        <TagsContextMenu />
        <TagPreviewInjector />
        <SendMessageWatcher />
      </SessionContext.Provider>
    </ScreenContext.Provider>
  );
};

export default App;
