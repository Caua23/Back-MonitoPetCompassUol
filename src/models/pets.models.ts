
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double, HydratedDocument } from 'mongoose';

export type PetsDocument = HydratedDocument<Pets>;

@Schema()
export class Pets extends Document{
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    breed: string;
    @Prop({required: true})
    gender: string;
    @Prop({required: true})
    age: number;
    @Prop({required: true})
    size: number;
    @Prop({required: true})
    color: string;
    @Prop({default: false})
    addInformation: string;
    @Prop({required: true})
    price: number;
    @Prop({required: true})
    location: string;
    
}

export const PetSchema = SchemaFactory.createForClass(Pets);

PetSchema.virtual('imgs', {
    ref: 'Img',           
    localField: '_id',    
    foreignField: 'pet',  
  });
  

  PetSchema.set('toObject', { virtuals: true });
  PetSchema.set('toJSON', { virtuals: true });