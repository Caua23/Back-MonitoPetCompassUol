
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document, HydratedDocument } from 'mongoose';
import { Email } from './Email';

export type PetsDocument = HydratedDocument<User>;

@Schema()
export class User extends Document{
    @Prop({required: true})
    name: string;
    
    @Prop({unique: true})
    email: Email;

    @Prop({required: true, select: false})
    password: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);
