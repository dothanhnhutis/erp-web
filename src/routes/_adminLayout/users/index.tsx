import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_adminLayout/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="h-[2000px] ">Hello "/_adminLayout/user"!</div>;
}
