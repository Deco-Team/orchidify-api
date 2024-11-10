import { BaseGardenDto } from './base.garden.dto';
declare const CreateGardenDto_base: import("@nestjs/common").Type<Pick<BaseGardenDto, "name" | "description" | "gardenManagerId" | "address" | "addressLink" | "images" | "maxClass">>;
export declare class CreateGardenDto extends CreateGardenDto_base {
}
export {};
