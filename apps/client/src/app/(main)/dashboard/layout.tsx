import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { UserNavigation } from "../_components/user-navigation";
import { fetch } from "@mydrive/eden";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 3600;

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const token = cookies().get("accessToken")?.value;

  if (!token) return redirect("/sign-in");

  const { data, error } = await fetch("/users/me", {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (error) redirect("/sign-in");

  const {
    data: { user },
  } = data;

  return (
    <main className="flex min-h-screen w-screen flex-col items-start justify-center">
      <nav className="flex h-full w-full flex-col px-4 py-2">
        <div className="flex h-14 w-full items-center justify-between">
          <h1>My Drive</h1>
          <div>
            <Input className="w-96" />
          </div>
          <UserNavigation {...user}>
            <div>children</div>
          </UserNavigation>
        </div>
      </nav>
      <div className="flex grow">{children}</div>
    </main>
  );
};

export default DashboardLayout;
