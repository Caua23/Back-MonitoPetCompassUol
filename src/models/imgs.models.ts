import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, Types } from "mongoose";
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Img {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    size: number;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Pets' })
    pet: Types.ObjectId;
}


export const ImgSchema = SchemaFactory.createForClass(Img);