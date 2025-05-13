import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;

 @Schema()
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: string;

    @Prop({ required: true })
    addInformation: string;
    
    @Prop({ required: true })
    product: 'food' | 'toy' | 'costume';

    @Prop({ required: true })
    size: number;
    @Prop({ required: true, default: Date.now })
    date: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('imgsProduct', {
    ref: 'ImgProduct',
    localField: '_id',
    foreignField: 'product',
});


ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });