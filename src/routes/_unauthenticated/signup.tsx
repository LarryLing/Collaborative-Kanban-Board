import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import type { SignupForm } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { SignupSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_unauthenticated/signup")({
  component: SignUp,
});

function SignUp() {
  const { signUp } = useAuth();

  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
    },
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (values: SignupForm) => {
    await signUp(values.givenName, values.familyName, values.email, values.password);
    navigate({ search: { email: values.email }, to: "/confirm-signup" });
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Sign up</CardTitle>
            <CardDescription className="text-center">Enter your credentials to create a new account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="flex flex-col items-center gap-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="givenName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>Password</FormLabel>
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
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Already a user?</p>
            <Link className="text-primary font-medium hover:underline" to="/login">
              Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
