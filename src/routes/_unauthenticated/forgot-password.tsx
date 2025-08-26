import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import type { ForgotPasswordForm } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ForgotPasswordSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_unauthenticated/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const { requestPasswordReset } = useAuth();

  const navigate = useNavigate();

  const form = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    await requestPasswordReset(values.email);
    navigate({ search: { email: values.email }, to: "/reset-password" });
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Forgot password</CardTitle>
            <CardDescription className="text-center">
              Enter your email and we'll send you a confirmation code to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="flex flex-col items-center gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
                <Button className="w-full" type="submit">
                  Send password recovery
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
