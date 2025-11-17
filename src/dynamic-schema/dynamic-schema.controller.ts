import { Controller, Post, Body } from '@nestjs/common';
import { DynamicSchemaService } from './dynamic-schema.service';

@Controller('schema')
export class DynamicSchemaController {
  constructor(private readonly schemaService: DynamicSchemaService) {}

  @Post('')
  async create(@Body() body: any) {
    return this.schemaService.createFromJson(body);
  }
}
