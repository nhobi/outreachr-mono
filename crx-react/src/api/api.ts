import { supabaseKey, supabaseUrl } from "./supabase";

type AllowedPrimitives = string | number | boolean | null | undefined;

type QueryDbBody = {
  [k: string]: AllowedPrimitives | QueryDbBody | QueryDbBody[];
};

type QueryDbParams = {
  userToken: string | undefined | null;
  table: string;
  method: "POST" | "PUT" | "GET" | "DELETE" | "PATCH";
  searchParams?: Record<string, string>;
  headers?: Record<string, string>;
  body?: QueryDbBody;
};

export async function queryDb<T>(request: QueryDbParams) {
  const { userToken, table, method, searchParams, body, headers } = request;
  let url = `${supabaseUrl}/rest/v1/${table}`;

  if (!userToken) {
    throw new Error("Access token not set.");
  }

  if (searchParams) {
    const queryString = new URLSearchParams(searchParams).toString();
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

  const json: T = await result.json();

  return { message: "Fetch Successful", result: json };
}
