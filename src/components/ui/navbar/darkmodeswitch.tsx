import React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/switch";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Switch
      isSelected={resolvedTheme === "dark"}
      onValueChange={(e) => setTheme(e ? "dark" : "light")}
    />
  );
};
