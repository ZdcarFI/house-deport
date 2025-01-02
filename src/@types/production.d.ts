import {CreateProductionDto} from "@/services/Production/dto/CreateProductionDto";
import {UpdateProductionDto} from "@/services/Production/dto/UpdateProductionDto";
import {ProductionDto} from "@/services/Dto/ProductionDto";

export type ProductionContextType = {
    productions: ProductionDto[]; // Changed from Product[] to ProductionDto[]
    createProduction: (production: CreateProductionDto) => Promise<void>;
    updateProduction: (id: number, production: UpdateProductionDto) => Promise<void>;
    deleteProduction: (id: number) => Promise<void>;
    getProductions: () => Promise<void>;
    getProduction: (id: number) => Promise<ProductionDto>;
    loading: boolean;
    errorProduction: string;
    error: string;
    production: ProductionDto;
    isModalOpen: boolean;
    selectedProduction: ProductionDto | null;
    isViewMode: boolean;
    openModal: (production: ProductionDto | null, viewMode: boolean) => void;
    closeModal: () => void;
};