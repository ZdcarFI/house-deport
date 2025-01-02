'use client';

import React, {useContext, useMemo, useState} from 'react';
import {Button, Input} from '@nextui-org/react';
import Link from 'next/link';
import {ExportIcon} from '@/components/icons/accounts/export-icon';
import {HouseIcon} from '@/components/icons/breadcrumb/house-icon';
import {UsersIcon} from '@/components/icons/breadcrumb/users-icon';
import {SearchIcon} from 'lucide-react';

import {ToastContext} from '@/context/ToastContext/ToastContext';
import {ToastType} from '@/components/Toast/Toast';
import {ProductionContext} from "@/context/ProductionContext/productionContext";
import {ProductionDto} from "@/services/Dto/ProductionDto";
import ProductionTable from "@/components/aplication/production/ProductonTable";
import ProductionModal from "@/components/aplication/production/ProductionModal";

export default function Productions() {
    const {
        productions,
        loading,
        error,
        openModal,
    } = useContext(ProductionContext)!;

    const {showToast} = useContext(ToastContext)!;

    const [searchQuery, setSearchQuery] = useState('');

    const filteredProductions = useMemo(() => {
        return productions.filter(production =>
            `${production.product.name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            production.status.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [productions, searchQuery]);

    const handleAdd = () => {
        openModal(null, false);
    };

    const handleView = (production: ProductionDto) => {
        openModal(production, true);
    };

    const handleEdit = (production: ProductionDto) => {
        openModal(production, false);
    };


    if (loading) {
        return <div className="flex justify-center items-center h-96">Cargando...</div>;
    }
    if (error) {
        showToast("Error " + (error), ToastType.ERROR); // Llamamos la función
        return <div>Error: {error}</div>; // Retornamos JSX adecuado
    }

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon/>
                    <Link href="/">
                        <span>Inicio</span>
                    </Link>
                    <span> / </span>
                </li>
                <li className="flex gap-2">
                    <UsersIcon/>
                    <span>Producciones</span>
                    <span> / </span>
                </li>
                <li className="flex gap-2">
                    <span>Lista</span>
                </li>
            </ul>

            <h3 className="text-xl font-semibold">Todas las producciones</h3>

            <div className="flex justify-between flex-wrap gap-4 items-center">
                <Input
                    className="w-full sm:max-w-[300px]"
                    placeholder="Buscar producciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<SearchIcon className="text-default-400" size={20}/>}
                />
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" onPress={handleAdd}>
                        Agregar producción
                    </Button>
                    <Button color="primary" startContent={<ExportIcon/>}>
                        Exportar a CSV
                    </Button>
                </div>
            </div>

            <div className="w-full flex flex-col gap-4">
                <ProductionTable
                    productions={filteredProductions}
                    onEdit={handleEdit}
                    onView={handleView}
                />
                <ProductionModal
                    showToast={showToast}/>

            </div>
        </div>
    );
}
