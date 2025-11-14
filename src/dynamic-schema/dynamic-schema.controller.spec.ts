import { Test, TestingModule } from '@nestjs/testing';
import { DynamicSchemaController } from './dynamic-schema.controller';
import { DynamicSchemaService } from './dynamic-schema.service';

describe('DynamicSchemaController', () => {
  let controller: DynamicSchemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicSchemaController],
      providers: [DynamicSchemaService],
    }).compile();

    controller = module.get<DynamicSchemaController>(DynamicSchemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
