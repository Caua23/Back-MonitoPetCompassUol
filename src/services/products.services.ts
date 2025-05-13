import { HttpStatus, Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/models/products.models';
import { CreateProductDto } from 'src/dto/create.product.dto';
import { ImgProduct } from 'src/models/imgsProducts.models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('ImgProduct') private readonly imgProductModel: Model<ImgProduct>,
  ) { }

  async create(createProductDto: CreateProductDto, files: Express.MulterS3.File[]): Promise<any> {
    try {
      if (!files || files.length === 0) throw new BadRequestException('No files uploaded');
      if (!createProductDto) throw new BadRequestException('Invalid product data');


      const product = await this.productModel.create(createProductDto);

      const storageType = process.env.STORAGE_TYPE || 'local';

      const imgDocs = files.map(file => ({
        originalName: file.originalname,
        name: storageType === 's3' ? file.key : file.filename,
        url: storageType === 's3' ? file.location : `http://localhost:3000/src/tmp/uploads/${file.filename}`,
        size: file.size,
        product: product._id,
      }));
      await this.imgProductModel.insertMany(imgDocs);

      return {
        message: 'Products created successfully',
        statusCode: HttpStatus.CREATED,
        redirect: '/product/' + product._id,
        data: { Product: product, Img: imgDocs },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating product: ' + error.message);
    }
  }



async findAll(
  limit: number, 
  priceMin?: string, 
  priceMax?: string
): Promise<Product[]> {
  const filters: { [key: string]: any } = {};

  if (priceMin || priceMax) {
    filters['price'] = {};
    if (priceMin) {
      const min = Number(priceMin);
      if (isNaN(min)) throw new Error('Invalid priceMin');
      filters['price'].$gte = min;
    }
    if (priceMax) {
      const max = Number(priceMax);
      if (isNaN(max)) throw new Error('Invalid priceMax');
      filters['price'].$lte = max;
    }
  }

  return this.productModel
    .find(filters)
    .populate('imgsProduct')
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
}


  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).populate('imgsProduct').exec();
  }
}
