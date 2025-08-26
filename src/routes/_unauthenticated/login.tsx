import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import type { LoginForm } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { LoginSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_unauthenticated/login")({
  component: Login,
});

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: LoginForm) => {
    await login(values.email, values.password);
    navigate({ to: "/" });
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password below to login to your account.
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link className="text-sm text-primary hover:underline" to="/forgot-password">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Need an account?</p>
            <Link className="text-primary font-medium hover:underline" to="/signup">
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
