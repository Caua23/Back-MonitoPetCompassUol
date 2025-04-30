
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double, HydratedDocument, Types } from 'mongoose';

export type PetsDocument = HydratedDocument<Form>;

@Schema()
export class Form extends Document{
    
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    message: string;

    @Prop({required: true})
    phone: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'Pets'})
    pet: Types.ObjectId;
}

export const FormSchema = SchemaFactory.createForClass(Form);
