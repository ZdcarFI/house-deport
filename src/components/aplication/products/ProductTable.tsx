import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon } from '../../icons/table/edit-icon';
import { DeleteIcon } from '../../icons/table/delete-icon';
import { EyeIcon } from '../../icons/table/eye-icon';
import { ProductDto } from '@/services/Dto/ProductDto';

interface ProductTableProps {
  products: ProductDto[];
  onView: (product: ProductDto) => void;
  onEdit: (product: ProductDto) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onView, onEdit, onDelete }: ProductTableProps) {

  const renderCell = (product: ProductDto, columnKey: React.Key): React.ReactNode => {
    console.log("Column Key:", columnKey); // Shows the current column key
    console.log("Product Data:", product); // Shows the current product data

    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-4">
            <Tooltip content="Details" color="primary">
              <button onClick={() => onView(product)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Edit product" color="secondary">
              <button onClick={() => onEdit(product)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
            <Tooltip content="Delete product" color="danger">
              <button onClick={() => onDelete(product.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        );
      case 'category':
        return product.category?.name ?? "N/A";
      case 'size':
        return product.sizes?.name ?? "N/A";
      case 'warehouse':
        return product.productWarehouse?.name ?? "N/A";
      case 'stockInventory':
        return product.stockInventory ?? "N/A";
      case 'stockStore':
        return product.stockStore ?? "N/A";
      default:
        return product[columnKey as keyof ProductDto]?.toString() ?? "N/A";
    }
  };

  return (
    <Table aria-label="Products table">
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="code">Code</TableColumn>
        <TableColumn key="price">Price</TableColumn>
        <TableColumn key="category">Category</TableColumn>
        <TableColumn key="size">Size</TableColumn>
        <TableColumn key="warehouse">Warehouse</TableColumn>
        <TableColumn key="stockInventory">Stock Inventory</TableColumn>
        <TableColumn key="stockStore">Stock Store</TableColumn>
        <TableColumn key="actions">Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            {(columnKey) => <TableCell>{renderCell(product, columnKey)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
