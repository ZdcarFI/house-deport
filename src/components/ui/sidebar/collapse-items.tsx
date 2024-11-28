"use client";
import React, {useState} from "react";
import {ChevronDownIcon} from "../../icons/sidebar/chevron-down-icon";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import Link from "next/link";
import {usePathname} from "next/navigation"; // Para obtener la ruta actual
import clsx from "clsx";
import {useSidebarContext} from "@/components/ui/layouts/Layout-context";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import {SidebarItem} from "@/components/ui/sidebar/sidebar-item";
import {CustomersIcon} from "@/components/icons/sidebar/customers-icon";
import {Tooltip} from "@nextui-org/tooltip";

interface Props {
    icon: React.ReactNode;
    title: string;
    items: { label: string; href: string }[];
}

export const CollapseItems = ({icon, items, title}: Props) => {
    const pathname = usePathname();
    const {collapsed} = useSidebarContext();

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        console.log("isOpen", isOpen);
        setIsOpen(!isOpen)
    };
    const handleClose = () => setIsOpen(false);

    if (collapsed) {
        const isActive = items.some((item) => item.href === pathname);
        return (


            <Popover
                placement="right"
                isOpen={isOpen}
                onClose={handleClose}
                className="z-auto"
            >
                <PopoverTrigger>
                    <div>
                        <Tooltip content={title} placement="right">
                            <div
                                onClick={handleToggle}
                                className={clsx(
                                    "flex gap-2 min-w-10 min-h-10 h-full items-center rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]",
                                    collapsed ? "justify-center dark:bg-gray-100" : "px-3.5",
                                    isActive
                                        ? "bg-primary-100 [&_svg_path]:fill-primary-500"
                                        : "hover:bg-default-100",
                                )}
                            >

                                {icon}

                            </div>
                        </Tooltip>
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col gap-1 py-2">
                        {items.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={handleClose}
                                    className={clsx(
                                        "w-full px-4 py-2 hover:bg-default-100 rounded-lg hover:text-red",
                                        {
                                            "text-blue-600 font-semibold": isActive,
                                        }
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>

        );
    }

    const isActive = items.some((item) => item.href === pathname);

    return (
        <div className="flex gap-4 h-full items-center cursor-pointer">

            <Tooltip content={title} placement="right">
                <Accordion className="px-0">
                    <AccordionItem
                        indicator={<ChevronDownIcon/>}
                        classNames={{
                            indicator: "data-[open=true]:-rotate-180",
                            trigger:
                                `${isActive ? "bg-primary-100 [&_svg_path]:fill-primary-500 [&_span]:text-primary-500" : "hover:bg-default-100"} py-0 min-h-[44px] rounded-xl active:scale-[0.98] transition-transform px-3.5`,

                            title:
                                "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
                        }}
                        aria-label="Accordion 1"
                        title={
                            <div
                                className={clsx(
                                    "flex gap-2 min-w-10 min-h-10 h-full items-center rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]",
                                    collapsed ? "justify-center dark:bg-gray-100" : "",
                                )}
                            >
                                {icon}
                                <span className="text-default-900">{title}</span>
                            </div>
                        }
                    >
                        <div className="pl-12">
                            {items.map((item, index) => {
                                // Comparamos el href con la ruta actual para determinar si está activo
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={clsx(
                                            "w-full flex text-default-500 hover:text-primary-600 transition-colors hover:bg-default-100 rounded-lg px-2",
                                            isActive ? "text-primary-600 font-semibold" : "",
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </AccordionItem>
                </Accordion>
            </Tooltip>
        </div>
    );
};
