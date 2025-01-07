'use client';

import React, {useState, useEffect, useContext} from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/modal';
import {Button} from '@nextui-org/button';
import {Input} from '@nextui-org/input';
import {SizeDto} from '@/services/Dto/SizeDto';
import {CreateCategoryDto} from '@/services/Category/dto/CreateCategoryDto';
import {UpdateCategoryDto} from '@/services/Category/dto/UpdateCategoryDto';
import {Select, SelectItem} from '@nextui-org/select';
import {PlusIcon, TrashIcon} from 'lucide-react';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/table';
import SizeModal from '../sizes/SizeModal';
import {ToastType} from '@/components/Toast/Toast';
import {CategoryContext} from '@/context/CategoryContext/categoryContext';
import {SizeContext} from '@/context/SizeContext/sizeContext';

interface Props {
    showToast: (message: string, type: ToastType) => void;
}

export default function CategoryModal({showToast}: Props) {
    const {
        isModalOpen,
        closeModal,
        selectedCategory,
        isViewMode,
        createCategory,
        updateCategory
    } = useContext(CategoryContext)!;
    const {sizes, openModal} = useContext(SizeContext)!;

    const [formData, setFormData] = useState<CreateCategoryDto | UpdateCategoryDto>({
        name: '',
        sizes: [],
    });
    const [selectedSizes, setSelectedSizes] = useState<SizeDto[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');

    useEffect(() => {
        if (selectedCategory) {
            const uniqueSizes = Array.from(new Set(selectedCategory.sizes.map(size => size.id)))
                .map(id => selectedCategory.sizes.find(size => size.id === id)!);

            setFormData({
                name: selectedCategory.name,
                sizes: uniqueSizes.map(size => ({sizeId: size.id})),
            });
            setSelectedSizes(uniqueSizes);
        } else {
            resetForm();
        }
    }, [selectedCategory]);

    const resetForm = () => {
        setFormData({name: '', sizes: []});
        setSelectedSizes([]);
        setSelectedSize('');
    };

    const handleInputChange = (value: string) => {
        setFormData(prev => ({...prev, name: value}));
    };

    const handleAddSize = () => {
        const sizeToAdd = sizes.find(size => size.id.toString() === selectedSize);
        if (sizeToAdd && !selectedSizes.some(s => s.id === sizeToAdd.id)) {

            setSelectedSizes(prev => [...prev, sizeToAdd]);

            setFormData(prev => ({
                ...prev,
                sizes: [...(prev.sizes || []), {sizeId: parseInt(sizeToAdd.id)}]
            }));
        }
        setSelectedSize('');
    };

    const handleRemoveSize = (sizeId: number) => {
        setSelectedSizes(prev => prev.filter(size => size.id !== sizeId));
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes ? prev.sizes.filter(size => size.sizeId !== sizeId) : []
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, formData as UpdateCategoryDto);
                showToast("Categoría actualizada exitosamente", ToastType.SUCCESS);
            } else {
                await createCategory(formData as CreateCategoryDto);
                showToast("Categoría creada exitosamente", ToastType.SUCCESS);
            }
            closeModal();
            resetForm();
        } catch (error) {
            showToast("Error al enviar los datos de la categoría: " + error, ToastType.ERROR);
        }
    };

    const handleAdd = () => {
        openModal(null, false);
    };

    const availableSizes = sizes.filter(size =>
        !selectedSizes.some(selected => selected.id === size.id)
    );

    const renderTableContent = () => {
        return selectedSizes.map((size) => {
            if (isViewMode) {
                // When in view mode, only render the name cell
                return (
                    <TableRow key={size.id.toString()}>
                        <TableCell>{size.name}</TableCell>
                    </TableRow>
                );
            }

            // When not in view mode, render both name and action cells
            return (
                <TableRow key={size.id.toString()}>
                    <TableCell>{size.name}</TableCell>
                    <TableCell>
                        <Button
                            isIconOnly
                            color="danger"
                            aria-label="Eliminar talla"
                            onPress={() => handleRemoveSize(size.id)}
                        >
                            <TrashIcon/>
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    };

    const renderTable = () => {
        if (selectedSizes.length === 0 && !isViewMode) return null;

        const columns = [
            {key: 'name', label: 'TALLAS'},
            {key: 'actions', label: 'ACCIONES'},
        ];

        return (
            <Table aria-label="Tallas seleccionadas">
                <TableHeader>
                    {isViewMode ? (
                        // View mode: only show name column
                        <TableColumn key="name">TALLAS</TableColumn>
                    ) : (
                        // Edit mode: show both name and actions columns
                        columns.map((column) =>
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        )
                    )}
                </TableHeader>
                <TableBody>
                    {renderTableContent()}
                </TableBody>
            </Table>
        );
    };
    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    closeModal();
                    resetForm();
                }}
                scrollBehavior="inside"
                classNames={{
                    base: "max-w-xl",
                    header: "border-b border-gray-200 dark:border-gray-700",
                    footer: "border-t border-gray-200 dark:border-gray-700",
                }}
            >
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold">
                                {isViewMode ? 'Ver categoría' : selectedCategory ? 'Editar categoría' : 'Agregar categoría'}
                            </h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Nombre de la categoría"
                                value={formData.name}
                                onValueChange={handleInputChange}
                                placeholder="Escriba el nombre de la categoría"
                                isRequired={!isViewMode}
                                isDisabled={isViewMode}
                                classNames={{
                                    label: "font-semibold",
                                }}
                            />
                            {!isViewMode && (
                                <div className="flex items-end gap-2">
                                    <Select
                                        label="Seleccionar talla"
                                        placeholder="Escoge una talla"
                                        selectedKeys={[selectedSize]}
                                        onSelectionChange={(keys) => setSelectedSize(Array.from(keys)[0] as string)}
                                        className="flex-grow"
                                    >
                                        {availableSizes.map((size) => (
                                            <SelectItem key={size.id.toString()} value={size.id}>
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Button
                                        isIconOnly
                                        color="primary"
                                        aria-label="Agregar talla"
                                        onPress={handleAddSize}
                                        isDisabled={!selectedSize}
                                    >
                                        <PlusIcon/>
                                    </Button>
                                    <Button color="primary" onPress={handleAdd}>
                                        Agregar talla
                                    </Button>
                                </div>
                            )}
                            {renderTable()}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => {
                                    closeModal();
                                    resetForm();
                                }}
                            >
                                Cerrar
                            </Button>
                            {!isViewMode && (
                                <Button color="primary" type="submit">
                                    {selectedCategory ? 'Actualizar' : 'Crear'}
                                </Button>
                            )}
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
            <SizeModal showToast={showToast}/>
        </>
    );
}