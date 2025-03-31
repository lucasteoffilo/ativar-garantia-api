import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UseGuards, Query, Put } from '@nestjs/common';
import { Request, Response } from 'express'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('licitante')
  async findLicitantes(
    @Query('cpf') cpf: string,
    @Query('nome_empresa') nome: string,
    @Query('nome_fantasia') nomeFantasia: string,
    @Query('cnpj') cnpj: string,
    @Query('inscricao_municipal') inscricaoMunicipal: string,
    @Res() res: Response,
  ) {
    try {
      const licitantes = await this.userService.findUsersByType(3, {
        cpf,
        nome,
        nomeFantasia,
        cnpj,
        inscricaoMunicipal,
      });

      if (licitantes.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Nenhum licitante encontrado',
        });
      }

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Licitantes encontrados',
        data: licitantes,
      });
    } catch (error) {
      console.error('Erro ao buscar licitantes:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro interno ao buscar os licitantes',
      });
    }
  }

  @Get('oficina')
  async findOficinas(
    @Query('cpf') cpf: string,
    @Query('nome') nome: string,
    @Query('nomeFantasia') nomeFantasia: string,
    @Query('cnpj') cnpj: string,
    @Query('inscricaoMunicipal') inscricaoMunicipal: string,
    @Res() res: Response,
  ) {
    try {
      const oficinas = await this.userService.findUsersByType(4, {
        cpf,
        nome,
        nomeFantasia,
        cnpj,
        inscricaoMunicipal,
      });

      if (oficinas.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Nenhuma oficina encontrada',
        });
      }

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Oficinas encontradas',
        data: oficinas,
      });
    } catch (error) {
      console.error('Erro ao buscar oficinas:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro interno ao buscar as oficinas',
      });
    }
  }

  @Get('/licitante/relatorio/pdf')
  async downloadLicitantesPdf(
    @Query('cpf') cpf: string,
    @Query('nome') nome: string,
    @Query('nomeFantasia') nomeFantasia: string,
    @Query('cnpj') cnpj: string,
    @Query('inscricaoMunicipal') inscricaoMunicipal: string,
    @Res() res: Response,
  ) {
    try {
      const licitantes = await this.userService.findUsersByType(3, {
        cpf,
        nome,
        nomeFantasia,
        cnpj,
        inscricaoMunicipal,
      });

      if (licitantes.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Nenhum licitante encontrado para gerar o relatório',
        });
      }

      const pdfBuffer = await this.userService.generatePdfReport(licitantes);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio_licitantes.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar relatório PDF de licitantes:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro interno ao gerar o relatório PDF de licitantes',
      });
    }
  }

  @Get('/oficina/relatorio/pdf')
  async downloadOficinasPdf(
    @Query('cpf') cpf: string,
    @Query('nome') nome: string,
    @Query('nomeFantasia') nomeFantasia: string,
    @Query('cnpj') cnpj: string,
    @Query('inscricaoMunicipal') inscricaoMunicipal: string,
    @Res() res: Response,
  ) {
    try {
      const oficinas = await this.userService.findUsersByType(4, {
        cpf,
        nome,
        nomeFantasia,
        cnpj,
        inscricaoMunicipal,
      });

      if (oficinas.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Nenhuma oficina encontrada para gerar o relatório',
        });
      }

      const pdfBuffer = await this.userService.generatePdfReport(oficinas);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio_oficinas.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar relatório PDF de oficinas:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro interno ao gerar o relatório PDF de oficinas',
      });
    }
  }

  @Get('/licitante/relatorio/excel')
  async downloadLicitantesExcel(
    @Query('cpf') cpf: string,
    @Query('nome') nome: string,
    @Query('nomeFantasia') nomeFantasia: string,
    @Query('cnpj') cnpj: string,
    @Query('inscricaoMunicipal') inscricaoMunicipal: string,
    @Res() res: Response,
  ) {
    try {
      const licitantes = await this.userService.findUsersByType(3, {
        cpf,
        nome,
        nomeFantasia,
        cnpj,
        inscricaoMunicipal,
      });

      if (licitantes.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Nenhum licitante encontrado para gerar o relatório',
        });
      }

      const excelBuffer = await this.userService.generateExcelReport(licitantes);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio_licitantes.xlsx');
      res.send(excelBuffer);
    } catch (error) {
      console.error('Erro ao gerar relatório Excel de licitantes:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro interno ao gerar o relatório Excel de licitantes',
      });
    }
  }

  @Get('/oficina/relatorio/excel')
  async downloadOficinasExcel(
    @Query('cpf') cpf: string,
    @Query('nome') nome: string,
    @Query('nomeFantasia') nomeFantasia: string,
    @Query('cnpj') cnpj: string,
    @Query('inscricaoMunicipal') inscricaoMunicipal: string,
    @Res() res: Response,
  ) {
    try {
      const oficinas = await this.userService.findUsersByType(4, {
        cpf,
        nome,
        nomeFantasia,
        cnpj,
        inscricaoMunicipal,
      });

      if (oficinas.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Nenhuma oficina encontrada para gerar o relatório',
        });
      }

      const excelBuffer = await this.userService.generateExcelReport(oficinas);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio_oficinas.xlsx');
      res.send(excelBuffer);
    } catch (error) {
      console.error('Erro ao gerar relatório Excel de oficinas:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro interno ao gerar o relatório Excel de oficinas',
      });
    }
  }

  @Get('mechanic')
  async getMechanic(@Res() res: Response, @Req() req: Request) {
    try {
      const result = await this.userService.getMechanic(req);
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

  @Get('customer')
  async getCustomer(@Res() res: Response, @Req() req: Request) {
    try {
      const result = await this.userService.getCustomer(req);
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

  // find all users
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

  // find one users
  @Get(':id')
  async getOne(@Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.userService.getOne(id);
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

  // create users
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

  @Get(':id/customer')
  async getOneCustomer(@Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.userService.getOneCustomer(id);
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

  @Get('bidder')
  async getBidder(@Res() res: Response) {
    try {
      const result = await this.userService.getBidder();
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

  @Get(':id/bidder')
  async getOneBidder(@Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.userService.getOneBidder(id);
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

  @Get(':id/getOneMechanic')
  async getOneMechanic(@Res() res: Response, @Param('id') id: number) {
    try {
      const result = await this.userService.getOneMechanic(id);
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

  //search user for params
  @Get(':id_user/type/:id_user_type')
  async getSearchUser(@Param() id_user: number, @Param() id_user_type: number, @Res() res: Response, @Req() req: Request) {
    try {
      const result = await this.userService.getSearchUser(req, id_user, id_user_type);
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

  @Put(':id')
  async update(@Req() req: Request, @Res() res: Response, @Body() createUserDto: CreateUserDto[], @Param() id) {
    try {
      const result = await this.userService.update(req, createUserDto, id.id);
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

  @Post('services')
  async createService(@Req() req: Request, @Res() res, @Body() data: any) {
    try {
      const result = await this.userService.createService(data);
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

  @Get('services/:id')
  async getService(@Res() res: Response, @Req() req: Request, @Param('id') id: number) {
    try {
      const result = await this.userService.getService(id);
      
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
}
