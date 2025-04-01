import { Controller, Get, Post, Patch, Req, Res, HttpStatus, UseGuards, Body } from '@nestjs/common';
import { Request, Response } from 'express'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async get(@Res() res: Response) {
    try {
      const result = await this.userService.get();
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
  async create(@Req() req: Request, @Res() res, @Body() createUserDto: CreateUserDto[]) {
    try {
      const result = await this.userService.create(req, createUserDto);
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
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

  @Patch('ids')
  async patch(@Req() req: Request, @Res() res: Response, @Body() data) {
    try {
      const result = await this.userService.patch(req, data);
      if (result.affected == 0) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: "Nenhum registro encontrado"
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
