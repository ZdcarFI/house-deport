'use client';

import React from 'react';
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { CategoryDto } from "@/services/Dto/CategoryDto";
import { CreateCategoryDto } from "@/services/Category/dto/CreateCategoryDto";
import { UpdateCategoryDto } from "@/services/Category/dto/UpdateCategoryDto";
import CategoryTable from "@/components/aplication/categories/CategoryTable";
import CategoryModal from "@/components/aplication/categories/CategoryModal";
import { CategoryContext } from '@/context/CategoryContext/categoryContext';

export default function Categories() {
  const { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = React.useContext(CategoryContext)!;

  const [selectedCategory, setSelectedCategory] = React.useState<CategoryDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isViewMode, setIsViewMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (category: CategoryDto) => {
    setSelectedCategory(category);
    setIsViewMode(true);
    setIsModalOpen(true);
  };
  
  const handleEdit = (category: CategoryDto) => {
    setSelectedCategory(category);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  const handleSubmit = async (formData: CreateCategoryDto | UpdateCategoryDto) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData as UpdateCategoryDto);
      } else {
        await createCategory(formData as CreateCategoryDto);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting category data:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <UsersIcon />
          <span>Categories</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">All Categories</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            className="w-full md:w-72"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" onPress={handleAdd}>Add Category</Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <CategoryTable
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            category={selectedCategory}
            isViewMode={isViewMode}
          />
        </div>
      </div>
    </div>
  );
}