import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from 'src/services/products.services';
import { CreateProductDto } from 'src/dto/create.product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HttpStatus } from '@nestjs/common';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result = await productsController.getAllProducts(2);
      expect(result).toEqual([]);
      expect(productsService.findAll).toHaveBeenCalledWith(2);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const result = await productsController.getProductById('1');
      expect(result).toEqual({});
      expect(productsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = { name: 'Product 1', price: 100 , description: 'Description 1' };
      const files: Express.MulterS3.File[] = [];
      const result = await productsController.createProduct(createProductDto, files);
      expect(result).toEqual({});
      expect(productsService.create).toHaveBeenCalledWith(createProductDto, files);
    });
  });
});
