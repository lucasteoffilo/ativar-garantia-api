import { Controller, Get, Post, Patch, Req, Res, HttpStatus, UseGuards, Body, Param, Put } from '@nestjs/common';
import { Request, Response } from 'express'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuario')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async get(@Res() res: Response, @Req() req: Request) {
    try {
      const result = await this.userService.get(req);
      if (result == null) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: "Nenhum registro encontrado"
        });
      } else {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: ["success"],
          data: result
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno"
      });
    }
  }

  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() usuario: any) {
    try {
      const result = await this.userService.create(req, usuario);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: ["success"],
        data: result
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno"
      });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Res() res: Response, @Body() usuario: any) {
    try {
      const result = await this.userService.update(+id, usuario);
      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: "Usuário não encontrado"
        });
      } else {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: ["success"],
          data: result
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno"
      });
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.userService.getOne(+id);
      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: "Usuário não encontrado"
        });
      } else {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: ["success"],
          data: result
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [error.message],
        error: "Ocorreu um erro interno"
      });
    }
  }
}
