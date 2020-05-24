import { Module } from '@nestjs/common';

import { ConflictController } from './conflict.controller';
import { ConflictService } from './conflict.service';

@Module({
    controllers: [ConflictController],
    providers: [ConflictService],
})
export class ConflictModule { }
