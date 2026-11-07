import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "#/components/app-sidebar";
import NavHeader from "#/components/nav-header";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";

export const Route = createFileRoute("/_adminLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavHeader />

        <div className="container">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
