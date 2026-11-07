import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_userLayout/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_userLayout/settings"!</div>;
}
