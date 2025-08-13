import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { EmailSearchBody, ResetPasswordForm } from "@/lib/types";
import { ResetPasswordSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/_unauthenticated/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const [error, setError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const navigate = useNavigate();

  const { email } = useSearch({
    from: "/_unauthenticated/reset-password",
  }) as EmailSearchBody;

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      confirmationCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordForm) {
    if (email === undefined) {
      throw new Error("Email has not been provided");
    }

    try {
      await resetPassword(email, values.password, values.confirmationCode);
      navigate({ to: "/login" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm px-6 py-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-y-5"
            >
              <h1 className="text-xl font-semibold">Forgot Password</h1>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
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
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
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
            <p>Remember your password?</p>
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Go back
            </Link>
          </div>
          {error && (
            <AuthAlert title="Failed to reset password" error={error} />
          )}
        </Card>
      </div>
    </section>
  );
}
