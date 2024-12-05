import React, { useEffect } from 'react';

import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';
import { NavbarContent, Navbar } from '@nextui-org/navbar';
import { Switch } from '@nextui-org/switch';
import { SunIcon } from '@/components/icons/SunIcon';
import { MoonIcon } from '@/components/icons/MoonIcon';
import { useTheme } from 'next-themes';

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const { setTheme, resolvedTheme, theme } = useTheme();
  useEffect(() => {
    if (!theme) {
      setTheme('light'); // Tema predeterminado si no hay valor en localStorage
    }
  }, [theme, setTheme]);

  const isDark = resolvedTheme === 'dark';
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: 'w-full max-w-full',
        }}
      >
        <NavbarContent className="sm:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="flex items-center gap-2 ml-auto"
        >
          <NotificationsDropdown />
          <Switch
            size="md"
            color="success"
            checked={isDark}
            onChange={() => {
              setTheme(isDark ? "light" : "dark");
            }}
            startContent={<MoonIcon />}
            endContent={<SunIcon />}
          />
          <UserDropdown />
        </NavbarContent>
      </Navbar>

      {children}
    </div>
  );
};