import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';

@Controller('materiales')
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) {}

  @Post()
  @UploadImage('materiales')
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateMaterialeDto,
  ) {
    return this.materialesService.create(createDto, file);
  }

  @Get()
  findAll() {
    return this.materialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialesService.findOne(+id);
  }

  @Get('search/:term')
  search(@Param('term') term: string) {
    return this.materialesService.search(term);
  }

  @Patch(':id')
  @UploadImage('materiales')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMaterialeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.materialesService.update(+id, updateDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialesService.remove(+id);
  }
}
