import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DynamicSchemaService } from './dynamic-schema.service';
import { CreateDynamicSchemaDto } from './dto/create-dynamic-schema.dto';
import { UpdateDynamicSchemaDto } from './dto/update-dynamic-schema.dto';

@Controller('dynamic-schema')
export class DynamicSchemaController {
  constructor(private readonly dynamicSchemaService: DynamicSchemaService) {}

  @Post()
  create(@Body() createDynamicSchemaDto: CreateDynamicSchemaDto) {
    return this.dynamicSchemaService.create(createDynamicSchemaDto);
  }

  @Get()
  findAll() {
    return this.dynamicSchemaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicSchemaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicSchemaDto: UpdateDynamicSchemaDto) {
    return this.dynamicSchemaService.update(+id, updateDynamicSchemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicSchemaService.remove(+id);
  }
}
