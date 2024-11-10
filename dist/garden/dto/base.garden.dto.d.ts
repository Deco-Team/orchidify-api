import { GardenStatus } from '@common/contracts/constant';
export declare class BaseGardenDto {
    _id: string;
    name: string;
    description: string;
    address: string;
    addressLink: string;
    images: string[];
    status: GardenStatus;
    maxClass: number;
    gardenManagerId: string;
    createdAt: Date;
    updatedAt: Date;
}
