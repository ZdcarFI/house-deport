import React from "react";
import { Sidebar } from "./sidebar.styles";
import { HomeIcon } from "../../icons/sidebar/home-icon";
import { PaymentsIcon } from "../../icons/sidebar/payments-icon";
import { BalanceIcon } from "../../icons/sidebar/balance-icon";
import { AccountsIcon } from "../../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../../icons/sidebar/customers-icon";
import { ProductsIcon } from "../../icons/sidebar/products-icon";
import { ReportsIcon } from "../../icons/sidebar/reports-icon";
import { DevIcon } from "../../icons/sidebar/dev-icon";
import { ViewIcon } from "../../icons/sidebar/view-icon";
import { SettingsIcon } from "../../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../../icons/sidebar/filter-icon";
import { ChangeLogIcon } from "../../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { Tooltip } from "@nextui-org/tooltip";
import { Avatar } from "@nextui-org/avatar";
import { useSidebarContext } from "../layouts/Layout-context";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div className={Sidebar({ collapsed })}>

        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />

            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={pathname === "/users"}
                title="Users"
                icon={<AccountsIcon />}
                href="users"
              />
              <SidebarItem
                isActive={pathname === "/clients"}
                title="Clients"
                icon={<CustomersIcon />}
                href="clients"
              />

              <CollapseItems
                icon={<PaymentsIcon />}
                title="Orders"
                items={[
                  { label: "orders", href: "/orders" },
                  { label: "createOrders", href: "/createOrder" },

                ]}
              />

              <CollapseItems
                icon={<BalanceIcon />}
                title="Warehouse"
                items={[
                  { label: "Warehouses", href: "/warehouses" },
                  { label: "WarehouseProduct", href: "/warehouseProduct" },

                ]}
              />
            </SidebarMenu>

            <SidebarMenu title="Inventory Management">
              <SidebarItem
                isActive={pathname === "/categories"}
                title="Categories"
                icon={<ProductsIcon />}
                href="categories"
              />
              <SidebarItem
                isActive={pathname === "/sizes"}
                title="Sizes"
                icon={<ProductsIcon />}
                href="sizes"
              />

              <CollapseItems
                icon={<ProductsIcon />}
                title="Orders"
                items={[
                  { label: "products", href: "/products" },
                  { label: "createProducts", href: "/createProduct" },

                ]}
              />


            </SidebarMenu>

            <SidebarMenu title="General">

              <SidebarItem
                isActive={pathname === "/view"}
                title="View Test Data"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>

        </div>
      </div>
    </aside>
  );
};
