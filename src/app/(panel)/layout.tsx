import {Layout} from "@/components/ui/layouts/Layout";
import "@/styles/globals.css";
import CategoryProvider from "@/context/CategoryContext/categoryContext";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return <Layout>
        <CategoryProvider>{children}</CategoryProvider> </Layout>;
}