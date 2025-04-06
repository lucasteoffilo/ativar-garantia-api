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
            nome_cliente, numero_whatsapp, estado, cidade, data_registro, id_produto, flg_consentimento_lgpd, flg_consentimento_marketing
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
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
      data.cidade,
      data.id_produto,
      data.consentimento_lgpd,
      data.consentimento_marketing
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
          SELECT tf.*, tu.nome as empresa, tp.nome as produto 
          FROM tb_formulario_garantia tf
          JOIN tb_usuario tu on tu.id_usuario = tf.id_usuario
          LEFT JOIN tb_produto tp on tp.id_produto = tf.id_produto
          ORDER BY tf.data_registro DESC
        `;
        
        const results = await this.connection.query(query, [userId]);
        return results;        
      } else {
        const query = `
          SELECT tf.*, tu.nome as empresa, tp.nome as produto 
          FROM tb_formulario_garantia tf
          JOIN tb_usuario tu on tu.id_usuario = tf.id_usuario
          LEFT JOIN tb_produto tp on tp.id_produto = tf.id_produto
          WHERE tf.id_usuario = ?
          ORDER BY tf.data_registro DESC
        `;
        
        const results = await this.connection.query(query, [userId]);
        
        return results;
      }
    } catch (error) {
      console.error("Erro ao buscar formulários:", error);
      throw new Error("Erro ao buscar formulários de garantia");
    }
  }

  async updateMetric(data) {
    try {
      // Verifica se já existe um registro para essa métrica
      const [usuario] = await this.connection.query(
        `SELECT id_usuario FROM tb_usuario WHERE ulid_usuario = ?`,
        [data.usuario]
      );
      const [existingMetric] = await this.connection.query(
        `SELECT id_formulario_garantia_metrics, valor 
         FROM tb_formulario_garantia_metrics 
         WHERE id_usuario = ? AND id_produto = ? AND metrica = ?`,
        [usuario.id_usuario, data.id_produto, data.metrica]
      );

      if (existingMetric) {
        // Se existir, faz o update incrementando o valor
        await this.connection.query(
          `UPDATE tb_formulario_garantia_metrics 
           SET valor = valor + 1 
           WHERE id_formulario_garantia_metrics = ?`,
          [existingMetric.id_formulario_garantia_metrics]
        );
      } else {
        // Se não existir, cria um novo registro com valor 1
        await this.connection.query(
          `INSERT INTO tb_formulario_garantia_metrics 
           (id_usuario, id_produto, metrica, valor) 
           VALUES (?, ?, ?, 1)`,
          [usuario.id_usuario, data.id_produto, data.metrica]
        );
      }
      
      return { success: true, message: "Métrica atualizada com sucesso!" };
    } catch (error) {
      console.error("Erro ao atualizar métrica:", error);
      throw new Error("Erro ao atualizar métrica de garantia");
    }
  }

}
