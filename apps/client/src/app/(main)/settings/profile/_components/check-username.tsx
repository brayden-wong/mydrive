"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, ChangeEvent } from "react";

type CheckUsernameProps = {
  username: string;
};

const CheckUsername = ({ username: defaultValue }: CheckUsernameProps) => {
  const [username, setUsername] = useState(defaultValue);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  useEffect(() => console.log(username), [username]);
  return (
    <div className="flex w-full items-center justify-start">
      <div className="flex w-full flex-col items-start justify-start gap-y-2">
        <Label>Username</Label>
        <Input
          className="w-96"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {}}
        />
      </div>
      <Button onClick={async () => {}} type="button">
        Check
      </Button>
    </div>
  );
};

export { CheckUsername };

{
  /* <Label>Username</Label>
          <Input
            className="w-1/2"
            name="username"
            defaultValue={user.username}
          />
          <Button
            formAction={async (formData: FormData) => {
              "use server";
              const accessToken = cookies().get("accessToken")?.value;
              const refreshToken = cookies().get("refreshToken")?.value;

              if (!accessToken || !refreshToken) redirect("/sign-in");

              if (!UsernameSchema.safeParse(formData)) return;

              const response = await fetch("/auth/refresh", {
                method: "POST",
                headers: {
                  authorization: `Bearer ${accessToken}`,
                },
                body: {
                  refreshToken,
                },
              });

              if (response.error) return redirect("/sign-in");

              const { accessToken: token } = response.data.data;

              const { username } = UsernameSchema.parse(formData);

              const { data, error } = await fetch("/");
            }}
          ></Button> */
}
