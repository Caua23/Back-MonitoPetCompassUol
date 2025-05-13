import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'src/services/user.services';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { LoginUserDto } from 'src/dto/login.user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            loginUser: jest.fn(),
            CreateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('login', () => {
    it('should call UserService.loginUser with correct credentials', async () => {
    const loginDto = new LoginUserDto();
    loginDto.email = 'exemple2@example.com';
    loginDto.password = 'password';
    await userController.login(loginDto);
      expect(userService.loginUser).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('signUp', () => {
    it('should call UserService.CreateUser with correct user data', async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.email = 'exemple2@example.com';
      createUserDto.password = 'password';
      await userController.signUp(createUserDto);
      expect(userService.CreateUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});
