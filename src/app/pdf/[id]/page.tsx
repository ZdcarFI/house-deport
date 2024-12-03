'use client'

import React from 'react';
import { useParams } from "next/navigation";
import { OrderService } from "@/services/Order/OrderService";

const Page = () => {
    const { id } = useParams();
    const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

    const orderService = new OrderService();

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Llama al servicio y obtiene el buffer
                const response = await orderService.generatePdf(Number(id));
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (e) {
                console.error("Error loading order:", e);
            }
        };

        fetchOrder();
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [id]);

    return (
        <div className="min-w-full min-h-full" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                />
            )}
        </div>
    );
};

export default Page;
