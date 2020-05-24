import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { APP_VERSION } from '../../../config/app-conflig';

const options = new DocumentBuilder()
    .setTitle('Conflict Resolution')
    .setDescription('The Conflict Resolution API')
    .setVersion(APP_VERSION)
    .build();

export const swaggerInitialize = (app: INestApplication) => {
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
}
