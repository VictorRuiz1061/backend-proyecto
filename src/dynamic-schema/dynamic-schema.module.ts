import { Module } from '@nestjs/common';
import { DynamicSchemaService } from './dynamic-schema.service';
import { DynamicSchemaController } from './dynamic-schema.controller';

@Module({
  controllers: [DynamicSchemaController],
  providers: [DynamicSchemaService],
})
export class DynamicSchemaModule {}
