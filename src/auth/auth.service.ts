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
      `SELECT id_usuario_login, 
              id_usuario, 
              email as username, 
              password 
       FROM tb_usuario_login 
       WHERE email = ? AND password = ? AND flg_status = 1`,
      [username, password]
    );

    console.log(login);
    
    // Se o usuário retornado for nulo, significa que a autenticação falhou
    if (login[0].id_user_father == null) {
      throw new ForbiddenException('Acesso negado');
    }

    
    
    const payload = {
      id_user: login[0].id_user,
      name: login[0].name,
      username: login[0].username,
      id_user_type: login[0].id_user_type,
      id_user_father: login[0].id_user_father,
      id_user_login: login[0].id_user_login,
      id_profile: login[0].id_profile,
    };
    
    const id_token = await this.jwtService.sign(payload);

    const access_token = await this.jwtService.sign({
      iss: "http://www.ativargarantia.com.br",
      aud: "nestjs-jwt-auth",
      data: payload,
      scope: 'full_access',
      jti: this.genJti(),
  });
    // return { id_token, access_token, data };
    return { id_token, access_token,  };
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