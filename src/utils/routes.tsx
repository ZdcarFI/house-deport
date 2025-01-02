import {
    BookOpen,
    Box, Home,
    Layers,
    ListOrdered,
    PlusSquare,
    Ruler,
    Settings,
    Tag,
    UserPlus, Users,
    Warehouse,
} from 'lucide-react';
import React from 'react';

export const Roles = {
    All: ['admin', 'user', 'warehouse', 'sales'],
    Categories: ['admin', 'warehouse'],
    Sizes: ['admin', 'warehouse'],
    Products: ['admin', 'warehouse', 'sales'],
    Users: ['admin'],
    Clients: ['admin', 'sales'],
    Production: ['admin', 'warehouse'],
    Orders: ['admin', 'sales'],
    Warehouses: ['admin', 'warehouse'],
    WarehouseProducts: ['admin', 'warehouse'],
    View: ['admin', 'user', 'warehouse', 'sales'],
    Settings: ['admin', 'user', 'warehouse', 'sales'],
    Changelog: ['admin', 'user', 'warehouse', 'sales'],
};


export const routes = [
    {
        title: 'Inicio',
        routes: [{
            path: '/',
            title: 'Inicio',
            icon: <Home strokeWidth={1.5} size={24}/>,
            roles: Roles.All,
        },
        ],
    },
    {
        title: 'Gestión de Usuarios',
        routes: [{
            path: '/users',
            title: 'Listado de Usuariosn',
            icon: <Users strokeWidth={1.5} size={24}/>,
            roles: Roles.Users,
        },
        ],
    },
    {
        title: 'Gestión de Clientes',
        routes: [{
            path: '/clients',
            title: 'Listado de Clientes',
            icon: <UserPlus strokeWidth={1.5} size={24}/>,
            roles: Roles.Clients,
        },
        ],
    },
    {
        title: 'Gestión de Ventas',
        routes: [{
            path: '/orders',
            title: 'Listado de Ventas',
            icon: <ListOrdered strokeWidth={1.5} size={24}/>,
            roles: Roles.Orders,
        },
            {
                path: '/createOrder',
                title: 'Emitir Venta',
                icon: <PlusSquare strokeWidth={1.5} size={24}/>,
                roles: Roles.Orders,
            },
        ],
    },
    {
        title: 'Gestión de Almacenes',
        routes: [{
            path: '/warehouses',
            title: 'Listado de Almacenes',
            icon: <Warehouse strokeWidth={1.5} size={24}/>,
            roles: Roles.Warehouses,
        },
            {
                path: '/warehouseProduct',
                title: 'Productos en Almacén',
                icon: <Box strokeWidth={1.5} size={24}/>,
                roles: Roles.WarehouseProducts,
            },
        ],
    },
    {
        title: 'Gestión de Productos',
        routes: [{
            path: '/categories',
            title: 'Categorías',
            icon: <Layers strokeWidth={1.5} size={24}/>,
            roles: Roles.Categories,
        },
            {
                path: '/sizes',
                title: 'Tallas',
                icon: <Ruler strokeWidth={1.5} size={24}/>,
                roles: Roles.Sizes,
            },
            {
                path: '/products',
                title: 'Listado de Productos',
                icon: <Tag strokeWidth={1.5} size={24}/>,
                roles: Roles.Products,
            },

        ],
    },
    {
        title: 'Gestión de Produccion',
        routes: [{
            path: '/production',
            title: 'Listado de Produccion',
            icon: <Box strokeWidth={1.5} size={24}/>,
            roles: Roles.Clients,
        },
        ],
    },
    {
        title: 'Configuración',
        routes: [{
            path: '/view',
            title: 'Vista de Datos',
            icon: <BookOpen strokeWidth={1.5} size={24}/>,
            roles: Roles.View,
        },
            {
                path: '/settings',
                title: 'Configuraciones',
                icon: <Settings strokeWidth={1.5} size={24}/>,
                roles: Roles.View,
            },
        ],
    },
    {
        title: 'Informacion',
        routes: [{
            path: '/changelog',
            title: 'Registro de Cambios',
            icon: <BookOpen strokeWidth={1.5} size={24}/>,
            roles: Roles.View,
        },
        ],
    },
];
