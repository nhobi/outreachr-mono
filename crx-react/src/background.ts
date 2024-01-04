import browser from "webextension-polyfill";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_STAGE,
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

type Message =
  | {
    action: "getSession" | "signout";
    value: null;
  }
  | {
    action: "signup" | "signin";
    value: {
      email: string;
      password: string;
    };
  }
  | {
    action: "fetch";
    value: {
      userToken: string;
      table: string;
      method: "GET" | "POST" | "PATCH";
      query: Record<string, string> | null;
      body: Record<string, any> | null;
      headers: Record<string, string> | null;
    };
  };

type ResponseCallback = (data: Record<string, unknown>) => void;

async function handleMessage(
  { action, value }: Message,
  response: ResponseCallback,
) {
  if (action === "fetch") {
    const { userToken, table, method, query, body, headers } = value;
    let url = `${supabaseUrl}/rest/v1/${table}`;

    if (query) {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    }

    const result = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: "Bearer " + userToken,
        Prefer: "return=representation",
        ...(headers ?? []),
      },
      body: body ? JSON.stringify(body) : null,
    });

    const json = await result.json();

    response({ message: "Fetch Successful", result: json });
  } else if (action === "signup") {
    const result = await supabase.auth.signUp(value);
    response({ message: "Successfully signed up!", data: result });
  } else if (action === "signin") {
    console.log("requesting auth");
    const { data, error } = await supabase.auth.signInWithPassword(value);
    response({ data, error });
  } else if (action === "getSession") {
    supabase.auth.getSession().then(response);
  } else if (action === "signout") {
    const { error } = await supabase.auth.signOut();
    response({ data: null, error });
  } else {
    response({ data: null, error: "Unknown action" });
  }
}

browser.runtime.onMessage.addListener((msg, sender, response) => {
  handleMessage(msg, response);
  return true;
});
