// src/form/dto/create-form.dto.ts

import { IsString, IsNotEmpty, IsEmail, IsMongoId } from 'class-validator';

export class CreateFormDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsString()
    cidade: string;

    @IsNotEmpty()
    @IsString()
    estado: string;

    @IsMongoId()
    @IsNotEmpty()
    pet: string; 
}
