import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Connection } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private connection: Connection,
  ) { }

  // auth.service

  async signIn(username, password) {
    const [login] = await this.connection.query(
      `SELECT id_usuario, 
              email as username, 
              senha 
       FROM tb_usuario
       WHERE email = ? AND senha = ? AND flg_status = 1`,
      [username, password]
    );

    // Se o usuário retornado for nulo, significa que a autenticação falhou
    if (login?.id_usuario == null) {
      throw new ForbiddenException('Acesso negado');
    }

    const [user] = await this.connection.query(
      `SELECT * FROM tb_usuario 
       WHERE id_usuario = ?`,
      [login.id_usuario]
    );

    const payload = {
      id_usuario: login.id_usuario,
      username: login.username,
      ulid_usuario: user.ulid_usuario,
      id_tipo_usuario: user.id_tipo_usuario,
      nome: user.nome,
      cpf_cnpj: user.cpf_cnpj,
      flg_status: user.flg_status
    };

    const id_token = await this.jwtService.sign(payload);

    const access_token = await this.jwtService.sign({
      iss: "http://www.ativargarantia.com.br",
      aud: "nestjs-jwt-auth",
      data: payload,
      scope: 'full_access',
      jti: this.genJti(),
    });

    return {
      id_token, 
      access_token, 
      ...payload
    };
  }

  genJti() {
    let jti = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return jti;
  }

}