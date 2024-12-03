import "@/styles/globals.css";
import type {Metadata} from "next";
import {Providers} from "./providers";
import {fontSans} from "@/utils/config/fonts";
import clsx from "clsx";
import AuthProvider from "@/context/AuthContext/authContext";

export const metadata: Metadata = {
    title: "House Deport",
    description: "Venta al por menor de equipo de deporte en comercios especializados",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
        <head title="House Deport">
            <link
                rel="icon"
                href="/icon?<generated>"
                type="imgs/logo.svg"
                sizes="24x24"
            />
        </head>
        <body className={clsx("font-sans antialiased", fontSans.className)}>
        <Providers>
            <AuthProvider>{children}</AuthProvider>
        </Providers>
        </body>
        </html>
    );
}