import React from "react";
import {Sidebar} from "./sidebar.styles";
import {HomeIcon} from "../../icons/sidebar/home-icon";
import {PaymentsIcon} from "../../icons/sidebar/payments-icon";
import {BalanceIcon} from "../../icons/sidebar/balance-icon";
import {AccountsIcon} from "../../icons/sidebar/accounts-icon";
import {CustomersIcon} from "../../icons/sidebar/customers-icon";
import {ProductsIcon} from "../../icons/sidebar/products-icon";
import {ViewIcon} from "../../icons/sidebar/view-icon";
import {SettingsIcon} from "../../icons/sidebar/settings-icon";
import {CollapseItems} from "./collapse-items";
import {SidebarItem} from "./sidebar-item";
import {SidebarMenu} from "./sidebar-menu";
import {ChangeLogIcon} from "../../icons/sidebar/changelog-icon";
import {usePathname} from "next/navigation";
import {Tooltip} from "@nextui-org/tooltip";
import {useSidebarContext} from "../layouts/Layout-context";
import {Image} from "@nextui-org/image";
import {ArrowLeft} from "@/components/icons/ArrowLeft";
import clsx from "clsx";
import {AlignRight} from "@/components/icons/AlignRight";

export const SidebarWrapper = () => {
    const pathname = usePathname();
    const {collapsed, setCollapsed} = useSidebarContext();

    const handleClick = () => {
        setCollapsed();
    };
    return (
        <aside className="h-screen z-[20] sticky top-0">
            {collapsed ? (
                <div className={Sidebar.Overlay()} onClick={setCollapsed}/>
            ) : null}
            <div className={Sidebar({collapsed})} >
                <div
                    className={clsx(
                        "min-h-20 flex items-center w-full",
                        collapsed
                            ? "flex-col justify-center gap-2"
                            : "justify-between"
                    )}
                >
                    <div className="flex justify-center items-center">
                        <Tooltip content="House Deport" placement="bottom-end">
                            <Image src="imgs/logo.png" alt="House Deport" width={40} height={40}/>
                        </Tooltip>
                        {
                            !collapsed && (
                                <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400">
                                    House Deport
                                </h1>
                            )
                        }
                    </div>

                    <div
                        className={clsx(
                            "flex items-center justify-center cursor-pointer p-1 rounded",
                            "dark:hover:bg-primary-100 hover:bg-default-100",
                            collapsed ? "min-w-10 min-h-10 rounded-xl dark:bg-gray-100" : "rotate-180"
                        )}
                        onClick={handleClick}
                    >
                        {collapsed ? (
                            <AlignRight
                                size={20}
                                color="#71717a"
                            />
                        ) : (
                            <ArrowLeft
                                size={20}
                                color="#71717a"
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between h-full">
                <div className={Sidebar.Body()}>
                        <SidebarItem
                            title="Home"
                            icon={<HomeIcon/>}
                            isActive={pathname === "/"}
                            href="/"
                        />

                        <SidebarMenu title="Menu">
                            <SidebarItem
                                isActive={pathname === "/users"}
                                title="Usuarios"
                                icon={<AccountsIcon/>}
                                href="users"
                            />
                            <SidebarItem
                                isActive={pathname === "/clients"}
                                title="Clientes"
                                icon={<CustomersIcon/>}
                                href="clients"
                            />

                            <CollapseItems
                                icon={<PaymentsIcon/>}
                                title="Venta"
                                items={[
                                    {label: "Ventas", href: "/orders"},
                                    {label: "Emitir venta", href: "/createOrder"},
                                ]}
                            />

                            <CollapseItems
                                icon={<BalanceIcon/>}
                                title="Almacén"
                                items={[
                                    {label: "Almacén", href: "/warehouses"},
                                    {label: "WarehouseProduct", href: "/warehouseProduct"},

                                ]}
                            />
                        </SidebarMenu>

                        <SidebarMenu title="Inventario">
                            <SidebarItem
                                isActive={pathname === "/categories"}
                                title="Categorias"
                                icon={<ProductsIcon/>}
                                href="categories"
                            />
                            <SidebarItem
                                isActive={pathname === "/sizes"}
                                title="Tallas"
                                icon={<ProductsIcon/>}
                                href="sizes"
                            />

                            <SidebarItem
                                isActive={pathname === "/products"}
                                title="Productos"
                                icon={<ProductsIcon/>}
                                href="products"
                            />
                        </SidebarMenu>

                        <SidebarMenu title="General">

                            <SidebarItem
                                isActive={pathname === "/view"}
                                title="View Test Data"
                                icon={<ViewIcon/>}
                            />
                            <SidebarItem
                                isActive={pathname === "/settings"}
                                title="Settings"
                                icon={<SettingsIcon/>}
                            />
                        </SidebarMenu>

                        <SidebarMenu title="Updates">
                            <SidebarItem
                                isActive={pathname === "/changelog"}
                                title="Changelog"
                                icon={<ChangeLogIcon/>}
                            />
                        </SidebarMenu>
                    </div>
                </div>
            </div>
        </aside>
    );
};
