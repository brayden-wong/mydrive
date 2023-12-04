"use server";

import { fetch } from "@mydrive/eden";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";
import { zfd } from "zod-form-data";

const LoginSchema = zfd.formData({
  username: zfd.text(z.string()),
  password: zfd.text(z.string().min(8)),
});

const signIn = async (formData: FormData) => {
  const loginData = LoginSchema.safeParse(formData);

  if (!loginData.success) return loginData.error;

  const { username, password } = loginData.data;

  const { data, error } = await fetch("/auth/login", {
    method: "POST",
    body: {
      username,
      password,
    },
    next: {
      revalidate: 0,
    },
  });

  if (error)
    switch (error.status) {
      case 400:
      case 401:
        return error.message;
      default:
        throw error;
    }

  const cookie = cookies();

  cookie.set("accessToken", data.data.accessToken, { httpOnly: true });
  cookie.set("refreshToken", data.data.refreshToken, { httpOnly: true });

  redirect("/dashboard");
};

export { signIn };
