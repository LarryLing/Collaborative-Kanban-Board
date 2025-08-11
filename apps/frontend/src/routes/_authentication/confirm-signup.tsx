import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ConfirmSignupForm, EmailSearchBody } from "@/lib/types";
import { ConfirmSignupSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import AuthAlert from "@/components/auth/auth-alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export const Route = createFileRoute("/_authentication/confirm-signup")({
  component: ConfirmSignup,
});

function ConfirmSignup() {
  const [error, setError] = useState<string | null>(null);

  const { confirmSignUp, resendSignUp } = useAuth();

  const navigate = useNavigate();

  const { email } = useSearch({
    from: "/_authentication/confirm-signup",
  }) as EmailSearchBody;

  const form = useForm<ConfirmSignupForm>({
    resolver: zodResolver(ConfirmSignupSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  async function onSubmit(values: ConfirmSignupForm) {
    if (email === undefined) {
      throw new Error("Email has not been provided");
    }

    try {
      await confirmSignUp(email, values.confirmationCode);
      navigate({ to: "/login" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }

  const handleResendCode = async () => {
    if (email === undefined) {
      throw new Error("Email has not been provided");
    }

    try {
      await resendSignUp(email);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm px-6 py-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-y-5"
            >
              <h1 className="text-xl font-semibold">Confirm Sign Up</h1>
              <FormField
                control={form.control}
                name="confirmationCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirmation Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
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
              <Button type="submit" className="w-full">
                Continue to login
              </Button>
            </form>
          </Form>
          <div className="w-full text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Didn't receive a code?</p>
            <p
              onClick={handleResendCode}
              className="text-primary font-medium hover:underline"
            >
              Resend code
            </p>
          </div>
          {error && (
            <AuthAlert title="Failed to confirm sign up" error={error} />
          )}
        </Card>
      </div>
    </section>
  );
}
