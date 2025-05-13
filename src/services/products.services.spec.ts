import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.services';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from 'src/models/products.models';
import { ImgProduct } from 'src/models/imgsProducts.models';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: any;
  let imgProductModel: any;

  const mockProductModel = {
    find: jest.fn().mockResolvedValue([{ name: 'Test' }]),
    findById: jest.fn().mockResolvedValue({ name: 'Test' }),
    create: jest.fn().mockResolvedValue({ name: 'Test' }),
  };

  const mockImgProductModel = {
    insertMany: jest.fn().mockResolvedValue([{ name: 'image.jpg' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(ImgProduct.name),
          useValue: mockImgProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get(getModelToken(Product.name));
    imgProductModel = module.get(getModelToken(ImgProduct.name));
  });

  it('should return all products', async () => {
    const result = await service.findAll(10);
    expect(result).toEqual([{ name: 'Test' }]);
    expect(productModel.find).toHaveBeenCalled();
  });

  it('should return one product', async () => {
    const result = await service.findOne('id');
    expect(result).toEqual({ name: 'Test' });
    expect(productModel.findById).toHaveBeenCalledWith('id');
  });

  it('should create a product', async () => {
    const dto = { name: 'Test', price: 99.9, description: 'desc' };
    const result = await service.create(dto, [{ originalname: 'image.jpg', filename: 'image.jpg', size: 500, key: 'image-key' }] as Express.MulterS3.File[] );
    expect(result).toEqual({ name: 'Test' });
    expect(productModel.create).toHaveBeenCalledWith(dto);
  });
});
