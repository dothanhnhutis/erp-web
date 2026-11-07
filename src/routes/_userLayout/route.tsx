import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BellIcon, HomeIcon } from "lucide-react";
import { NavBreadcrumbs, useBreadcrumbs } from "#/components/nav-header";
import { Button, buttonVariants } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_userLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div>
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4">
          <Link
            to="/users"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-lg" }),
            )}
          >
            <HomeIcon />
          </Link>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <NavBreadcrumbs items={breadcrumbs} />
        </div>
        <div className="ml-auto px-4">
          <Button variant="outline" size="icon-lg">
            <BellIcon />
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
