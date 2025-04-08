import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Connection } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,    
    private mailerService: MailerService,    
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

    if (login?.id_usuario == null) {
      throw new ForbiddenException('Acesso negado');
    }

    // Generate 4 digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Store verification code with expiration
    await this.connection.query(
      `INSERT INTO tb_usuario_verificacao (id_usuario, codigo, data_criacao, data_expiracao)
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
      [login.id_usuario, verificationCode]
    );

    // Send verification code via email
    await this.mailerService.sendMail({
      to: username,
      subject: 'Código de Verificação Ativar Garantia',
      text: `Seu código de verificação é: ${verificationCode}. Este código expira em 5 minutos.`
    });

    return {
      message: 'Código de verificação enviado para seu email'
    };
  }

  async verifyCodeAndGenerateToken(code: any) {
    const [verification] = await this.connection.query(
      `SELECT * FROM tb_usuario_verificacao
       WHERE codigo = ?
       AND data_expiracao > NOW()
       ORDER BY data_criacao DESC
       LIMIT 1`,
      [code]
    );

    if (!verification) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    const [user] = await this.connection.query(
      `SELECT * FROM tb_usuario
       WHERE id_usuario = ?`,
      [verification.id_usuario]
    );

    const payload = {
      id_usuario: verification.id_usuario,
      username: user.email,
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

    // Delete used verification code
    await this.connection.query(
      `DELETE FROM tb_usuario_verificacao
       WHERE codigo = ?`,
      [code]
    );

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