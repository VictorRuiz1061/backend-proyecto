import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSitioService } from './tipo_sitio.service';
import { CreateTipoSitioDto } from './dto/create-tipo_sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo_sitio.dto';

@Controller('tipo-sitio')
export class TipoSitioController {
  constructor(private readonly tipoSitioService: TipoSitioService) {}

  @Post()
  create(@Body() createTipoSitioDto: CreateTipoSitioDto) {
    return this.tipoSitioService.create(createTipoSitioDto);
  }

  @Get()
  findAll() {
    return this.tipoSitioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoSitioService.findOne(+id);
  }

  @Get('search/:term')
  search(@Param('term') term: string) {
    return this.tipoSitioService.search(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoSitioDto: UpdateTipoSitioDto) {
    return this.tipoSitioService.update(+id, updateTipoSitioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoSitioService.remove(+id);
  }
}
