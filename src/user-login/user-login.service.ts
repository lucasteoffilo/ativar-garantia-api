import { Injectable } from '@nestjs/common';
import { CreateUserLoginDto } from './dto/create-user-login.dto';
import { UpdateUserLoginDto } from './dto/update-user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginEntity } from './entities/user-login.entity';
import { Connection, Not, Repository } from 'typeorm';

@Injectable()
export class UserLoginService {
  constructor(
    @InjectRepository(UserLoginEntity)
    private repository: Repository<UserLoginEntity>,
    private connection: Connection
  ) { }

  async get(id) {
    try {
      // var pIdUserFather = req.user.data.id_user_father;
      const sql = `select tul.id_user_login, tul.id_user, tul.username, tul.email, tul.dt_last_login, tul.flg_update_password, tul.flg_status, tulp.id_profile
      from tb_user_login tul
      join tb_user_login_profile tulp
      on tul.id_user_login = tulp.id_user_login
      where tul.id_user = ?`;
         
      const values = [Number(id)];
      
      return await this.connection.query(sql, values);

      // return await this.repository.find({
      //   where: {
      //     id_user: id
      //   },
      //   select: ["id_user_login", "id_user", "username", "email", "dt_last_login", "flg_update_password", "flg_status"] 
      // });

    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getOne(req, id) {
    try {

      const sql = `select tul.id_user_login, tul.id_user, tul.username, tul.email, tul.dt_last_login, tul.flg_update_password, tul.flg_status, tulp.id_profile
      from tb_user_login tul
      join tb_user_login_profile tulp
      on tul.id_user_login = tulp.id_user_login
      where tul.id_user_login = ?`;
         
      const values = [Number(id)];
      
      return await this.connection.query(sql, values);

      // return await this.repository.findOne({
      //   where: {
      //     id_user_login: id,
      //     // id_user: pIdUserFather
      //   },
      //   select: ["id_user_login", "id_user", "username", "email", "dt_last_login", "flg_update_password", "flg_status"] 
      // });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async create(req, createUserLoginDto) {
    try {
      // var pIdUserFather = req.user.data.id_user_father;
      const usernameExist = await this.repository.findOne({
        where: {
          username: createUserLoginDto.username,
        },
        select: ["id_user_login", "id_user", "username", "email", "dt_last_login", "flg_update_password", "flg_status"] 
      });

      if (usernameExist == null) {
        var {
          id_user_login,
          username,
          password,
          email,
          dt_last_login,
          flg_update_password,
        } = createUserLoginDto;

        const data = this.repository.create({
          id_user_login,
          id_user: createUserLoginDto.id_user,
          username,
          password,
          email,
          dt_last_login,
          flg_update_password,
        });

        const result = await this.repository.save(data);
        
        const sql = 'INSERT INTO tb_user_login_profile (id_user_login, id_profile, flg_status) VALUES (?, ?, ?)';
        const values = [result.id_user_login, createUserLoginDto.id_profile, 1];
        await this.connection.query(sql, values);
        
        return result;
      } else {
        return null
      }
      

    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível salvar as informações.');
    }
  }

  async update(req, updateUserLoginDto, id) {
    try {
       const usernameExist = await this.repository.findOne({
         where: {
           username: updateUserLoginDto.username,
           id_user_login: Not(id)
         },
         select: ["id_user_login", "id_user", "username", "email", "dt_last_login", "flg_update_password", "flg_status"] 
       });
       
       if (usernameExist == null) {
        const sql = `UPDATE r2db.tb_user_login_profile SET id_profile=? WHERE id_user_login=?`
        const values = [Number(updateUserLoginDto.id_profile),Number(id)];
        await this.connection.query(sql, values);

        const result = await this.repository.update(
          {
            id_user_login: Number(id),
            // id_user: pIdUserFather
          },
          {
            username: updateUserLoginDto.username,
            password: updateUserLoginDto.password,
            email: updateUserLoginDto.email,
            flg_update_password: updateUserLoginDto.flg_update_password,
            id_login_update: null,
            dt_update: new Date()
          },
        );
         
        return result;
       } else {
         return null
       }
       
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível salvar as informações.');
    }
  }
}