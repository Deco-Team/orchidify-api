import { ValidationPipe, ValidationPipeOptions, ValidationError } from '@nestjs/common';
export declare class AppValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions);
    static getFirstMessage(validationErrors?: ValidationError[]): string;
}
