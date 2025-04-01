import { Controller, Get, Post, Body, Query, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { FormularioGarantiaService } from './formulario-garantia.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('formulario-garantia')
export class FormularioGarantiaController {
  constructor(private readonly formularioGarantiaService: FormularioGarantiaService) {}

  @Post()
  async create(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.formularioGarantiaService.create(body);
      res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: ["success"],
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno ao criar o formulário de garantia",
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findByUserId(@Req() req, @Res() res: Response) {
    try {
      const userId = req.user.data.id_usuario; 
      const result = await this.formularioGarantiaService.findByUserId(userId);
      res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: ["success"],
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno ao buscar os formulários de garantia",
      });
    }
  }
}
