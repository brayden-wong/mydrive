"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./_components/sign-in-form";

const SignInPage = async () => {
  return (
    <Card className="w-10/12 sm:w-3/6">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
};

export default SignInPage;
