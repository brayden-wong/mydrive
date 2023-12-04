import { cookies } from "next/headers";
import { ReactNode } from "react";
import { fetch } from "@mydrive/eden";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const cookie = cookies();

  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;

  if (!accessToken || !refreshToken)
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-background">
        {children}
      </main>
    );

  const { error } = await fetch("/auth/verify", {
    method: "POST",
    body: {
      accessToken,
      refreshToken,
    },
  });

  if (error)
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-background">
        {children}
      </main>
    );

  return redirect("/dashboard");
};

export default AuthLayout;
