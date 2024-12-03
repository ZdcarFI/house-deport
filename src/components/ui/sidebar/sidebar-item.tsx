import NextLink from "next/link";
import React from "react";
import clsx from "clsx";
import {useSidebarContext} from "../layouts/Layout-context";
import {Tooltip} from "@nextui-org/tooltip";



interface Props {
    title: string;
    icon: React.ReactNode;
    isActive?: boolean;
    href?: string;
    variant?: "default" | "basic";
}

export const SidebarItem = ({icon, title, isActive, href = "", variant="default"}: Props) => {
    const {collapsed, setCollapsed} = useSidebarContext();

    const handleClick = () => {
        if (window.innerWidth < 768) {
            setCollapsed();
        }
    };

    return (
        <NextLink
            href={href}
            className="text-default-900 active:bg-none "
        >
            <Tooltip content={title} placement="right">
                <div
                    className={clsx(
                        "flex gap-2 min-w-10 min-h-10 h-full items-center rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]",
                        !collapsed ? "justify-center dark:bg-[rgb(24_24_27)]" : "px-3.5",
                        isActive
                            ? "bg-primary-100 [&_svg_path]:fill-primary-500 [&_span]:text-primary-500"
                            : "hover:bg-default-100",
                    )}
                    onClick={handleClick}
                >
                    {icon}
                    {
                        collapsed && (<span className="text-default-900">{title}</span>)
                    }

                </div>
            </Tooltip>
        </NextLink>
    );
};
