"use client";

import React from "react";
import * as XLSX from "xlsx";
import {Button} from "@nextui-org/react";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {OrderDto} from "@/services/Dto/OrderDto";

interface ExportToExcelProps {
    orders: OrderDto[];
}

const ExportToExcelOrders: React.FC<ExportToExcelProps> = ({orders}) => {
    const handleExportToExcel = () => {
        if (orders.length === 0) {
            alert("No hay órdenes para exportar.");
            return;
        }


        const formattedData: any[] = [];

        orders.forEach((order) => {

            formattedData.push({
                "ID Orden": order.id,
                "Número de Factura": order.numFac,
                "Estado": order.status,
                "Total": order.total,
                "Tipo de Pago": (order.paymentType == "CASH" ? "EFECTIVO" : order.paymentType == "TRANSFER" ? "TRANFERENCIA" : "YAPE"),
                "Cliente": `${order.client.firstName} ${order.client.lastName}`,
                "Fecha": new Date(order.date).toLocaleDateString(),
                "Actualizado el": new Date(order.updated_at).toLocaleDateString(),
                "Detalle": "Resumen de la Orden",
            });

            order.details.forEach((detail, index) => {
                formattedData.push({
                    "ID Orden": `Detalle ${index + 1}`,
                    "Número de Factura": "",
                    "Estado": "",
                    "Total": "",
                    "Tipo de Pago": "",
                    "Cliente": "",
                    "Fecha": "",
                    "Actualizado el": "",
                    "Detalle": `Producto: ${detail.product.name} - ${detail.product.code}, Cantidad: ${detail.quantity}, Precio Unitario: ${detail.unitPrice}, Total: ${detail.total}`,
                });
            });

            formattedData.push({});
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");


        XLSX.writeFile(workbook, "Ventas con detalles.xlsx");
    };

    return (
        <Button color="primary" onPress={handleExportToExcel} startContent={<ExportIcon/>}>
            Exportar a Excel
        </Button>
    );
};

export default ExportToExcelOrders;
