/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { IUserTokenRepository } from '@auth/repositories/user-token.repository';
import { UserToken } from '@auth/schemas/user-token.schema';
import { FilterQuery, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose';
import { CreateUserTokenDto } from '@auth/dto/user-token.dto';
import { UserRole } from '@common/contracts/constant';
export declare const IUserTokenService: unique symbol;
export interface IUserTokenService {
    create(createUserTokenDto: CreateUserTokenDto, options?: SaveOptions | undefined): Promise<UserToken>;
    update(conditions: FilterQuery<UserToken>, payload: UpdateQuery<UserToken>, options?: QueryOptions | undefined): Promise<UserToken>;
    findByRefreshToken(refreshToken: string): Promise<UserToken>;
    disableRefreshToken(refreshToken: string): Promise<UserToken>;
    clearAllRefreshTokensOfUser(userId: Types.ObjectId, role: UserRole): Promise<void>;
}
export declare class UserTokenService implements IUserTokenService {
    private readonly userTokenRepository;
    constructor(userTokenRepository: IUserTokenRepository);
    create(createUserTokenDto: CreateUserTokenDto, options?: SaveOptions | undefined): Promise<UserToken>;
    update(conditions: FilterQuery<UserToken>, payload: UpdateQuery<UserToken>, options?: QueryOptions | undefined): Promise<UserToken>;
    findByRefreshToken(refreshToken: string): Promise<UserToken>;
    disableRefreshToken(refreshToken: string): Promise<UserToken>;
    clearAllRefreshTokensOfUser(userId: Types.ObjectId, role: UserRole): Promise<void>;
}
