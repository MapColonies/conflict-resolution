import { Module, ValidationPipe } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { APP_PIPE } from '@nestjs/core';

import { NODE_ENV } from './config/app-conflig';
import knexConfig = require('../knexfile');
import { ConflictsController } from './conflicts/conflicts.controller';
import { ConflictsService } from './conflicts/conflicts.service';
import { ResolutionsService } from './resolutions/resolutions.service';
import { ResolutionsController } from './resolutions/resolutions.controller';
import { QueryService } from './shared/query.service';
import { ResponseHelperService } from './shared/response-helper.service';

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: knexConfig[NODE_ENV],
      }),
    }),
  ],
  controllers: [ConflictsController, ResolutionsController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    ConflictsService, ResolutionsService, QueryService, ResponseHelperService],
})
export class AppModule { }
