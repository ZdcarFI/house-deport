import { Layout } from "@/components/ui/layouts/Layout";
import "@/styles/globals.css";
import CategoryProvider from "@/context/CategoryContext/categoryContext";
import SizeProvider from "@/context/SizeContext/sizeContext";
import ProductProvider from "@/context/ProductContext/productContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Layout>
        <CategoryProvider>
            <SizeProvider>
                <ProductProvider>
                    {children}
                </ProductProvider>
            </SizeProvider>
        </CategoryProvider>
    </Layout>;
}