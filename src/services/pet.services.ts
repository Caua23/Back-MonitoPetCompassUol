import { BadRequestException, Injectable, InternalServerErrorException, HttpStatus } from "@nestjs/common";
import { Pets } from "./../models/pets.models";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePetDto } from "src/dto/create.pet.dto";
import { Img } from "src/models/imgs.models";



@Injectable()
export class PetService {
  constructor(
    @InjectModel('Pet') private petModel: Model<Pets>,
    @InjectModel('Img') private imgModel: Model<Img>
  ) { }
  async findAll(
    limit?: number,
    gender?: string,
    color?: string,
    priceMin?: string,
    priceMax?: string,
    size?: string
  ): Promise<Pets[]> {
    const filters: { [key: string]: any } = {};
    if (gender) filters['gender'] = gender;
    if (color) filters['color'] = color;
    if (priceMin) filters['price'] = { ...filters['price'], $gte: Number(priceMin) };
    if (priceMax) filters['price'] = { ...filters['price'], $lte: Number(priceMax) };
    if (size) {
      let sizeRange;
      switch (size.toLowerCase()) {
        case 'small':
          sizeRange = { $gte: 30, $lte: 60 };
          break;
        case 'medium':
          sizeRange = { $gte: 61, $lte: 120 };
          break;
        case 'large':
          sizeRange = { $gte: 121 };
          break;
        default:
          sizeRange = {};
          break;
      }
      if (Object.keys(sizeRange).length > 0) filters['size'] = sizeRange;
    }
    const query = this.petModel.find(filters);
    if (limit && limit > 0) query.limit(limit);


    return await query
      .populate('imgs')
      .sort({ createdAt: -1 })
      .exec();
  }


  async findById(id: string): Promise<Pets | null> {
    if (!id) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.petModel.findById(id).populate('imgs').exec();
  }

  async createPet(createPetDto: CreatePetDto, files: Express.MulterS3.File[]): Promise<any> {
    try {
      if (!files || files.length === 0)
        throw new BadRequestException('No files uploaded');
      if (!createPetDto)
        throw new BadRequestException('Invalid pet data');

      const pet = await this.petModel.create(createPetDto);

      const storageType = process.env.STORAGE_TYPE || 'local';

      const imgDocs = files.map(file => ({
        originalName: file.originalname,
        name: storageType === 's3' ? file.key : file.filename,
        url: storageType === 's3' ? file.location : `http://localhost:3000/src/tmp/uploads/${file.filename}`,
        size: file.size,
        pet: pet._id,
      }));

      await this.imgModel.insertMany(imgDocs);

      return {
        message: 'Pet created successfully',
        statusCode: HttpStatus.CREATED,
        redirect: '/pets',
        data: { Pet: pet, Img: imgDocs },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating pet: ' + error.message);
    }

  }

}