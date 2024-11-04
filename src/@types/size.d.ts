import { SizeDto } from "@/services/Dto/SizeDto";
import { CreateSizeDto } from "@/services/Size/dto/CreateSizeDto";
import { UpdateSizeDto } from "@/services/Size/dto/UpdateSizeDto";


export type SizeContextType = {
    sizes: SizeDto[];
    createSize: (size: CreateSizeDto) => Promise<void>;
    updateSize: (id: number, size: UpdateSizeDto) => Promise<void>;
    deleteSize: (id: number) => Promise<void>;
    getSizes: () => Promise<void>;
    getSize: (id: number) => Promise<SizeDto>;
    loading: boolean;
    error: string;
};