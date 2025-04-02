import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { UserServiceEntity } from './entities/user-service.entity';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(UserServiceEntity)
    private repositoryService: Repository<UserServiceEntity>,
    private connection: Connection
  ) { }


  async get(req) {
    if (req.user.data.id_tipo_usuario == '1') {
      try {
        const query = `
        SELECT 
          id_usuario, 
          ulid_usuario, 
          id_tipo_usuario, 
          nome, 
          cpf_cnpj, 
          flg_status, 
          flg_deleted, 
          dt_insert, 
          dt_update 
        FROM tb_usuario 
        WHERE id_tipo_usuario = 2
        ORDER BY id_usuario DESC
      `;
        return await this.connection.query(query);
      } catch (error) {
        console.error('Erro TypeORM:', error);
        throw new Error('Não foi possível listar os dados.');
      }
    }
  }

  async getOne(id: number) {
    try {
      const query = `
        SELECT 
          id_usuario, 
          ulid_usuario, 
          id_tipo_usuario, 
          nome, 
          email,
          cpf_cnpj, 
          flg_status, 
          flg_deleted, 
          dt_insert, 
          dt_update 
        FROM tb_usuario 
        WHERE id_usuario = ?
        ORDER BY id_usuario DESC
        LIMIT 1
      `;
      const [result] = await this.connection.query(query, [id]);
      return result;
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível buscar o usuário');
    }
  }

  async create(req: Request, usuario: any) {
    const query = `
      INSERT INTO usuarios 
      (nome, email, cpf_cnpj, senha, flg_status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      usuario.nome,
      usuario.email,
      usuario.cpf_cnpj,
      usuario.senha,
      usuario.flg_status
    ];
    const [result] = await this.connection.query(query, values);
    return result;
  }

  async update(id: number, usuario: any) {
    try {
      if (usuario.senha != undefined) {
        // Update with password
        const queryWithPassword = `
          UPDATE tb_usuario 
          SET nome = ?, email = ?, cpf_cnpj = ?, senha = ?, flg_status = ?
          WHERE id_usuario = ?
        `;
        const valuesWithPassword = [
          usuario.nome,
          usuario.email,
          usuario.cpf_cnpj,
          usuario.senha,
          usuario.flg_status,
          id
        ];
        
        const resultWithPassword = await this.connection.query(queryWithPassword, valuesWithPassword);
        return resultWithPassword;
      } else {
        // Update without password
        const queryWithoutPassword = `
          UPDATE tb_usuario 
          SET nome = ?, email = ?, cpf_cnpj = ?, flg_status = ?
          WHERE id_usuario = ?
        `;
        const valuesWithoutPassword = [
          usuario.nome,
          usuario.email,
          usuario.cpf_cnpj,
          usuario.flg_status,
          id
        ];
        const resultWithoutPassword = await this.connection.query(queryWithoutPassword, valuesWithoutPassword);
        return resultWithoutPassword;
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Não foi possível atualizar o usuário');
    }
  }
}
