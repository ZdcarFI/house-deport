import {Layout} from "@/components/ui/layouts/Layout";
import "@/styles/globals.css";
import CategoryProvider from "@/context/CategoryContext/categoryContext";
import SizeProvider from "@/context/SizeContext/sizeContext";
import ProductProvider from "@/context/ProductContext/productContext";
import WarehouseProvider from "@/context/WareHouseContext/warehouseContext";
import ProductWarehouseProvider from "@/context/ProductWarehouseContext/productWarehouseContext";
import OrderProvider from "@/context/OrderContext/orderContext";
import ClientProvider from "@/context/ClientContext/clientContext";
import UserProvider from "@/context/UserContext/userContext";
import {PropsWithChildren} from "react";
import {ToastProvider} from "@/context/ToastContext/ToastContext";

// Create a combined provider component to reduce nesting
function Providers({children}: PropsWithChildren) {
    return (
        <CategoryProvider>
            <SizeProvider>
                <ProductProvider>
                    <WarehouseProvider>
                        <ProductWarehouseProvider>
                            <ClientProvider>
                                <UserProvider>
                                    <OrderProvider>
                                        <ToastProvider>{children}</ToastProvider>
                                    </OrderProvider>
                                </UserProvider>
                            </ClientProvider>
                        </ProductWarehouseProvider>
                    </WarehouseProvider>
                </ProductProvider>
            </SizeProvider>
        </CategoryProvider>
    )
}

// Root layout component
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <Layout>
            <Providers>
                {children}
            </Providers>
        </Layout>
    )
}