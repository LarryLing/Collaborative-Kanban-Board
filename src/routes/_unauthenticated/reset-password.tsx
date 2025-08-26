import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";

import type { EmailSearchBody, ResetPasswordForm } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { ResetPasswordSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_unauthenticated/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const { resetPassword } = useAuth();

  const navigate = useNavigate();

  const { email } = useSearch({
    from: "/_unauthenticated/reset-password",
  }) as EmailSearchBody;

  const form = useForm<ResetPasswordForm>({
    defaultValues: {
      confirmationCode: "",
      confirmPassword: "",
      password: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    if (email === undefined) {
      throw new Error("Email has not been provided");
    }

    await resetPassword(email, values.password, values.confirmationCode);
    navigate({ to: "/login" });
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Reset password</CardTitle>
            <CardDescription className="text-center">
              Enter the confirmation code we sent you and your new password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="flex flex-col items-center gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="confirmationCode"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirmation Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Continue to login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Remember your password?</p>
            <Link className="text-primary font-medium hover:underline" to="/login">
              Go back
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
