import { Injectable } from '@nestjs/common';
import { CreateFormularioGarantiaDto } from './dto/create-formulario-garantia.dto';
import { UpdateFormularioGarantiaDto } from './dto/update-formulario-garantia.dto';
import { Connection } from 'typeorm';

@Injectable()
export class FormularioGarantiaService {

  constructor(
    private connection: Connection,
  ) { }

  async create(data) {

    const [user] = await this.connection.query(
      `SELECT id_usuario FROM tb_usuario 
       WHERE ulid_usuario = ?`,
      [data.usuario]
    );

    const query = `
        INSERT INTO tb_formulario_garantia (
            id_usuario, local_compra, numero_nota_fiscal, data_nota_fiscal, preco_unitario, emitente, 
            nome_cliente, numero_whatsapp, estado, cidade, data_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      user.id_usuario,
      data.local_compra,
      data.numero_nota_fiscal,
      data.data_nota_fiscal,
      data.preco_unitario,
      data.emitente,
      data.nome_cliente || null,
      data.numero_whatsapp || null,
      data.estado,
      data.cidade
    ];

    try {
      const result = await this.connection.query(query, values);
      
      // Verifica se o resultado contém insertId
      const insertId = result?.insertId || result?.[0]?.insertId;
      
      if (!insertId) {
        throw new Error('Não foi possível obter o ID do registro inserido');
      }
      
      return { id: insertId, message: "Registro inserido com sucesso!" };
    } catch (error) {
      console.error("Erro ao inserir no banco:", error);
      throw new Error("Erro ao inserir no banco de dados");
    }

  }

  async findByUserId(userId: number, user) {
    try {
      
      if (user.id_tipo_usuario == "1") {
        const query = `
          SELECT * FROM tb_formulario_garantia
          ORDER BY data_registro DESC
        `;
        
        const results = await this.connection.query(query, [userId]);
        return results;        
      } else {
        const query = `
          SELECT * FROM tb_formulario_garantia
          WHERE id_usuario = ?
          ORDER BY data_registro DESC
        `;
        
        const results = await this.connection.query(query, [userId]);
        
        return results;
      }
    } catch (error) {
      console.error("Erro ao buscar formulários:", error);
      throw new Error("Erro ao buscar formulários de garantia");
    }
  }

}
