import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class TrimRequestBodyPipe implements PipeTransform {
    private isObj;
    private trim;
    transform(values: any, metadata: ArgumentMetadata): any;
}
