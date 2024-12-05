'use client';

import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import React, { useContext } from 'react';
import { ExportIcon } from '@/components/icons/accounts/export-icon';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';

import SizeTable from '@/components/aplication/sizes/SizeTable';
import SizeModal from '@/components/aplication/sizes/SizeModal';
import { SizeDto } from '@/services/Dto/SizeDto';

import { SizeContext } from '@/context/SizeContext/sizeContext';
import { SearchIcon } from 'lucide-react';
import ConfirmDialog from '@/components/modal/ConfirmDialog';
import { ToastContext } from '@/context/ToastContext/ToastContext';
import { ToastType } from '@/components/Toast/Toast';

export default function Sizes() {
  const {
    sizes,
    loading,
    error,
    deleteSize,
    openModal,
  } = useContext(SizeContext)!;

  const { showToast } = useContext(ToastContext)!;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [selectedSizeId, setSelectedSizeId] = React.useState<number | null>(null);

  const filteredSizes = React.useMemo(() => {
    return sizes.filter(size =>
      size.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [sizes, searchQuery]);

  const handleAdd = () => {
    openModal(null, false);
  };

  const handleView = (size: SizeDto) => {
    openModal(size, true);
  };

  const handleEdit = (size: SizeDto) => {
    openModal(size, false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSize(id);
      showToast('Talla eliminada exitosamente', ToastType.SUCCESS);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      showToast('Error:' + error, ToastType.ERROR);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  React.useEffect(() => {
    if (error) {
      showToast(error, ToastType.ERROR);
    }
  }, [error, showToast]);


  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={'/'}>
            <span>Inicio</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>Tallas</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>Lista</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Todas las tallas</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <Input
          className="w-full sm:max-w-[300px]"
          placeholder="Buscar talla..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<SearchIcon className="text-default-400" size={20} />}
        />
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Agregar talla</Button>
          <Button color="secondary" startContent={<ExportIcon />}>
            Exportar en csv
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <SizeTable
            sizes={filteredSizes}
            onEdit={handleEdit}
            onDelete={(sizeId: number) => {
              setSelectedSizeId(sizeId);
              setIsConfirmDialogOpen(true);
            }}
            onView={handleView}
          />
          <SizeModal
            showToast={showToast} />
          <ConfirmDialog
            title="¿Estás seguro de que deseas eliminar esta talla?"
            isOpen={isConfirmDialogOpen}
            onConfirm={() => {
              if (selectedSizeId) {
                handleDelete(selectedSizeId);
              }
            }}
            onClose={() => {
              setIsConfirmDialogOpen(false);
              setSelectedSizeId(null);
            }}
            onCancel={() => {
              setIsConfirmDialogOpen(false);
              setSelectedSizeId(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

