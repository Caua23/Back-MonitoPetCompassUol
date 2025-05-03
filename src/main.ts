import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001', process.env.FRONTEND_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  const config = new DocumentBuilder()
    .setTitle('Pet API')
    .setDescription('API para gerenciamento de pets')
    .setVersion('1.0')
    .addTag('API de gerenciamento para pets')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000, ()=>{ 
    console.log("Server is running on url: http://localhost:" + (process.env.PORT ?? 3000));
  });
}
bootstrap();
