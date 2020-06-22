import { NestFactory } from '@nestjs/core';

import { APP_PORT} from './config/app-config';
import { swaggerInitialize } from './global/services/swagger/swagger-init';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerInitialize(app);
  await app.listen(+APP_PORT);
}
bootstrap();
