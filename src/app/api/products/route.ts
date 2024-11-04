import { NextResponse } from 'next/server';

// Lista de productos de ejemplo
let products = [
  {
    "id": 1,
    "name": "T-shirt",
    "code": "TSH123",
    "price": 19.99,
    "category": { "id": 1, "name": "Clothing" },
    "size": { "id": 1, "name": "M" },
    "productWarehouse": { "id": 1, "row": 5, "column": 3, "quantity": 150, "name": "Warehouse A", "status": "Available" },
    "stockInventory": 150,
    "stockStore": 50
  },
  {
    "id": 2,
    "name": "Jeans",
    "code": "JNS456",
    "price": 49.99,
    "category": { "id": 1, "name": "Clothing" },
    "size": { "id": 2, "name": "L" },
    "productWarehouse": { "id": 2, "row": 8, "column": 2, "quantity": 80, "name": "Warehouse B", "status": "Available" },
    "stockInventory": 80,
    "stockStore": 30
  },
  {
    "id": 3,
    "name": "Sneakers",
    "code": "SNK789",
    "price": 89.99,
    "category": { "id": 2, "name": "Footwear" },
    "size": { "id": 3, "name": "42" },
    "productWarehouse": { "id": 3, "row": 12, "column": 4, "quantity": 60, "name": "Warehouse C", "status": "Low Stock" },
    "stockInventory": 60,
    "stockStore": 20
  },
  {
    "id": 4,
    "name": "Jacket",
    "code": "JCK101",
    "price": 120.00,
    "category": { "id": 1, "name": "Clothing" },
    "size": { "id": 4, "name": "XL" },
    "productWarehouse": { "id": 4, "row": 2, "column": 5, "quantity": 100, "name": "Warehouse D", "status": "Available" },
    "stockInventory": 100,
    "stockStore": 40
  },
  {
    "id": 5,
    "name": "Backpack",
    "code": "BKP112",
    "price": 59.99,
    "category": { "id": 3, "name": "Accessories" },
    "size": { "id": 5, "name": "One Size" },
    "productWarehouse": { "id": 5, "row": 1, "column": 1, "quantity": 200, "name": "Warehouse E", "status": "Available" },
    "stockInventory": 200,
    "stockStore": 75
  }
];

// GET (obtener todos los productos)
export async function GET() {
  return NextResponse.json(products);
}

// GET (obtener un producto por ID)
export async function GETBYID(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const product = products.find(p => p.id === parseInt(id || '0'));
  
  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}

// POST (crear un nuevo producto)
export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = {
    id: products.length + 1,  // Generar ID automáticamente
    ...body,
  };

  products.push(newProduct);
  return NextResponse.json(newProduct);
}

// PUT (actualizar un producto por ID)
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const body = await request.json();
  const index = products.findIndex(p => p.id === parseInt(id || '0'));
  
  if (index !== -1) {
    products[index] = { ...products[index], ...body };
    return NextResponse.json(products[index]);
  } else {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}

// DELETE (eliminar un producto por ID)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const index = products.findIndex(p => p.id === parseInt(id || '0'));
  
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1);
    return NextResponse.json(deletedProduct[0]);
  } else {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}
