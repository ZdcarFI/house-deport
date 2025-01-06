"use client"

import {Image} from "@nextui-org/image";
import React, {useEffect} from "react";
import {useTheme} from "next-themes";
import {MoonIcon} from "@/components/icons/MoonIcon";
import {SunIcon} from "@/components/icons/SunIcon";
import {Switch} from "@nextui-org/switch";

interface Props {
    children: React.ReactNode;
}

const AuthLayoutWrapper = ({children}: Props) => {
    const {setTheme, resolvedTheme, theme} = useTheme();
    useEffect(() => {
        if (!theme) {
            setTheme('light'); // Tema predeterminado si no hay valor en localStorage
        }
    }, [theme, setTheme]);
    const isDark = resolvedTheme === 'dark';

    return (
        <div className='h-screen relative grid  grid-cols-1 md:grid-cols-[1fr_2fr]'>

            <div className='relative flex-col flex items-center justify-center p-6'>
                <Switch
                    className="absolute top-4 right-4"
                    size="md"
                    color="primary"
                    checked={isDark}
                    onChange={() => {
                        setTheme(isDark ? "light" : "dark");
                    }}
                    startContent={<SunIcon/>}
                    endContent={<MoonIcon/>}
                />
                <div className='md:hidden absolute left-0 right-0 bottom-0 top-0 z-0'>
                    <Image
                        className='w-full h-full'
                        src='https://nextui.org/gradients/docs-right.png'
                        alt='gradient'
                    />
                </div>
                {children}
            </div>

            <div className='col-span-1 hidden md:flex relative items-center justify-center p-6 bg-cover bg-center bg-no-repeat'
                 style={{
                     backgroundImage: `url('/imgs/bg-textil.png')`,
                 }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                <div className='z-10 flex flex-col justify-end items-start w-2/3 h-1/2'>

                    <span className='font-bold text-[5rem] text-center text-white'>House Deport</span>
                    <div className='font-light text-slate-300 text-3xl'>
                        Gestiona tus tareas y pedidos
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutWrapper>
            {children}
        </AuthLayoutWrapper>
    );
}
