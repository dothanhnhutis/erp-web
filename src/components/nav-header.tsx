import { Link, useLocation } from "@tanstack/react-router";
import { BellIcon, ChevronDownIcon, type LucideIcon } from "lucide-react";
import { Fragment, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

type NavBreadcrumb =
  | {
      type: "link";
      className?: string;
      label: string;
      url: string;
    }
  | {
      type: "page";
      className?: string;
      label: string;
    }
  | {
      type: "separator";
      className?: string;
      icon?: LucideIcon;
    }
  | {
      type: "dropdown";
      className?: string;
      label: string;
      items: { label: string; url: string }[];
    }
  | {
      type: "ellipsis";
      className?: string;
    };

type BreadcrumbRoute = {
  pattern: string;
  crumbs: (params: Record<string, string>) => NavBreadcrumb[];
};

const roleGroup: NavBreadcrumb = {
  type: "dropdown",
  label: "Người dùng & vai trò",
  items: [
    { label: "Người dùng", url: "/users" },
    { label: "Vai trò", url: "/roles" },
  ],
};
const roles: NavBreadcrumb[] = [
  roleGroup,
  { type: "link", label: "Vai trò", url: "/roles" },
];

const users: NavBreadcrumb[] = [
  roleGroup,
  { type: "link", label: "Người dùng", url: "/users" },
];

const settingGroup: NavBreadcrumb = {
  type: "dropdown",
  label: "Cài đặt",
  items: [
    { label: "Chung", url: "/settings" },
    { label: "Thông báo", url: "/settings/notification" },
  ],
};

const notification: NavBreadcrumb[] = [
  settingGroup,
  { type: "link", label: "Thông báo", url: "/settings/notification" },
];

// Separators are inserted automatically; a trailing link becomes the current page.
const breadcrumbRoutes: BreadcrumbRoute[] = [
  { pattern: "/roles", crumbs: () => roles },
  {
    pattern: "/roles/$id/edit",
    crumbs: () => [...roles, { type: "page", label: "Chỉnh sửa" }],
  },
  { pattern: "/users", crumbs: () => users },
  {
    pattern: "/users/$id/edit",
    crumbs: () => [...users, { type: "page", label: "Chỉnh sửa" }],
  },
  {
    pattern: "/settings",
    crumbs: () => [{ type: "page", label: "Chung" }],
  },
  {
    pattern: "/settings/notification",
    crumbs: () => notification,
  },
];

const matchPath = (
  pattern: string,
  path: string,
): Record<string, string> | null => {
  const patternSegments = pattern.split("/");
  const pathSegments = path.split("/");
  if (patternSegments.length !== pathSegments.length) return null;

  const params: Record<string, string> = {};
  for (const [i, segment] of patternSegments.entries()) {
    if (segment.startsWith("$")) params[segment.slice(1)] = pathSegments[i];
    else if (segment !== pathSegments[i]) return null;
  }
  return params;
};

const fromSegments = (path: string): NavBreadcrumb[] =>
  path
    .split("/")
    .filter(Boolean)
    .map((segment, i, segments) => ({
      type: "link",
      label: decodeURIComponent(segment),
      url: `/${segments.slice(0, i + 1).join("/")}`,
    }));

const withSeparators = (items: NavBreadcrumb[]): NavBreadcrumb[] => {
  const last = items.at(-1);
  if (!last) return [];

  const ancestors = items.slice(0, -1).flatMap((item): NavBreadcrumb[] => [
    { ...item, className: "hidden md:block" },
    { type: "separator", className: "hidden md:block" },
  ]);
  const current: NavBreadcrumb =
    last.type === "link" ? { type: "page", label: last.label } : last;

  return [...ancestors, current];
};

export const useBreadcrumbs = () => {
  const pathname = useLocation({ select: (location) => location.pathname });

  return useMemo(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    for (const route of breadcrumbRoutes) {
      const params = matchPath(route.pattern, path);
      if (params) return withSeparators(route.crumbs(params));
    }
    return withSeparators(fromSegments(path));
  }, [pathname]);
};

const renderItem = (nav: NavBreadcrumb) => {
  switch (nav.type) {
    case "link":
      return (
        <BreadcrumbItem className={nav.className}>
          <BreadcrumbLink render={<Link to={nav.url} />}>
            {nav.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    case "page":
      return (
        <BreadcrumbItem className={nav.className}>
          <BreadcrumbPage>{nav.label}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    case "separator": {
      const Icon = nav.icon;
      // undefined (not false) so BreadcrumbSeparator falls back to its default icon
      return (
        <BreadcrumbSeparator className={nav.className}>
          {Icon ? <Icon /> : undefined}
        </BreadcrumbSeparator>
      );
    }
    case "dropdown":
      return (
        <BreadcrumbItem className={nav.className}>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground [&>svg]:size-3.5">
              {nav.label}
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto">
              {nav.items.map((item) => (
                <DropdownMenuItem
                  key={item.url}
                  render={<Link to={item.url} />}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      );
    case "ellipsis":
      return (
        <BreadcrumbItem className={nav.className}>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
      );
    default:
      nav satisfies never;
      return null;
  }
};

export const NavBreadcrumbs = ({ items }: { items: NavBreadcrumb[] }) => (
  <Breadcrumb>
    <BreadcrumbList>
      {items.map((nav, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable list
        <Fragment key={idx}>{renderItem(nav)}</Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);

const NavHeader = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
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
  );
};

export default NavHeader;
