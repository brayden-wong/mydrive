"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "../_actions/login";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignInForm = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form className="flex flex-col items-start justify-center gap-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="text-[1rem] font-semibold tracking-wide"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full space-y-0.5">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="text-[1rem] font-semibold tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-start gap-x-2">
          <Button className="w-32" type="submit" formAction={login}>
            <span>Sign In</span>
          </Button>
          <Link href="/sign-up" className="group text-sm font-medium">
            Don't have an account?{" "}
            <span className="group-hover:underline">Sign Up!</span>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export { SignInForm };
