import { Controller, Get } from "@nestjs/common";
import { PetService } from "src/services/pet.services";

@Controller('pet')
export class controllerPetModule {
    constructor(private readonly petService: PetService) {}

    @Get('getAll')
    async getAllPet() {
        const pets = await this.petService.findAll();
        return pets;
    }
    @Get('get/:id')
    async getPetById(id: string) {
        const pet = await this.petService.findById(id);
        return pet;
    }
}