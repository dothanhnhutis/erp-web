import { Link, useLocation } from "@tanstack/react-router";
import {
  BadgeDollarSignIcon,
  ChevronRight,
  FlaskConicalIcon,
  type LucideIcon,
  MirrorRoundIcon,
  SettingsIcon,
  UserKeyIcon,
  UsersIcon,
  WarehouseIcon,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

export type NavSideBar = {
  title: string;
  url?: string | undefined;
  icon: LucideIcon;
  items?: (NavSiderBarItem | NavSideBar)[];
};

export type NavSiderBarItem = {
  title: string;
  url: string;
};

const navMain: NavSideBar[] = [
  {
    title: "Người dùng & Vai trò ",
    icon: UserKeyIcon,
    items: [
      {
        title: "Người dùng",
        url: "/users",
      },
      {
        title: "Vai trò",
        url: "/roles",
      },
    ],
  },
  {
    title: "Kho",
    url: "/",
    icon: WarehouseIcon,
  },
  {
    title: "Sản xuất",
    url: "/",
    icon: MirrorRoundIcon,
  },
  {
    title: "Kiểm nghiệm",
    url: "/",
    icon: FlaskConicalIcon,
  },
  {
    title: "Bán hàng",
    url: "/",
    icon: BadgeDollarSignIcon,
  },
  {
    title: "Cài đặt",
    url: "/",
    icon: SettingsIcon,
    items: [
      {
        title: "Chung",
        url: "/genera",
        // icon: ShieldKeyholeIcon,
      },
      {
        title: "Chính sách & bảo mật",
        url: "/sessions",
        // icon: KeyRoundIcon,
      },
      {
        title: "Phiên đăng nhập",
        url: "/sessions",
        // icon: KeyRoundIcon,
      },
      {
        title: "Thông báo",
        url: "/notification",
        // icon: KeyRoundIcon,
      },
      {
        title: "Giao diện",
        url: "/notification",
        // icon: KeyRoundIcon,
      },
    ],
  },
];

// Match by whole segments so "/roles" covers "/roles/1/edit" but not "/rolesx".
const isPathActive = (url: string | undefined, pathname: string) =>
  !!url &&
  url !== "#" &&
  (url === "/"
    ? pathname === "/"
    : pathname === url || pathname.startsWith(`${url}/`));

const isNavActive = (
  item: NavSideBar | NavSiderBarItem,
  pathname: string,
): boolean =>
  isPathActive(item.url, pathname) ||
  ("items" in item &&
    !!item.items?.some((child) => isNavActive(child, pathname)));

export function NavMain() {
  const pathname =
    useLocation({ select: (location) => location.pathname }).replace(
      /\/+$/,
      "",
    ) || "/";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navMain.map((item) => (
          <Fragment key={item.title}>{generateNav(item, pathname)}</Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavGroup({
  item,
  pathname,
}: {
  item: NavSideBar & Required<Pick<NavSideBar, "items">>;
  pathname: string;
}) {
  const active = isNavActive(item, pathname);
  const [open, setOpen] = useState(active);

  // Open the group when navigating into one of its pages, but never auto-close it.
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={<SidebarMenuItem />}
    >
      {item.url ? (
        <>
          <SidebarMenuButton
            isActive={isPathActive(item.url, pathname)}
            render={<Link to={item.url} />}
            tooltip={item.title}
          >
            <item.icon />
            <span>{item.title}</span>
          </SidebarMenuButton>

          <CollapsibleTrigger
            render={<SidebarMenuAction className="data-panel-open:rotate-90" />}
          >
            <ChevronRight />
            <span className="sr-only">Toggle</span>
          </CollapsibleTrigger>
        </>
      ) : (
        <SidebarMenuButton render={<CollapsibleTrigger />} tooltip={item.title}>
          <item.icon />
          <span>{item.title}</span>
          <ChevronRight className="ml-auto group-data-panel-open/menu-button:rotate-90" />
        </SidebarMenuButton>
      )}

      <CollapsibleContent>
        <SidebarMenuSub className="mr-0 pr-0">
          {item.items.map((child) => (
            <Fragment key={child.title}>
              {generateNav(child, pathname)}
            </Fragment>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function generateNav(
  item: NavSideBar | NavSiderBarItem,
  pathname: string,
): React.ReactNode {
  if ("icon" in item) {
    if (item.items) {
      return (
        <NavGroup item={{ ...item, items: item.items }} pathname={pathname} />
      );
    }
    return (
      <SidebarMenuButton
        isActive={isPathActive(item.url, pathname)}
        render={<Link to={item.url} />}
        tooltip={item.title}
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton
      isActive={isPathActive(item.url, pathname)}
      render={<Link to={item.url} />}
      tooltip={item.title}
    >
      <span>{item.title}</span>
    </SidebarMenuButton>
  );
}
