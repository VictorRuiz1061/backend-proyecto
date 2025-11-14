import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicSchemaDto } from './create-dynamic-schema.dto';

export class UpdateDynamicSchemaDto extends PartialType(CreateDynamicSchemaDto) {}
