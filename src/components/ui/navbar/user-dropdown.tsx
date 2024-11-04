
import React, { useCallback } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { NavbarItem } from "@nextui-org/navbar";
import { Avatar } from "@nextui-org/avatar";
import { AuthService } from "@/services/Auth/AuthService";

export const UserDropdown = () => {
  const router = useRouter();
  const authService = new AuthService();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();

      localStorage.clear();

      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [authService, router]);


  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as='button'
            color='secondary'
            size='md'
            src='https://i.pravatar.cc/150?u=a042581f4e29026704d'
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Signed in as</p>
          <p>zoey@example.com</p>
        </DropdownItem>
       
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={handleLogout}>
          Log Out
        </DropdownItem>
        
        <DropdownItem key='switch'>
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
