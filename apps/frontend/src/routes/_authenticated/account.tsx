import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account")({
  component: Account,
});

function Account() {
  return <div>Hello "/_authenticated/account"!</div>;
}
