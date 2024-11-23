import React, {useCallback} from "react";
import {DarkModeSwitch} from "./darkmodeswitch";
import {useRouter} from "next/navigation";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";

import {NavbarItem} from "@nextui-org/navbar";
import {AuthService} from "@/services/Auth/AuthService";
import {UserDto} from "@/services/Dto/UserDto";
import {DEFAULT_IMAGE, FEMALE_IMAGE, MALE_IMAGE} from "@/utils/images";

export const UserDropdown = () => {
    const router = useRouter();
    const [user, setUser] = React.useState<UserDto | null>(null);
    const authService = new AuthService();

    React.useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    }, [])

    const handleLogout = useCallback(async () => {
        try {
            await authService.logout();
            localStorage.clear();
            router.replace("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }, [authService, router]);

    const transformNameTextEllipsis = (name: string) => {
        return name.length > 8 ? name.substring(0, 8) + "..." : name;
    }

    return (
        <Dropdown placement="bottom-start" backdrop="blur">
            <DropdownTrigger>
                <User
                    as="button"
                    avatarProps={{
                        isBordered: true,
                        src: `${user?.gender === "MALE" ? MALE_IMAGE : user?.gender === "FEMALE" ? FEMALE_IMAGE : DEFAULT_IMAGE}`,
                    }}
                    className="transition-transform text-ellipsis"
                    description={`@${user?.username}`}
                    name={transformNameTextEllipsis(user?.firstName || '')}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="faded"
                          className="w-52 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Inició sesión como</p>
                    <p className="font-bold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">
                    My Settings
                </DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">
                    Analytics
                </DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                    Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
