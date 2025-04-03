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
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost',
        'capacitor://localhost',
        'ionic://localhost',
        'http://localhost:3001',
        'http://localhost:3100',
        'http://localhost:4200',
        'https://ativar-garantia-services-ativar-garantia-admin.dxwvrh.easypanel.host',
        'https://gestao.ativargarantia.com.br',
        'https://ativargarantia.com.br'
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Referer',
      'User-Agent',
      'sec-ch-ua',
      'sec-ch-ua-mobile',
      'sec-ch-ua-platform'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  await app.listen(3000);
}bootstrap();
