"use server";

import { fetch } from "@mydrive/eden";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const refreshTokens = async () => {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) redirect("/sign-in");

  const { data, error } = await fetch("/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      refreshToken,
    },
  });

  if (error) redirect("/sign-in");

  cookie.set("accessToken", data.data.accessToken, { httpOnly: true });
  cookie.set("refreshToken", data.data.refreshToken, { httpOnly: true });
};

export { refreshTokens };
