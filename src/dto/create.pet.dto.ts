// src/dto/create-pet.dto.ts

import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsLowercase } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  breed: string; 

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  gender: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  size: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  color: string;

  @IsString()
  @IsOptional() 
  addInformation?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  location: string;
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  category: 'dog' | 'cat';

}
