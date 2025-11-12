import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMovimientoService } from './tipo_movimiento.service';
import { CreateTiposMovimientoDto } from './dto/create-tipo_movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo_movimiento.dto';

@Controller('tipo-movimiento')
export class TipoMovimientoController {
  constructor(private readonly tipoMovimientoService: TipoMovimientoService) {}

  @Post()
  create(@Body() createTipoMovimientoDto: CreateTiposMovimientoDto) {
    return this.tipoMovimientoService.create(createTipoMovimientoDto);
  }

  @Get()
  findAll() {
    return this.tipoMovimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoMovimientoService.findOne(+id);
  }

  @Get('search/:term')
  search(@Param('term') term: string) {
    return this.tipoMovimientoService.search(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoMovimientoDto: UpdateTipoMovimientoDto) {
    return this.tipoMovimientoService.update(+id, updateTipoMovimientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoMovimientoService.remove(+id);
  }
}
