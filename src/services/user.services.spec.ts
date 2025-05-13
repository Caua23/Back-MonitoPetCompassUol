import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.services';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

const mockUserModel = {
  findOne: jest.fn(),
  save: jest.fn(),
  toJSON: jest.fn(),
  create: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            prototype: {
              save: jest.fn(),
              toJSON: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken('User'));
  });

  describe('CreateUser', () => {
    it('should throw if email or password is missing', async () => {
      await expect(service.CreateUser({ email: '', password: '' } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw if user already exists', async () => {
      userModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(
        service.CreateUser({ email: 'test@example.com', password: '123456', name: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new user successfully', async () => {
      userModel.findOne.mockResolvedValue(null);
      const mockSavedUser = {
        _id: 'user-id',
        email: 'test@example.com',
        password: '123456',
        toJSON: () => ({
          _id: 'user-id',
          email: 'test@example.com',
        }),
      };

      const mockSave = jest.fn().mockResolvedValue(mockSavedUser);
      userModel.prototype.save = mockSave;
      const result = await service.CreateUser({
        email: 'test@example.com',
        password: '123456',
        name: 'test',
      });

      expect(result).toEqual({
        message: 'User created successfully',
        statusCode: 201,
        redirect: '/user/user-id',
        data: {
          _id: 'user-id',
          email: 'test@example.com',
        },
      });
    });
  });

  describe('loginUser', () => {
    it('should throw if email or password is missing', async () => {
      await expect(service.loginUser({ email: '', password: '' })).rejects.toThrow(BadRequestException);
    });

    it('should throw if user is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.loginUser({ email: 'test@example.com', password: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await argon2.hash('123456');
      const userDoc = {
        _id: 'user-id',
        email: 'test@example.com',
        password: hashedPassword,
        toJSON: () => ({
          _id: 'user-id',
          email: 'test@example.com',
        }),
      };
      userModel.findOne.mockResolvedValue(userDoc);

      const result = await service.loginUser({
        email: 'test@example.com',
        password: '123456',
      });

      expect(result).toEqual({
        message: 'Login successfully',
        statusCode: 200,
        redirect: '/user/user-id',
        data: {
          _id: 'user-id',
          email: 'test@example.com',
        },
      });
    });

    it('should throw if password is incorrect', async () => {
      const hashedPassword = await argon2.hash('123456');
      const userDoc = {
        _id: 'user-id',
        email: 'test@example.com',
        password: hashedPassword,
        toJSON: () => ({
          _id: 'user-id',
          email: 'test@example.com',
        }),
      };
      userModel.findOne.mockResolvedValue(userDoc);

      const wrongPassword = 'wrongpassword';
      const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(
        service.loginUser({ email: 'test@example.com', password: wrongPassword }),
      ).rejects.toThrow(BadRequestException);

      verifySpy.mockRestore();
    });
  });
});
