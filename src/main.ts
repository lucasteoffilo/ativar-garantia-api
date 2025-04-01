import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    // allowedHeaders: ['content-type'],
    // methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
    // preflightContinue: true,
    credentials: true,
    origin: [
      'http://localhost',
      'capacitor://localhost',
      'ionic://localhost',
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:3100',
      'http://localhost:4200',
      'http://r2-sistema.softbite.com.br',
      'https://r2-sistema.softbite.com.br'
    ],
  });
  
  await app.listen(3000);
}bootstrap();
