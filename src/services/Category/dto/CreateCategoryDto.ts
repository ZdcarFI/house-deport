import { CreateSizeBasicDto } from "@/services/Dto/CreateSizeBasic.dto";

export interface CreateCategoryDto {
    readonly name: string;
    readonly sizes: CreateSizeBasicDto[];
}