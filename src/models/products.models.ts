import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: string;

    @Prop({ required: true })
    description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('imgsProduct', {
    ref: 'ImgProduct',
    localField: '_id',
    foreignField: 'product',
});


ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });