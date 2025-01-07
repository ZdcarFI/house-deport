import { CreateSizeBasicDto } from "@/services/Dto/CreateSizeBasic.dto";

export interface UpdateCategoryDto {
    readonly name?: string;
    readonly sizes: CreateSizeBasicDto[];
}