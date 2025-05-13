import { BadRequestException, Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { isValidObjectId } from "mongoose";
import { multerConfig } from "src/config/multer/multer";
import { CreatePetDto } from "src/dto/create.pet.dto";
import { PetService } from "src/services/pet.services";

@ApiTags('Pet')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) { }

  @ApiOperation({ summary: 'Get all pets' })
  @ApiResponse({ status: 200, description: 'Successfully fetched all pets' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('getAll')
  async getAllPet(
    @Query('limit') limit?: string,
    @Query('gender') gender?: string,
    @Query('color') color?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('size') size?: string,
  ) {
    const limitNumber = limit ? Math.max(1, Number(limit)) : undefined;
    return this.petService.findAll(limitNumber, gender, color, priceMin, priceMax, size);
  }


  @ApiOperation({ summary: 'Get pet by ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched pet' })
  @ApiResponse({ status: 400, description: 'Invalid id format' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @Get('get/:id')
  async getPetById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id format');
    }
    const pet = await this.petService.findById(id);
    if (!pet) {
      throw new BadRequestException('Pet not found');
    }
    return pet;
  }

  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ status: 201, description: 'Pet successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid pet data or files' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('create')
  @UseInterceptors(FilesInterceptor('files', 8, multerConfig))
  async createPet(
    @Body() petBody: CreatePetDto,
    @UploadedFiles() files: Express.MulterS3.File[]
  ) {
    const pet = await this.petService.createPet(petBody, files);
    return pet;
  }
}
