"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DefaultPage = () => {
  const cookieList = cookies();

  const accessToken = cookieList.get("access_token");
  const refreshToken = cookieList.get("refresh_token");

  if (!accessToken || !refreshToken) redirect("/sign-in");
};

export default DefaultPage;
