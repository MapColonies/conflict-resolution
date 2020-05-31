import { Module, ValidationPipe } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { APP_PIPE } from '@nestjs/core';

import { NODE_ENV } from './config/app-conflig';
import knexConfig = require('../knexfile');
import { ConflictsController } from './conflicts/conflicts.controller';
import { ConflictsService } from './conflicts/conflicts.service';
import { ResultsService } from './results/results.service';
import { ResultsController } from './results/results.controller';
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
  controllers: [ConflictsController, ResultsController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    ConflictsService, ResultsService, QueryService, ResponseHelperService],
})
export class AppModule { }
