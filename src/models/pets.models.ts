
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double, HydratedDocument } from 'mongoose';

export type PetsDocument = HydratedDocument<Pets>;

@Schema()
export class Pets extends Document{
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    Breed: string;
    @Prop({required: true})
    Gender: string;
    @Prop({required: true})
    age: number;
    @Prop({required: true})
    Size: number;
    @Prop({required: true})
    Color: string;
    @Prop({default: false})
    AddInformation: string;
    @Prop({required: true})
    Image: string;
    @Prop({required: true})
    Price: number;
    @Prop({required: true})
    Location: string;
    
}

export const PetSchema = SchemaFactory.createForClass(Pets);
