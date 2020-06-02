import { Module } from '@nestjs/common';

import { ResolutionsController } from './resolutions.controller';
import { ResolutionsService } from './resolutions.service';

@Module({
    controllers: [ResolutionsController],
    providers: [ResolutionsService],
})
export class ResolutionsModule { }
