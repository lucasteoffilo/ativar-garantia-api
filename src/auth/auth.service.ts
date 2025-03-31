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
    
    const [result] = await this.connection.query(
      'CALL sp_Exe_Login(?, ?)',
      [username, password]
    );
    // console.log(result);
    
    // Se o usuário retornado for nulo, significa que a autenticação falhou
    if (result[0].id_user_father == null) {
      throw new ForbiddenException('Acesso negado');
    }
    
    const payload = {
      id_user: result[0].id_user,
      name: result[0].name,
      username: result[0].username,
      id_user_type: result[0].id_user_type,
      id_user_father: result[0].id_user_father,
      id_user_login: result[0].id_user_login,
      id_profile: result[0].id_profile,
    };

    const data = {
      name: result[0].name,
      username: result[0].username,
      id_user_father: result[0].id_user_father,
      id_user_login: result[0].id_user_login,
      id_user_type: result[0].id_user_type,
      id_profile: result[0].id_profile,
    };

    const menus = [];

    result.forEach(menu => {
      menus.push({ id_menu: menu.id_menu, menu_name: menu.menu_name, icon: menu.icon, position: menu.position, type: menu.type, link: menu.link });
    });
  
    
    const id_token = await this.jwtService.sign(payload);

    const access_token = await this.jwtService.sign({
      iss: "http://www.softbite.com.br",
      aud: "nestjs-jwt-auth",
      data: payload,
      scope: 'full_access',
      jti: this.genJti(),
  });
    // return { id_token, access_token, data };
    return { id_token, access_token, data: [data, { menus }] };
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