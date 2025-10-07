import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:3000', // or your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you use cookies
  });
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
