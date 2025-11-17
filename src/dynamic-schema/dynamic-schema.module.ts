import { Module } from '@nestjs/common';
import { DynamicSchemaController } from './dynamic-schema.controller';
import { DynamicSchemaService } from './dynamic-schema.service';

@Module({
  controllers: [DynamicSchemaController],
  providers: [DynamicSchemaService],
  exports: [DynamicSchemaService],
})
export class DynamicSchemaModule {}
