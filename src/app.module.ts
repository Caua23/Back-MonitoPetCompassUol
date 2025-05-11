import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FormController } from './controller/form.controller';
import { PetController } from './controller/pet.controller';
import { UserController } from './controller/user.controller';
import { FormService } from './services/form.services';
import { PetService } from './services/pet.services';
import { UserService } from './services/user.services';
import { FormSchema } from './models/forms.models';
import { PetSchema } from './models/pets.models';
import { UserSchema } from './models/users.models';
import { ImgSchema } from './models/imgs.models';
import { ProductSchema } from './models/products.models';
import { ImgProductSchema } from './models/imgsProducts.models';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './services/products.services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@compasspetmongo.mihzjsb.mongodb.net/?retryWrites=true&w=majority&appName=CompassPetMongo`,
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Form', schema: FormSchema },
      { name: 'Pet', schema: PetSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Img', schema: ImgSchema }, 
      {name: 'Product', schema: ProductSchema},
      {name: 'ImgProduct', schema: ImgProductSchema}
    ]),

  ],
  controllers: [
    FormController,
    PetController,
    UserController,
    ProductsController
  ],
  providers: [
    FormService,
    PetService,
    UserService,
    ProductsService
  ],
})
export class AppModule {}