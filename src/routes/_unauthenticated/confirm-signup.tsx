import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";

import type { ConfirmSignupForm, EmailSearchBody } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { ConfirmSignupSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_unauthenticated/confirm-signup")({
  component: ConfirmSignup,
});

function ConfirmSignup() {
  const { confirmSignUp, resendSignUp } = useAuth();

  const navigate = useNavigate();

  const { email } = useSearch({
    from: "/_unauthenticated/confirm-signup",
  }) as EmailSearchBody;

  const form = useForm<ConfirmSignupForm>({
    defaultValues: {
      confirmationCode: "",
    },
    resolver: zodResolver(ConfirmSignupSchema),
  });

  const onSubmit = async (values: ConfirmSignupForm) => {
    if (email === undefined) {
      throw new Error("Email has not been provided");
    }

    await confirmSignUp(email, values.confirmationCode);
    navigate({ to: "/login" });
  };

  const handleResendCode = async () => {
    if (email === undefined) {
      throw new Error("Email has not been provided");
    }

    await resendSignUp(email);
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Confirm sign up</CardTitle>
            <CardDescription className="text-center">
              Enter the confirmation code we sent you to verify your account.
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
                <Button className="w-full" type="submit">
                  Continue to login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Didn't receive a code?</p>
            <p className="text-primary font-medium hover:underline" onClick={handleResendCode}>
              Resend code
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
