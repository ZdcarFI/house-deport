import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User} from "@nextui-org/react";

import {DEFAULT_IMAGE, FEMALE_IMAGE, MALE_IMAGE} from "@/utils/images";
import {AuthContext} from "@/context/AuthContext/authContext";
import {userInitialState} from "@/context/AuthContext/userReducer";

export const UserDropdown = () => {
    const router = useRouter();
    const {logoutUser, error} = useContext(AuthContext);
    const [user, setUser] = useState(userInitialState);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        if (error !== "") {
            return;
        }
        router.push('/login');
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
                    name={user?.firstName}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="faded"
                          className="w-52 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Inició sesión como</p>
                    <p className="font-bold">{user?.email}</p>
                </DropdownItem>
                {/*<DropdownItem key="settings">
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
                </DropdownItem>*/}
                <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                    Cerrar sesión
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
