    import {SizeDto} from "@/services/Dto/SizeDto";

    export interface CategoryDto {
        readonly id: number;
        readonly name: string;
        readonly sizes: SizeDto[];
    }