"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "../../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Para obtener la ruta actual
import clsx from "clsx"; // Para clases condicionales

interface Props {
  icon: React.ReactNode;
  title: string;
  items: { label: string; href: string }[];
}

export const CollapseItems = ({ icon, items, title }: Props) => {
  const pathname = usePathname(); // Obtenemos la ruta actual
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",

            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-12">
            {items.map((item, index) => {
              // Comparamos el href con la ruta actual para determinar si está activo
              const isActive = pathname === item.href;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={clsx(
                    "w-full flex text-default-500 hover:text-default-900 transition-colors",
                    {
                      "text-blue-600 font-semibold": isActive, // Si está activo, aplicamos estilos
                    }
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
