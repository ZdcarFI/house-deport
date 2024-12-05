import React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/switch";
import { MoonIcon, SunIcon } from 'lucide-react';

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Switch
      isSelected={resolvedTheme === "dark"}
      onValueChange={toggleTheme}
      size="md"
      color="default"
      startContent={<SunIcon className="text-yellow-500" />}
      endContent={<MoonIcon className="text-blue-500" />}
    />
  );
};