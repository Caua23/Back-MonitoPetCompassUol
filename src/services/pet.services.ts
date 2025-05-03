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

    async findAll(): Promise<Pets[]> {

        return await this.petModel.find().populate('imgs').exec();
    }

    async findById(id: string): Promise<Pets | null> {
        if (!id) {
            return null;
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
            let storageType = process.env.STORAGE_TYPE;
            if (!storageType)
                storageType = 'local';
            const imgDocs = files.map(file => ({
                originalName: file.originalname,
                name: storageType === 's3' ? file.key : file.filename,
                url: storageType === 's3' ? file.location : `tmp/uploads/${file.filename}`,
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
            throw new InternalServerErrorException(error);
        }
    }
}
