import { Injectable } from '@nestjs/common';
import { CreateEstatisticaDto } from './dto/create-estatistica.dto';
import { UpdateEstatisticaDto } from './dto/update-estatistica.dto';
import { Connection } from 'typeorm';

@Injectable()
export class EstatisticaService {
  constructor(
    private connection: Connection,
  ) { }
  
  async getMetricsByUser(user: any) {
    try {
      const query = user.id_tipo_usuario != '1' ? 
        `SELECT
          tf.id_usuario,
          tf.id_produto,
          tu.nome AS empresa,
          tp.nome AS produto,
          MAX(CASE WHEN tf.metrica = 'visualizacao' THEN tf.valor END) AS visualizacoes,
          MAX(CASE WHEN tf.metrica = 'formulario-enviado' THEN tf.valor END) AS envios,
          MAX(CASE WHEN tf.metrica = 'saida-sem-preencher' THEN tf.valor END) AS saidas
         FROM tb_formulario_garantia_metrics tf
         JOIN tb_produto tp ON tp.id_produto = tf.id_produto
         JOIN tb_usuario tu ON tu.id_usuario = tf.id_usuario
         WHERE tf.id_usuario = ?
         GROUP BY tf.id_usuario, tf.id_produto, tu.nome, tp.nome
         ORDER BY tf.id_usuario, tf.id_produto` :
        `SELECT
          tf.id_usuario,
          tf.id_produto,
          tu.nome AS empresa,
          tp.nome AS produto,
          MAX(CASE WHEN tf.metrica = 'visualizacao' THEN tf.valor END) AS visualizacoes,
          MAX(CASE WHEN tf.metrica = 'formulario-enviado' THEN tf.valor END) AS envios,
          MAX(CASE WHEN tf.metrica = 'saida-sem-preencher' THEN tf.valor END) AS saidas
         FROM tb_formulario_garantia_metrics tf
         JOIN tb_produto tp ON tp.id_produto = tf.id_produto
         JOIN tb_usuario tu ON tu.id_usuario = tf.id_usuario
         GROUP BY tf.id_usuario, tf.id_produto, tu.nome, tp.nome
         ORDER BY tf.id_usuario, tf.id_produto`;

      const results = await this.connection.query(query, user.id_tipo_usuario != '1' ? [user.id_usuario] : []);
      return results;
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      throw new Error("Erro ao buscar métricas de garantia");
    }
  }
}
