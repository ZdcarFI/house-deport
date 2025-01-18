import React, {useEffect, useState} from 'react';
import {Sidebar} from './sidebar.styles';
import {Tooltip} from '@nextui-org/tooltip';
import {Image} from '@nextui-org/image';
import {usePathname} from 'next/navigation';
import {useSidebarContext} from '../layouts/Layout-context';
import clsx from 'clsx';

import {

    ArrowLeft,
    AlignRight,
} from 'lucide-react';

import {SidebarItem} from './sidebar-item';
import {SidebarMenu} from './sidebar-menu';
import {routes} from '@/utils/routes';
import {UserRol} from '@/services/Dto/UserDto';

export const SidebarWrapper = () => {
    const pathname = usePathname();
    const {collapsed, setCollapsed} = useSidebarContext();

    const [userRole, setUserRole] = useState<UserRol>(UserRol.USER);

    useEffect(() => {
        // Retrieve user data from localStorage
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                setUserRole(userData.role);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
    }, []);

    const handleClick = () => {
        setCollapsed();
    };

    return (
        <aside className="h-screen z-[20] sticky top-0">
            {collapsed ? (
                <div className={Sidebar.Overlay()} onClick={setCollapsed}/>
            ) : null}
            <div className={`${Sidebar({collapsed})}`}>
                <div
                    className={clsx(
                        'min-h-20 flex items-center w-full',
                        !collapsed
                            ? 'flex-col justify-center gap-2'
                            : 'justify-between',
                    )}
                >
                    <div className="flex justify-center items-center">
                        <Tooltip content="House Deport" placement="bottom-end">
                            <Image src="imgs/logo.svg" alt="House Deport" width={40} height={40}/>
                        </Tooltip>
                        {
                            collapsed && (
                                <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400">
                                    House Deport
                                </h1>
                            )
                        }
                    </div>
                    <div
                        className={clsx(
                            'hidden md:flex items-center justify-center cursor-pointer p-1 rounded',
                            'dark:hover:bg-primary-100 hover:bg-default-100',
                            !collapsed ? 'min-w-10 min-h-10 rounded-xl dark:bg-[rgb(24_24_27)]' : 'rotate-180',
                        )}
                        onClick={handleClick}
                    >
                        {!collapsed ? (
                            <AlignRight size={20} color="#71717a"/>
                        ) : (
                            <ArrowLeft size={20} color="#71717a"/>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className={Sidebar.Body()}>
                        {routes.map((route) => (
                            <SidebarMenu key={route.title} title={route.title} rolUser={userRole}>
                                {route.routes.map((routeChild) => (
                                    <SidebarItem
                                        key={routeChild.title}
                                        roles={routeChild.roles}
                                        rol={userRole}
                                        title={routeChild.title}
                                        icon={routeChild.icon}
                                        isActive={pathname === routeChild.path}
                                        href={routeChild.path}
                                    />
                                ))}
                            </SidebarMenu>
                        ))}
                        <div className="py-4">

                        </div>

                    </div>
                </div>
            </div>
        </aside>
    )
        ;
};