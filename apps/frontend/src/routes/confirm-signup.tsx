import {
  createFileRoute,
  redirect,
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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import AuthAlert from "@/components/auth/AuthAlert";

export const Route = createFileRoute("/confirm-signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: ConfirmSignup,
});

function ConfirmSignup() {
  const [error, setError] = useState<string | null>(null);

  const { confirmSignUp } = useAuth();

  const navigate = useNavigate();

  const { email } = useSearch({ from: "/confirm-signup" }) as EmailSearchBody;

  const form = useForm<ConfirmSignupForm>({
    resolver: zodResolver(ConfirmSignupSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  async function onSubmit(values: ConfirmSignupForm) {
    try {
      await confirmSignUp(email, values.confirmationCode);
      navigate({ to: "/" });
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
              <h1 className="text-xl font-semibold">Confirm Sign Up</h1>
              <FormField
                control={form.control}
                name="confirmationCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirmation Code</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
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
          {error && (
            <AuthAlert title="Failed to confirm sign up" error={error} />
          )}
        </Card>
      </div>
    </section>
  );
}
