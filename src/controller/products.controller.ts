import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { multerConfig } from "src/config/multer/multer";
import { CreateProductDto } from "src/dto/create.product.dto";
import { ProductsService } from "src/services/products.services";

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Returns all products or an empty array if none' })
    @Get('/getAll')
    async getAllProducts(@Query('limit') limit = 10) {
        limit = Math.max(1, Number(limit));
        return this.productsService.findAll(limit);
    }

    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Returns the product with the given ID' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Get('/get/:id')
    async getProductById(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid product data or files' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
    @Post('/create')
    async createProduct(
        @Body(new ValidationPipe({ transform: true })) productBody: CreateProductDto,
        @UploadedFiles() files: Express.MulterS3.File[]
    ) {
        const product = await this.productsService.create(productBody, files);
        return product;
    }
}
