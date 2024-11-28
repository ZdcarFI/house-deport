import React from "react";

import {SupportIcon} from "../../icons/navbar/support-icon";
import {SearchIcon} from "../../icons/searchicon";
import {BurguerButton} from "./burguer-button";
import {NotificationsDropdown} from "./notifications-dropdown";
import {UserDropdown} from "./user-dropdown";
import {NavbarContent, Navbar} from '@nextui-org/navbar';
import {Input} from "@nextui-org/input";
import {Switch} from "@nextui-org/switch";
import {SunIcon} from "@/components/icons/SunIcon";
import {MoonIcon} from "@/components/icons/MoonIcon";
import {useTheme} from "next-themes";

interface Props {
    children: React.ReactNode;
}

export const NavbarWrapper = ({children}: Props) => {
    const {setTheme, resolvedTheme} = useTheme();

    return (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Navbar
                isBordered
                className="w-full items-end min-w-full"
                classNames={{
                    wrapper: "w-full max-w-full",
                }}
            >
                <NavbarContent className="md:hidden">
                    <BurguerButton/>
                </NavbarContent>
                {/*<NavbarContent className="w-full max-md:hidden">
                    <Input
                        startContent={<SearchIcon/>}
                        isClearable
                        className="w-full"
                        classNames={{
                            input: "w-full",
                            mainWrapper: "w-full",
                        }}
                        placeholder="Search..."
                    />
                </NavbarContent>*/}
                <NavbarContent
                    justify="end"
                    className="min-w-full data-[justify=end]:flex-grow-0"
                >
                    <NotificationsDropdown/>

                    <div className="max-md:hidden">
                        <SupportIcon/>
                    </div>
                    <Switch
                        defaultSelected
                        size="md"
                        color="success"
                        key='switch'
                        isSelected={resolvedTheme === "dark"}
                        onValueChange={(e) => setTheme(e ? "dark" : "light")}
                        startContent={<SunIcon/>}
                        endContent={<MoonIcon/>}
                    />

                    <UserDropdown/>
                </NavbarContent>
            </Navbar>
            {children}
        </div>
    );
};
