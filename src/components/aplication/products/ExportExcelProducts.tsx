"use client";

import React from "react";
import * as XLSX from "xlsx";
import {Button} from "@nextui-org/react";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {ProductDto} from "@/services/Dto/ProductDto";

interface ExportToExcelProps {
    products: ProductDto[];
}

const ExportExcelProducts: React.FC<ExportToExcelProps> = ({products}) => {
    const handleExportToExcel = () => {
        if (products.length === 0) {
            alert("No hay productos para exportar.");
            return;
        }
        const formattedData: any[] = [];
        products.forEach((product, index) => {

            formattedData.push({
                "ID": `Nro. ${index + 1}`,
                "Nombre": product.name,
                "Codigo": product.code,
                "Precio": product.price,
                "Categoria": product.category.name,
                "Talla": product.size.name,
                "Stock en el inventario": product.stockInventory,
                "Stock en los almacenes": product.stockStore,
                "Creado el": new Date(product.created_at).toLocaleDateString(),
                "Actualizado el": new Date(product.updated_at).toLocaleDateString(),
                "Detalle": "Detalle de los productos",
            });

            product.productWarehouse.forEach((location, index) => {
                formattedData.push({
                    "ID": `Detalle ${index + 1}`,
                    "Nombre": "",
                    "Codigo": "",
                    "Precio": "",
                    "Categoria": "",
                    "Talla": "",
                    "Stock en el inventario": "",
                    "Stock en los almacenes": "",
                    "Creado el": "",
                    "Actualizado el": "",
                    "Detalle": `Almacén: ${location.name} , Fila: ${String.fromCharCode(65 + (location.row - 1))}, Columna: ${location.column}, Cantidad: ${location.quantity}`,
                })
            })
            formattedData.push({});
        })


        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

        // Generar archivo y descargar
        XLSX.writeFile(workbook, "products.xlsx");
    };

    return (
        <Button color="primary" onPress={handleExportToExcel} startContent={<ExportIcon/>}>
            Exportar a Excel
        </Button>
    );
};

export default ExportExcelProducts;
