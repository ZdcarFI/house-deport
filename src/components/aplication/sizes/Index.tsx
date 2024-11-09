"use client";

import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { CategoryDto } from "@/services/Dto/CategoryDto";
import { CategoryService } from "@/services/Category/CategoryService";
import SizeTable from "@/components/aplication/sizes/SizeTable";
import SizeModal from "@/components/aplication/sizes/SizeModal";
import { SizeDto } from "@/services/Dto/SizeDto";
import { SizeContext } from "@/context/SizeContext/sizeContext";
import { CreateSizeDto } from "@/services/Size/dto/CreateSizeDto";
import { UpdateSizeDto } from "@/services/Size/dto/UpdateSizeDto";

export default function Sizes() {
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);
  const [selectedSize, setSelectedSize] = React.useState<SizeDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewMode, setIsViewMode] = React.useState(false);

  const categoryService = new CategoryService();
  const sizeContext = useContext(SizeContext);

  if (!sizeContext) {
    throw new Error("SizeContext must be used within SizeProvider");
  }

  const { sizes, createSize, updateSize, deleteSize, loading } = sizeContext;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAll();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAdd = () => {
    setSelectedSize(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (size: SizeDto) => {
    setSelectedSize(size);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (size: SizeDto) => {
    setSelectedSize(size);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSize(id);
    } catch (error) {
      console.error("Error deleting size:", error);
    }
  };

  const handleSubmit = async (formData: CreateSizeDto | UpdateSizeDto) => {
    try {
      if (selectedSize) {
        await updateSize(selectedSize.id, {
          name: formData.name,
          categoryId: formData.categoryId
        });
      } else {
        await createSize(formData as CreateSizeDto);
      }
      setIsModalOpen(false);
      setSelectedSize(null);
    } catch (error) {
      console.error("Error submitting size data:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSize(null);
    setIsViewMode(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>Sizes</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">All Sizes</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search size"
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Add Size</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <SizeTable
            categories={categories}
            sizes={sizes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
          <SizeModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleSubmit}
            size={selectedSize}
            isViewMode={isViewMode}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}