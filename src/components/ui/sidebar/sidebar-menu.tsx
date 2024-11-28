import React from "react";
import {useSidebarContext} from "@/components/ui/layouts/Layout-context";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  const {collapsed} = useSidebarContext();
  return (
    <div className="flex gap-2 flex-col">
      <span className={`text-xs font-normal ${collapsed ? 'text-center' : 'text-left'}`}>{title}</span>
      {children}
    </div>
  );
};
