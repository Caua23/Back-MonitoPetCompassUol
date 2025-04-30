
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document, HydratedDocument } from 'mongoose';

export type PetsDocument = HydratedDocument<User>;

@Schema()
export class User extends Document{
    @Prop({required: true})
    name: string;
    
    @Prop({unique: true})
    email: string;

    @Prop({required: true})
    password: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);
