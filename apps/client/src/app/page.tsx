import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetch } from "@mydrive/eden";

export const revalidate = 0;

const DefaultPage = async () => {
  const cookieList = cookies();

  const accessToken = cookieList.get("accessToken")?.value;
  const refreshToken = cookieList.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) redirect("/sign-in");

  const { data, error } = await fetch("/auth/verify", {
    method: "POST",
    body: {
      accessToken,
      refreshToken,
    },
  });

  if (error) return redirect("/sign-in");

  redirect("/dashboard");
};

export default DefaultPage;
