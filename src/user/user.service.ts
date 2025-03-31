import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Request, Response } from 'express'
import { Connection, ILike, Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import { UserServiceEntity } from './entities/user-service.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(UserServiceEntity)
    private repositoryService: Repository<UserServiceEntity>,
    private connection: Connection
  ) { }

  async findUsersByType(userType: number, query: any): Promise<UserEntity[]> {
    const { cpf, nome, nomeFantasia, cnpj, inscricaoMunicipal } = query;

    let whereClause: any = {
      id_user_type: userType,
      flg_status: 1, // Considerando que 1 significa ativo
    };

    if (cpf) whereClause.cpf_cnpj = cpf;
    if (nome) whereClause.name = ILike(`%${nome}%`);
    if (nomeFantasia) whereClause.name_fantasy = ILike(`%${nomeFantasia}%`);
    if (cnpj) whereClause.cpf_cnpj = cnpj; // Caso também seja usado para CNPJ
    if (inscricaoMunicipal) whereClause.municipal_registration = inscricaoMunicipal;

    return await this.repository.find({
      where: whereClause,
      order: {
        id_user: 'DESC'
      }
    });
  }

  async generatePdfReport(users): Promise<Buffer> {
    
    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      return pdfData;
    });

    doc.fontSize(16).text('Relatório de Usuários', { align: 'center' });
    doc.moveDown();

    users.forEach((user, index) => {
      
      doc.fontSize(12).text(`Usuário ${index + 1}:`, { underline: true });
      doc.text(`Nome: ${user.name}`);
      doc.text(`Nome Fantasia: ${user.name_fantasy}`);
      doc.text(`CPF/CNPJ: ${user.cpf_cnpj}`);
      doc.text(`Inscrição Municipal: ${user.municipal_registration}`);
      
      // Verifica se o usuário tem um ou mais endereços
      if (user.endereco && user.endereco.length > 0) {
        user.endereco.forEach((endereco, enderecoIndex) => {
          doc.text(`Endereço ${enderecoIndex + 1}:`);
          doc.text(`Rua: ${endereco.street}`);
          doc.text(`Número: ${endereco.number}`);
          doc.text(`Bairro: ${endereco.district}`);
          doc.text(`Cidade: ${endereco.city}`);
          doc.text(`Estado: ${endereco.state}`);
        });
      } else {
        doc.text(`Endereço: Não disponível`);
      }
      
      doc.text(''); // Espaço entre os usuários
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);
    });
  }

  async generateExcelReport(users): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Usuários');
    
    worksheet.columns = [
      { header: 'Nome', key: 'name', width: 30 },
      { header: 'Nome Fantasia', key: 'name_fantasy', width: 30 },
      { header: 'CPF/CNPJ', key: 'cpf_cnpj', width: 20 },
      { header: 'Inscrição Municipal', key: 'municipal_registration', width: 30 },
      { header: 'Rua', key: 'street', width: 30 },
      { header: 'Número', key: 'number', width: 10 },
      { header: 'Bairro', key: 'district', width: 30 },
      { header: 'Cidade', key: 'city', width: 30 },
      { header: 'Estado', key: 'state', width: 10 },
    ];
  
    users.forEach(user => {
      const address = user.endereco?.[0] || {};
      
      worksheet.addRow({
        name: user.name,
        name_fantasy: user.name_fantasy,
        cpf_cnpj: user.cpf_cnpj,
        municipal_registration: user.municipal_registration,
        street: address.street || '',
        number: address.number || '',
        district: address.district || '',
        city: address.city || '',
        state: address.state || '',
      });
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer); // Convertendo para Buffer
  }
  

  async get() {
    try {
      return await this.repository.find({
        order: {
          id_user: 'DESC'
        }
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getOne(id) {
    try {
      return await this.repository.findOne({
        where: {
          id_user: id,
        },
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async create(req, createUserDto) {
    try {
      var pIdUser = req.user.data.id_user;

      var {
        id_user,
        id_user_type,
        id_type_contract,
        name,
        name_fantasy,
        flg_business,
        cpf_cnpj,
        municipal_registration,
        estadual_registration,
        identity,
        identity_expeditor,
        identity_date_expeditor,
        gender,
        date_birth,
        nationality,
        flg_status,
      } = createUserDto;

      const data = this.repository.create({
        id_user,
        id_user_type,
        id_type_contract,
        name,
        name_fantasy,
        flg_business,
        cpf_cnpj,
        municipal_registration,
        estadual_registration,
        identity,
        identity_expeditor,
        identity_date_expeditor,
        gender,
        date_birth,
        nationality,
        flg_status,
      });

      const result = await this.repository.save(data);

      let sql;
      let values;

      sql = 'INSERT INTO tb_user_family (id_user_son, id_user_father) VALUES (?, ?)';
      values = [result.id_user, pIdUser];
      await this.connection.query(sql, values);

      const vehicleTypes = [
        { name: 'CARRO', description: 'CARRO' },
        { name: 'MOTO', description: 'MOTO' },
        { name: 'CAMINHÃO', description: 'CAMINHÃO' },
        { name: 'ÔNIBUS', description: 'ÔNIBUS' },
        { name: 'BICICLETA', description: 'BICICLETA' },
      ];

      for (const vehicle of vehicleTypes) {
        const sql = `INSERT INTO r2db.tb_type_vehicle
        (id_user, name_vehicle, description, flg_status, id_insert_login)
        VALUES (?, ?, ?, 1, 1);`;

        const values = [result.id_user, vehicle.name, vehicle.description];
        await this.connection.query(sql, values);
      }

      const colorTypes = [
        { name: 'PRETO', description: 'PRETO' },
        { name: 'BRANCO', description: 'BRANCO' },
        { name: 'PRATA', description: 'PRATA' },
        { name: 'CINZA', description: 'CINZA' },
        { name: 'VERMELHO', description: 'VERMELHO' },
        { name: 'AZUL', description: 'AZUL' },
        { name: 'VERDE', description: 'VERDE' },
        { name: 'MARROM', description: 'MARROM' },
        { name: 'AMARELO', description: 'AMARELO' },
        { name: 'LARANJA', description: 'LARANJA' },
        { name: 'DOURADO', description: 'DOURADO' },
        { name: 'BEGE', description: 'BEGE' },
        { name: 'ROSA', description: 'ROSA' },
        { name: 'GELO', description: 'GELO' },
        { name: 'BRONZE', description: 'BRONZE' }
      ];

      for (const color of colorTypes) {
        const sql = `INSERT INTO r2db.tb_type_vehicle_color
        (id_user, color_vehicle, description, flg_status, id_insert_login)
        VALUES (?, ?, ?, 1, 1);`;

        const values = [result.id_user, color.name, color.description];
        await this.connection.query(sql, values);
      }

      const statusTypes = [
        { name: 'ATIVO', description: 'ATIVO' },
        { name: 'INATIVO', description: 'INATIVO' },
        { name: 'CANCELADO', description: 'CANCELADO' },
      ];

      for (const s of statusTypes) {
        const sql = `INSERT INTO r2db.tb_type_vehicle_status
        (id_user, status_vehicle, description, flg_status, id_insert_login)
        VALUES (?, ?, ?, 1, 1);`;

        const values = [result.id_user, s.name, s.description];
        await this.connection.query(sql, values);
      }
      return result
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível salvar as informações.');
    }
  }

  async getOneCustomer(id) {
    try {
      return await this.repository.findOne({
        where: {
          // id_user: id_father,
          id_user_type: 2
        },
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getBidder() {
    try {
      return await this.repository.find({
        where: {
          id_user_type: 3,
        },
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getOneBidder(id) {
    try {
      return await this.repository.findOne({
        where: {
          id_user: id,
          id_user_type: 3
        },
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getMechanic(req) {
    let vQuery = `
            SELECT 
        tu.name, 
        tu.id_user, 
        tu.id_user_type, 
        tu.cpf_cnpj, 
        tu.name_fantasy, 
        tu.municipal_registration, 
        tu.dt_insert, 
        tu.flg_status, 
        MAX(tua.street) AS street, 
        MAX(tua.place) AS place,
        MAX(tua.number) AS number, 
        MAX(tua.complement) AS complement, 
        MAX(tua.district) AS district, 
        MAX(tua.city) AS city, 
        MAX(tua.state) AS state, 
        MAX(tua.lat) AS lat, 
        MAX(tua.lon) AS lon
      FROM tb_user tu
      LEFT JOIN tb_user_address tua ON tua.id_user = tu.id_user
      JOIN tb_user_family tuf ON tuf.id_user_son = tu.id_user AND tu.id_user_type = 4
      GROUP BY tu.id_user;
      `;
    try {
      const result = await this.connection.query(vQuery).then(function (result) {
        return result;
      }).catch(function (err) {
        console.log('error: ', err);
        return { errno: err.errno, message: err.message, sqlState: err.sqlState };
      });
      return result;
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getCustomer(req) {
    let vQuery = `
        SELECT tua.district, tua.city, tua.state, tu.*
        FROM tb_user tu
          JOIN tb_user_family tuf
              ON tuf.id_user_son = tu.id_user
          LEFT JOIN tb_user_address tua
              ON tua.id_user = tu.id_user
          WHERE tuf.id_user_father = ?
          AND tu.id_user_type = 3 ORDER BY id_user DESC;`;
    try {
      const result = await this.connection.query(vQuery, [req.user.data.id_user]).then(function (result) {
        return result;
      }).catch(function (err) {
        console.log('error: ', err);
        return { errno: err.errno, message: err.message, sqlState: err.sqlState };
      });
      return result;
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getOneMechanic(id) {
    try {
      return await this.repository.findOne({
        where: {
          id_user: id,
          id_user_type: 4
        },
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async getSearchUser(req, id_user, id_user_type) {
    try {
      const pIdUserFather = req.user.data.id_user_father;
      const pIdUserSon = id_user.id_user
      const pIdUserType = id_user_type.id_user_type;

      return await this.connection.query("CALL sp_Sel_SearchUser(?, ?, ?);",
        [pIdUserType, pIdUserSon, pIdUserFather])
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados.');
    }
  }

  async update(req, createUserDto, id) {
    try {
      return await this.repository.update(
        {
          id_user: id,
        },
        {
          id_user_type: createUserDto.id_user_type,
          id_type_contract: createUserDto.id_type_contract,
          name: createUserDto.name,
          name_fantasy: createUserDto.name_fantasy,
          flg_business: createUserDto.flg_business,
          cpf_cnpj: createUserDto.cpf_cnpj,
          municipal_registration: createUserDto.municipal_registration,
          estadual_registration: createUserDto.estadual_registration,
          identity: createUserDto.identity,
          identity_expeditor: createUserDto.identity_expeditor,
          identity_date_expeditor: createUserDto.identity_date_expeditor,
          gender: createUserDto.gender,
          date_birth: createUserDto.date_birth,
          nationality: createUserDto.nationality,
          flg_status: createUserDto.flg_status,
        },
      );
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível salvar as informações.');
    }
  }

  async patch(req, data: { ids: string[] }) {
    try {
      const pIdUser = req.user.data.id_user;

      const result = await this.repository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ flg_deleted: 1, id_login_update: pIdUser, dt_update: new Date() })
        .whereInIds(data.ids)
        .execute();
      return result;
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível atualizar as informações.');
    }
  }

  async createService(data: any) {
    try {
      const { id_user, id_type_order_service } = data;

      // Delete all records in the repository where id_user is equal to the id_user that is coming
      await this.repositoryService.delete({ id_user });

      // Percorre o array id_type_order_service e cria um registro para cada item
      const promises = id_type_order_service.map(async (id_type) => {
        console.log(id_type);

        const userService = this.repositoryService.create({
          id_user,
          id_type_order_service: id_type,
          flg_status: 1,
          flg_deleted: 0,
        });

        return await this.repositoryService.save(userService); // Salva o registro na tabela
      });

      return await Promise.all(promises); // Aguarda todos os registros serem salvos
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Não foi possível salvar as informações.');
    }
  }

  async getService(id) {
    try {
      return await this.repositoryService.find({
        where: {
          id_user: id,
        },
      });
    } catch (error) {
      console.error('Erro TypeORM:', error);
      throw new Error('Não foi possível listar os dados do serviço.');
    }
  }

  async findUsersByIds(ids: number[]): Promise<UserEntity[]> {
    try {
      const users = await this.repository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.endereco',
          'address',
          'address.id_user = (' +
            'SELECT address_sub.id_user FROM tb_user_address address_sub ' +
            'WHERE address_sub.id_user = user.id_user ' +
            'ORDER BY address_sub.id_user DESC LIMIT 1' +
          ')'
        )
        .whereInIds(ids)
        .orderBy('user.id_user', 'DESC')
        .getMany();
  
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários por IDs:', error);
      throw new Error('Não foi possível buscar os usuários.');
    }
  }
}
