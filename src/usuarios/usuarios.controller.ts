import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageInterceptor } from 'src/common/interceptors/image.interceptor';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'), ImageInterceptor)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    return this.usuariosService.create(createUsuarioDto, file);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Get('search/:term')
  search(@Param('term') term: string) {
    return this.usuariosService.search(term);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'), ImageInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usuariosService.update(+id, updateUsuarioDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
