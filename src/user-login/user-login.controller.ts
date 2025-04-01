import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Req, Put, UseGuards } from '@nestjs/common';
import { UserLoginService } from './user-login.service';
import { CreateUserLoginDto } from './dto/create-user-login.dto';
import { Request, Response } from 'express'
import { UpdateUserLoginDto } from './dto/update-user-login.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuario-login')
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) { }

  @Get('user/:id')
  async get(@Req() req: Request, @Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.userLoginService.get(id);
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

  @Get(':id')
  async getOne(@Req() req: Request, @Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.userLoginService.getOne(req, id);
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
  async create(@Req() req: Request, @Res() res, @Body() createUserLoginDto: CreateUserLoginDto[]) {

    try {
      const result = await this.userLoginService.create(req, createUserLoginDto);
      if (result == null) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Usuário já existe, insira um nome de usuário diferente"
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

  @Put(':id')
  async update(@Req() req: Request, @Res() res: Response, @Body() updateUserLoginDto: UpdateUserLoginDto[], @Param() id) {
    try {
      const result = await this.userLoginService.update(req, updateUserLoginDto, id.id);
      if (result.affected == 0) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Usuário já existe, insira um nome de usuário diferente"
        });
      } else {
        res.status(HttpStatus.ACCEPTED).send(
          { statusCode: HttpStatus.ACCEPTED, message: ["success"], data: result }
        );
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: [
            error.message
          ],
          error: "Ocorreu um erro interno"
        }
      );
    }
  }
}
