
import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
    ) {}
    async findAll(): Promise<Pets[]> {
        return await this.petModel.find().exec();
    }   

    async findById(id: string): Promise<Pets | null> {
        if (!id) {
            return null;
        }
        return await this.petModel.findById(id).exec();
    }   

    async createPet(createPetDto: CreatePetDto, files: Express.Multer.File[]): Promise<any> {
        try {
            if (!files || files.length === 0) return HttpException.createBody(400, 'No files uploaded', HttpStatus.BAD_REQUEST);
            if (!createPetDto) return HttpException.createBody(400, 'Invalid pet' , HttpStatus.BAD_REQUEST);
            const pet = await this.petModel.create(createPetDto);
            const imgDocs = files.map(file => ({
                name: file.originalname,
                url: `/uploads/${file.filename}`, 
                size: file.size,
                pet: pet._id,
              }));
            await this.imgModel.insertMany(imgDocs);
            return HttpException.createBody(201, 'Pet created successfully' , HttpStatus.CREATED);
        }catch (error) {
            console.log(error);
            return HttpException.createBody(500, 'Internal server error' , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
