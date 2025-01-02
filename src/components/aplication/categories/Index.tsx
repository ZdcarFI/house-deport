'use client';

import React, {useContext} from 'react';
import {Button, Input} from "@nextui-org/react";
import Link from "next/link";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {HouseIcon} from "@/components/icons/breadcrumb/house-icon";
import {UsersIcon} from "@/components/icons/breadcrumb/users-icon";
import {CategoryDto} from "@/services/Dto/CategoryDto";
import CategoryTable from "@/components/aplication/categories/CategoryTable";
import CategoryModal from "@/components/aplication/categories/CategoryModal";
import {CategoryContext} from '@/context/CategoryContext/categoryContext';
import {SearchIcon} from 'lucide-react';
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {ToastContext} from '@/context/ToastContext/ToastContext';
import {ToastType} from '@/components/Toast/Toast';

export default function Categories() {
    const {
        categories,
        loading,
        error,
        deleteCategory,
        openModal
    } = useContext(CategoryContext)!;
    const {showToast} = useContext(ToastContext)!;


    const [searchQuery, setSearchQuery] = React.useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

    const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);

    const filteredCategories = React.useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const handleAdd = () => {
        openModal(null, false);
    };

    const handleView = (category: CategoryDto) => {
        openModal(category, true);
    };

    const handleEdit = (category: CategoryDto) => {
        openModal(category, false);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteCategory(id);

            // Solo mostrar éxito si realmente se eliminó en el backend
            if (response && response.success) {
                showToast("Categoría eliminada exitosamente", ToastType.SUCCESS);
                setIsConfirmDialogOpen(false);
            } else {
                throw new Error("No se pudo eliminar la categoría");
            }
        } catch (error: any) {
            // Mostrar un mensaje más específico para el error de clave foránea
            if (error.message?.includes('foreign key constraint') ||
                error.message?.includes('FK_3a3ca0681511e948bf87fade638')) {
                showToast("No se puede eliminar la categoría porque tiene tallas asociadas", ToastType.ERROR);
            } else {
                showToast("Error al eliminar la categoría: " + (error.message || error), ToastType.ERROR);
            }
            setIsConfirmDialogOpen(false);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return showToast("Error " + (error), ToastType.ERROR);
    }

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon/>
                    <Link href={"/"}>
                        <span>Inicio</span>
                    </Link>
                    <span> / </span>{" "}
                </li>
                <li className="flex gap-2">
                    <UsersIcon/>
                    <span>Categorías</span>
                    <span> / </span>{" "}
                </li>
                <li className="flex gap-2">
                    <span>Lista</span>
                </li>
            </ul>
            <h3 className="text-xl font-semibold">Todas las Categorías</h3>

            <div className="flex justify-between flex-wrap gap-4 items-center">
                <Input
                    className="w-full sm:max-w-[300px]"
                    placeholder="Buscar categoría..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<SearchIcon className="text-default-400" size={20}/>}
                />
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" onPress={handleAdd}>Agregar Categoría</Button>
                    <Button color="secondary" startContent={<ExportIcon/>}>
                        Exportar a CSV
                    </Button>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <CategoryTable
                        categories={filteredCategories}
                        onEdit={handleEdit}
                        onDelete={(categoryId: number) => {
                            setSelectedCategoryId(categoryId);
                            setIsConfirmDialogOpen(true);
                        }}
                        onView={handleView}
                    />
                    <CategoryModal
                        showToast={showToast}/>
                    <ConfirmDialog
                        title="¿Estás seguro de que deseas eliminar esta categoria?"
                        isOpen={isConfirmDialogOpen}
                        onConfirm={() => {
                            if (selectedCategoryId) {
                                handleDelete(selectedCategoryId);
                            }
                        }}
                        onClose={() => {
                            setIsConfirmDialogOpen(false);
                            setSelectedCategoryId(null);
                        }}
                        onCancel={() => {
                            setIsConfirmDialogOpen(false);
                            setSelectedCategoryId(null);
                        }}
                    />

                </div>
            </div>
        </div>
    );
}

