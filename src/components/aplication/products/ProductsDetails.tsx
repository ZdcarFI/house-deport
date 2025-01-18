import {ProductWarehouseDto} from '@/services/Dto/ProductWarehouseDto';
import {ProductBasicWithLocationDto} from '@/services/Dto/WarehouseDto';
import {Card, CardBody, CardHeader, Divider, Chip, Button} from "@nextui-org/react";
import {DollarSign, Box, Barcode, Database} from 'lucide-react';
import {Tooltip} from "@nextui-org/tooltip";
import AgregarStock from "@/components/aplication/productWarehouse/agregarStock";
import React from "react";

interface ProductDetailsProps {
    product: ProductBasicWithLocationDto;
    onDeleteProduct: () => void;
    productWarehouseSelect: ProductWarehouseDto;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({product, onDeleteProduct, productWarehouseSelect}) => {

    return (
        <Card className="max-w-md">
            <CardHeader className="flex flex-col items-start gap-2 px-4 pb-0 pt-4">
                <h4 className="text-xl font-bold">{product.name}</h4>
                <Chip
                    size="sm"
                    variant="flat"
                    color={product.quantity <= 5 ? "danger" : "success"}
                >
                    {product.quantity <= 5 ? "Bajo stock" : "Stock disponible"}
                </Chip>
            </CardHeader>
            <CardBody className="gap-6">
                <Divider/>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Barcode className="text-primary" size={20}/>
                        <div>
                            <p className="text-sm text-default-500">Código</p>
                            <p className="font-semibold">{product.code}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DollarSign className="text-primary" size={20}/>
                        <div>
                            <p className="text-sm text-default-500">Precio</p>
                            <p className="font-semibold">S/. {Number(product.price).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Database className="text-primary" size={20}/>
                        <div>
                            <p className="text-sm text-default-500">Cantidad</p>
                            <p className="font-semibold">{product.quantity} unidades</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Box className="text-primary" size={20}/>
                        <div>
                            <p className="text-sm text-default-500">Ubicación</p>
                            <p className="font-semibold">Fila {product.row}, Col {product.column}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-4">
                    <Tooltip content="Add Stock" color="success">
                        <AgregarStock productWarehouse={productWarehouseSelect}/>
                    </Tooltip>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={onDeleteProduct}
                    >
                        Eliminar (Vaciar)
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductDetails;

