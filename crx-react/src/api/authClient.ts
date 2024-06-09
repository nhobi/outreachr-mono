import { CurrentUser } from "../features/user/currentUser";
import { queryDb } from "./api";
import { supabase } from "./supabase";

export async function handleUserSignUp(email: string, password: string) {
  const signupResult = await supabase.auth.signUp({ email, password });

  if (signupResult.error) {
    throw signupResult.error;
  }

  if (!(signupResult.data.session && signupResult.data.user)) {
    throw new Error("Session not set when signing up user: " + email);
  }

  await queryDb<CurrentUser[]>({
    table: "users",
    method: "POST",
    userToken: signupResult.data.session?.access_token,
    body: {
      id: signupResult.data.user?.id,
      tags: DEFAULT_TAGS,
    },
  });
}

const DEFAULT_TAGS = [
  {
    id: "at0a4os",
    emoji: "🚀",
    label: "Follow Up",
    remindMeDays: 2,
  },
  {
    id: "y2p6b0li",
    emoji: "😀",
    label: "Referral",
    remindMeDays: 3,
  },
  {
    id: "ns89r37",
    emoji: "💼",
    label: "Client",
    remindMeDays: 10,
  },
  {
    id: "sqgtsaz",
    emoji: "✅",
    label: "Lead",
    remindMeDays: 3,
  },
  {
    id: "ywxcvmwj",
    emoji: "📣",
    label: "Collab",
    remindMeDays: 3,
  },
  {
    id: "dkb7gkej",
    emoji: "📅",
    label: "Two Week Checkin",
    remindMeDays: 14,
  },
];
