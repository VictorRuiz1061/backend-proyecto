import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SitioService } from './sitio.service';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Controller('sitio')
export class SitioController {
  constructor(private readonly sitioService: SitioService) {}

  @Post()
  create(@Body() createSitioDto: CreateSitioDto) {
    return this.sitioService.create(createSitioDto);
  }

  @Get()
  findAll() {
    return this.sitioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSitioDto: UpdateSitioDto) {
    return this.sitioService.update(+id, updateSitioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitioService.remove(+id);
  }
}
