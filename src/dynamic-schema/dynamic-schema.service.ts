import { Injectable } from '@nestjs/common';
import { CreateDynamicSchemaDto } from './dto/create-dynamic-schema.dto';
import { UpdateDynamicSchemaDto } from './dto/update-dynamic-schema.dto';

@Injectable()
export class DynamicSchemaService {
  create(createDynamicSchemaDto: CreateDynamicSchemaDto) {
    return 'This action adds a new dynamicSchema';
  }

  findAll() {
    return `This action returns all dynamicSchema`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicSchema`;
  }

  update(id: number, updateDynamicSchemaDto: UpdateDynamicSchemaDto) {
    return `This action updates a #${id} dynamicSchema`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicSchema`;
  }
}
