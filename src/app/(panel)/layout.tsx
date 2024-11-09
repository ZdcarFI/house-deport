import { Layout } from "@/components/ui/layouts/Layout";
import "@/styles/globals.css";
import CategoryProvider from "@/context/CategoryContext/categoryContext";
import SizeProvider from "@/context/SizeContext/sizeContext";
import ProductProvider from "@/context/ProductContext/productContext";
import WarehouseProvider from "@/context/WareHouseContext/warehouseContext";
import ProductWarehouseProvider from "@/context/ProductWarehouseContext/productWarehouseContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Layout>
        <CategoryProvider>
            <SizeProvider>
                <ProductProvider>
                    <WarehouseProvider>
                        <ProductWarehouseProvider>
                            {children}
                        </ProductWarehouseProvider>

                    </WarehouseProvider>
                </ProductProvider>
            </SizeProvider>
        </CategoryProvider>
    </Layout>;
}