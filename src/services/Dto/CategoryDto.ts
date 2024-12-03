    import {SizeDto} from "@/services/Dto/SizeDto";

    export interface CategoryDto {
        readonly id: number;
        readonly name: string;
        readonly sizes: SizeDto[];
        readonly created_at : Date;
        readonly updated_at : Date;
    }

    export interface CategoryBasicDto {
        readonly id: number;
        readonly name: string;
    }