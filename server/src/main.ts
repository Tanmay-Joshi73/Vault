import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Compression
  // app.use(compression({ threshold: 1024 }));

  // CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Vault Application')
    .setDescription('This is a vault application for storing and enabling user to store all of its secrets')
    .setVersion('1.0')
    .addTag('TheSecuredVault')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
