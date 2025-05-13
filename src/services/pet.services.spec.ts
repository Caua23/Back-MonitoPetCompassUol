import { Test, TestingModule } from '@nestjs/testing';
import { PetService } from './pet.services';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreatePetDto } from 'src/dto/create.pet.dto';

describe('PetService', () => {
  let service: PetService;
  let petModel: any;
  let imgModel: any;

  beforeEach(async () => {
    const mockPetModel = {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn(),
      create: jest.fn(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
    };

    const mockImgModel = {
      insertMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetService,
        {
          provide: getModelToken('Pet'),
          useValue: mockPetModel,
        },
        {
          provide: getModelToken('Img'),
          useValue: mockImgModel,
        },
      ],
    }).compile();

    service = module.get<PetService>(PetService);
    petModel = module.get(getModelToken('Pet'));
    imgModel = module.get(getModelToken('Img'));
  });

  describe('findAll', () => {
    it('should return an array of pets', async () => {
      const result = [{ name: 'Buddy', gender: 'male' }];
      petModel.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return a pet if ID is valid', async () => {
      const result = { name: 'Buddy', gender: 'Male' };
      petModel.findById.mockResolvedValue(result);

      expect(await service.findById('123')).toBe(result);
    });

    it('should throw an error if no ID is provided', async () => {
      await expect(service.findById('')).rejects.toThrowError(BadRequestException);
    });
  });

  describe('createPet', () => {
    it('should create a pet and return success message', async () => {
      const createPetDto = {
        name: 'Buddy',
        gender: 'male',
        price: 124342,
        size: 567,
        color: 'brown',
        age: 2,
        breed: 'teste',
        category: 'dog',
        location: 'test',
      } as CreatePetDto;

      const files = [{ originalname: 'image.jpg', filename: 'image.jpg', size: 500, key: 'image-key' }] as Express.MulterS3.File[];
      const pet = { ...createPetDto, _id: '123' };
      const imgDocs = files.map(file => ({
        originalName: file.originalname,
        name: file.filename,
        url: `http://localhost:3000/src/tmp/uploads/${file.filename}`,
        size: file.size,
        pet: pet._id,
      }));

      petModel.create.mockResolvedValue(pet);
      imgModel.insertMany.mockResolvedValue(imgDocs);

      const result = await service.createPet(createPetDto, files);

      expect(result.message).toBe('Pet created successfully');
      expect(result.statusCode).toBe(201);
      expect(result.data.Pet).toEqual(pet);
    });

    it('should throw an error if no files are uploaded', async () => {
      const createPetDto = {
        name: 'Buddy',
        gender: 'male',
        price: 124342,
        size: 567,
        color: 'brown',
        age: 2,
        breed: 'teste',
        category: 'dog',
        location: 'test',
      } as CreatePetDto;

      await expect(service.createPet(createPetDto, []))
        .rejects
        .toThrowError(new BadRequestException('No files uploaded'));
    });

    it('should throw an error if pet data is invalid', async () => {
      const invalidCreatePetDto = {
        name: '',
        gender: 'male',
        price: 124342,
        size: 567,
        color: 'brown',
        age: 2,
        breed: "teste",
        category: "dog",
        location: "test"
      } as CreatePetDto;

      const files = [{ originalname: 'image.jpg', filename: 'image.jpg', size: 500, key: 'image-key' }] as Express.MulterS3.File[];

      await expect(service.createPet(invalidCreatePetDto, files))
        .rejects
        .toThrowError(new BadRequestException('Pet data is invalid'));
    });
  });
});
