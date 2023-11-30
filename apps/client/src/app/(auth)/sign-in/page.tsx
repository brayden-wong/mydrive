"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./_components/sign-in-form";

const SignInPage = async () => {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-slate-900">
      <Card className="w-10/12 sm:w-3/6">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
