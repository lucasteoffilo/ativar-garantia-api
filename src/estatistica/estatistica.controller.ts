import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { EstatisticaService } from './estatistica.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

@Controller('estatistica')
export class EstatisticaController {
  constructor(private readonly estatisticaService: EstatisticaService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getMetricsByUser(@Req() req, @Res() res: Response) {
    try {
      const user = req.user.data;
      const result = await this.estatisticaService.getMetricsByUser(user);
      res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: ["success"],
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno ao buscar as métricas",
      });
    }
  }
}
