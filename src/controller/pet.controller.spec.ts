import { Test, TestingModule } from '@nestjs/testing';
import { PetController } from './pet.controller';
import { PetService } from 'src/services/pet.services';
import { CreatePetDto } from 'src/dto/create.pet.dto';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

describe('PetController', () => {
  let petController: PetController;
  let petService: PetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetController],
      providers: [
        PetService,
        {
          provide: getModelToken('Pet'),
          useValue: {}, 
        },
        {
          provide: getModelToken('Img'),
          useValue: {}, 
        },
      ],
    }).compile();

    petController = module.get<PetController>(PetController);
    petService = module.get<PetService>(PetService);
  });

  it('should create a pet with file upload', async () => {
    const mockPetDto: CreatePetDto = {
      name: 'Buddy',
      breed: 'Beagle',
      gender: 'male',
      age: 3,
      size: 50,
      color: 'brown',
      addInformation: 'Friendly and energetic',
      price: 100,
      location: 'Viamão',
      category: 'dog',
    };

    const mockFiles = [
      {
        originalname: 'dog.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from(''),
        size: 1024,
      },
    ];

    jest.spyOn(petService, 'createPet').mockResolvedValue({
      ...mockPetDto,
      files: mockFiles,
    });

    const result = await petController.createPet(mockPetDto, mockFiles as any);

    expect(result).toEqual({
      ...mockPetDto,
      files: mockFiles,
    });

    expect(petService.createPet).toHaveBeenCalledWith(mockPetDto, mockFiles);
  });

  it('should throw BadRequestException if no files are uploaded', async () => {
    const mockPetDto: CreatePetDto = {
      name: 'Buddy',
      breed: 'Beagle',
      gender: 'male',
      age: 3,
      size: 50,
      color: 'brown',
      addInformation: 'Friendly and energetic',
      price: 100,
      location: 'New York',
      category: 'dog',
    };

    const mockFiles = [

    ];

    jest.spyOn(petService, 'createPet').mockRejectedValue(new BadRequestException('No files uploaded'));

    try {
      await petController.createPet(mockPetDto, mockFiles as any);
    } catch (e) {
      expect(e.response.message).toBe('No files uploaded');
    }
  });
});
