import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FormService } from './form.services';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { CreateFormDto } from 'src/dto/create.form.dto';

describe('FormService', () => {
  let service: FormService;

  const modelStaticMethods = {
    findOne: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const modelConstructorMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    modelConstructorMock.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data),
    }));

    const modelProvider = Object.assign(modelConstructorMock, modelStaticMethods);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormService,
        {
          provide: getModelToken('Form'),
          useValue: modelProvider,
        },
      ],
    }).compile();

    service = module.get<FormService>(FormService);
  });

  describe('CreateForm', () => {
    it('should create a form successfully', async () => {
      const dto = { email: 'test@example.com', pet: '123' };
      modelStaticMethods.findOne.mockResolvedValue(null);
      const result = await service.CreateForm(dto as any);
      expect(result).toEqual({
        message: 'Form created successfully.',
        statusCode: HttpStatus.CREATED,
        redirect: '/forms',
        data: dto,
      });
    });

    it('should throw if email exists', async () => {
      const dto = {
        email: 'test@example.com',
        pet: '6821ebe034fe0aaf0f344f88',
        name: 'test',
        message: 'test',
        phone: 'test',
        cidade: 'test',
        estado: 'test',
      } as CreateFormDto;
      modelStaticMethods.findOne.mockResolvedValue(dto);
      await expect(service.CreateForm(dto as any)).rejects.toThrow(BadRequestException);
    });

    it('must throw if pet is not provided', async () => {
      const dto = {
        email: 'test@example.com',
        pet: '',
        name: 'test',
        message: 'test',
        phone: 'test',
        cidade: 'test',
        estado: 'test',
      } as CreateFormDto;
      modelStaticMethods.findOne.mockResolvedValue(null);
      await expect(service.CreateForm(dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllForms', () => {
    it('should return all forms', async () => {
      const forms = [{ email: 'a@example.com' }, { email: 'b@example.com' }];
      modelStaticMethods.exec.mockResolvedValue(forms);
      const result = await service.getAllForms();
      expect(result).toEqual(forms);
    });
  });

  describe('getFormById', () => {
    it('should return form by ID', async () => {
      const form = { _id: '1', email: 'a@example.com' };
      modelStaticMethods.exec.mockResolvedValue(form);
      const result = await service.getFormById('1');
      expect(result).toEqual(form);
    });

    it('should throw if form not found', async () => {
      modelStaticMethods.exec.mockResolvedValue(null);
      await expect(service.getFormById('1')).rejects.toThrow(BadRequestException);
    });
  });
});
