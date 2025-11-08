import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaElementoService } from './categoria_elemento.service';
import { CreateCategoriaElementoDto } from './dto/create-categoria_elemento.dto';
import { UpdateCategoriaElementoDto } from './dto/update-categoria_elemento.dto';

@Controller('categoria-elemento')
export class CategoriaElementoController {
  constructor(private readonly categoriaElementoService: CategoriaElementoService) {}

  @Post()
  create(@Body() createCategoriaElementoDto: CreateCategoriaElementoDto) {
    return this.categoriaElementoService.create(createCategoriaElementoDto);
  }

  @Get()
  findAll() {
    return this.categoriaElementoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaElementoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaElementoDto: UpdateCategoriaElementoDto) {
    return this.categoriaElementoService.update(+id, updateCategoriaElementoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaElementoService.remove(+id);
  }
}
