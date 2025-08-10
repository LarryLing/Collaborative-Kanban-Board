import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ForgotPasswordForm } from "@/lib/types";
import { ForgotPasswordSchema } from "@/lib/schemas";
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

export const Route = createFileRoute("/_authentication/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);

  const { requestPasswordReset } = useAuth();

  const navigate = useNavigate();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordForm) {
    try {
      await requestPasswordReset(values.email);
      navigate({ to: "/reset-password" });
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
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send password recovery
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
            <AuthAlert title="Failed to request password reset" error={error} />
          )}
        </Card>
      </div>
    </section>
  );
}
