
export type SizeContextType = {
    sizes: SizeDto[];
    createSize: (size: CreateSizeDto) => Promise<void>;
    updateSize: (id: number, size: UpdateSizeDto) => Promise<void>;
    deleteSize: (id: number) => Promise<void>;
    getSizes: () => Promise<void>;
    getSize: (id: number) => Promise<SizeDto>;
    loading: boolean;
    error: string;
    size: SizeDto;
    isModalOpen: boolean;
    selectedSize: SizeDto | null;
    isViewMode: boolean;
    openModal: (size: SizeDto | null, viewMode: boolean) => void;
    closeModal: () => void;
};