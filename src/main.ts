import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  dotenv.config();
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
