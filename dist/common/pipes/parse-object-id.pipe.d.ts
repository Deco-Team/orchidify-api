import { PipeTransform } from '@nestjs/common';
export declare class ParseObjectIdPipe implements PipeTransform {
    transform(value: any): import("bson").ObjectId;
}
