import React from 'react';
import { useSidebarContext } from '@/components/ui/layouts/Layout-context';
import { UserRol } from '@/services/Dto/UserDto';

interface Props {
  title: string;
  children?: React.ReactNode;
  rolUser: UserRol;
}

export const SidebarMenu = ({ title, children, rolUser }: Props) => {
  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child)) {
      const childRoles = child.props.roles as string[];
      return childRoles.includes(rolUser);
    }
    return false;
  });
  const { collapsed } = useSidebarContext();
  if (filteredChildren.length === 0) {
    return null;
  }

  return (

    <div className="flex gap-2 flex-col ">
      <span className={`text-xs font-normal ${!collapsed ? 'text-center' : 'text-left'}`}>{title}</span>
      {children}
    </div>


  );
};
