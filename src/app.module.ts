import { Module, ValidationPipe } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { APP_PIPE } from '@nestjs/core';

import { NODE_ENV } from './config/app-conflig';
import knexConfig = require('../knexfile');
import { ConflictController } from './conflict/conflict.controller';
import { ConflictService } from './conflict/conflict.service';
import { ResultService } from './result/result.service';
import { ResultController } from './result/result.controller';
import { QueryService } from './shared/query.service';

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: knexConfig[NODE_ENV],
      }),
    }),
  ],
  controllers: [ConflictController, ResultController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    ConflictService, ResultService, QueryService],
})
export class AppModule { }
