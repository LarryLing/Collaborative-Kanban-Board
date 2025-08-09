import {
  createFileRoute,
  Link,
  redirect,
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
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import AuthAlert from "@/components/auth/AuthAlert";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: ResetPassword,
});

function ResetPassword() {
  const [error, setError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const navigate = useNavigate();

  const { email } = useSearch({ from: "/reset-password" }) as EmailSearchBody;

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      confirmationCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordForm) {
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
