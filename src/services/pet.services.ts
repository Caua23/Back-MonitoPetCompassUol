
import { Injectable } from "@nestjs/common";
import { Pets } from "./../models/pets.models";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
@Injectable()
export class PetService {
    constructor(@InjectModel('Pet') private petModel: Model<Pets>) {}
    async findAll(): Promise<Pets[]> {
        return await this.petModel.find().exec();
    }   

    async findById(id: string) {
        return await this.petModel.findById(id).exec();
    }   

    async createPet(pet: Pets) {
        try {
            const newPet = new this.petModel(pet);
            return await newPet.save();
        }catch (error) {
            console.log(error);
            return null;
        }
    }

}
