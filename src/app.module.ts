import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { controllerFormModule } from './controller/form.controller';
import { controllerPetModule } from './controller/pet.controller';
import { controllerUserModule } from './controller/user.controller';
import { FormService } from './services/form.services';
import { PetService } from './services/pet.services';
import { UserService } from './services/user.services';
import { FormSchema } from './models/forms.models';
import { PetSchema } from './models/pets.models';
import { UserSchema } from './models/users.models';

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
    ]),

  ],
  controllers: [
    controllerFormModule,
    controllerPetModule,
    controllerUserModule
  ],
  providers: [
    FormService,
    PetService,
    UserService
  ],
})
export class AppModule {}