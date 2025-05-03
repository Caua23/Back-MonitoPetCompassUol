// src/dto/create-pet.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  breed: string; 

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional() 
  addInformation?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  location: string;
}
