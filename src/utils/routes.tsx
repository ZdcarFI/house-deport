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

export const routes = [
  {
    title: 'Inicio',
    routes: [{
      path: '/',
      title: 'Inicio',
      icon: <Home strokeWidth={1.5} size={24} />,
      roles: ['admin','user','warehouse','sales'],
    },
    ],
  },
  {
    title: 'Gestión de Usuarios',
    routes: [{
      path: '/users',
      title: 'Listado de Usuariosn',
      icon: <Users strokeWidth={1.5} size={24} />,
      roles: ['admin'],
    },
    ],
  },
  {
    title: 'Gestión de Clientes',
    routes: [{
      path: '/clients',
      title: 'Listado de Clientes',
      icon: <UserPlus strokeWidth={1.5} size={24} />,
      roles: ['admin','sales'],
    },
    ],
  },
  {
    title: 'Gestión de Ventas',
    routes: [{
      path: '/orders',
      title: 'Listado de Ventas',
      icon: <ListOrdered strokeWidth={1.5} size={24} />,
      roles: ['admin','user','warehouse','sales'],
    },
      {
        path: '/createOrder',
        title: 'Emitir Venta',
        icon: <PlusSquare strokeWidth={1.5} size={24} />,
        roles: ['admin','user','warehouse','sales'],
      },
    ],
  },

  {
    title: 'Gestión de Almacenes',
    routes: [{
      path: '/warehouses',
      title: 'Listado de Almacenes',
      icon: <Warehouse strokeWidth={1.5} size={24} />,
      roles: ['admin','user','warehouse','sales'],
    },
      {
        path: '/warehouseProduct',
        title: 'Productos en Almacén',
        icon: <Box strokeWidth={1.5} size={24} />,
        roles: ['admin','user','warehouse','sales'],
      },
    ],
  },
  {
    title: 'Gestión de Productos',
    routes: [{
      path: '/categories',
      title: 'Categorías',
      icon: <Layers strokeWidth={1.5} size={24} />,
      roles: ['admin','user','warehouse','sales'],
    },
      {
        path: '/Sizes',
        title: 'Tallas',
        icon: <Ruler strokeWidth={1.5} size={24} />,
        roles: ['admin','user','warehouse','sales'],
      },
      {
        path: '/products',
        title: 'Listado de Productos',
        icon: <Tag strokeWidth={1.5} size={24} />,
        roles: ['admin','user','warehouse','sales'],
      },

    ],
  },
  {
    title: 'Configuración',
    routes: [{
      path: '/view',
      title: 'Vista de Datos',
      icon: <BookOpen strokeWidth={1.5} size={24} />,
      roles: ['admin','user','warehouse','sales'],
    },
      {
        path: '/settings',
        title: 'Configuraciones',
        icon: <Settings strokeWidth={1.5} size={24} />,
        roles: ['admin','user','warehouse','sales'],
      },
    ],
  },
  {
    title: 'Informacion',
    routes: [{
      path: '/changelog',
      title: 'Registro de Cambios',
      icon: <BookOpen strokeWidth={1.5} size={24} />,
      roles: ['admin','user','warehouse','sales'],
    },
    ],
  },
];