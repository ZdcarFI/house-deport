import "@/styles/globals.css";
import type {Metadata} from "next";
import {Providers} from "./providers";
import {fontSans} from "@/utils/config/fonts";
import clsx from "clsx";
import AuthProvider from "@/context/AuthContext/authContext";

export const metadata: Metadata = {
    title: "Next.js",
    description: "Generated by Next.js",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={clsx("font-sans antialiased", fontSans.className)}>
            <Providers>
                <AuthProvider>{children}</AuthProvider>
            </Providers>
            </body>
        </html>
    );
}