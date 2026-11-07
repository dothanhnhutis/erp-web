import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_adminLayout/roles")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_adminLayout/roles"!</div>;
}
