import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetch } from "@mydrive/eden";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { CheckUsername } from "./_components/check-username";

export const revalidate = 3600;

const UsernameSchema = zfd.formData({
  username: zfd.text(z.string().min(3).max(24)),
});

const ProfileSettingsPage = async () => {
  const token = cookies().get("accessToken")?.value;

  if (!token) return redirect("/sign-in");

  const { data, error } = await fetch("/users/data", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (error) redirect("/sign-in");

  const {
    data: { user },
  } = data;

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start gap-y-8 p-8">
      <div className="flex h-full w-full max-w-4xl flex-col gap-y-1.5">
        <h1 className="text-4xl font-bold tracking-wide">Profile Details</h1>
        <p className="text-muted-foreground">Update your profile details</p>
      </div>
      <form className="flex w-full max-w-4xl flex-col items-start justify-start gap-y-4">
        <div className="flex w-full flex-col items-start justify-start gap-y-2">
          <Label>Name</Label>
          <Input
            className="w-96"
            name="name"
            defaultValue={user.profile.name}
          />
        </div>
        <CheckUsername username={user.username} />
      </form>
    </main>
  );
};

export default ProfileSettingsPage;
