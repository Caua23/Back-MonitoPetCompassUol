
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double, HydratedDocument, Types } from 'mongoose';
import { Email } from './Email';

export type PetsDocument = HydratedDocument<Form>;

@Schema()
export class Form extends Document{
    
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    email: Email;

    @Prop({required: true})
    cidade: string;
    
    @Prop({required: true})
    estado: string;

    @Prop({required: true})
    phone: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'Pets'})
    pet: Types.ObjectId;
}

export const FormSchema = SchemaFactory.createForClass(Form);
