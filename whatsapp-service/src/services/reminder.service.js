const pool = require('../config/database');
const { sendMessage } = require('../config/whatsapp');
const { generatePersonalizedMessage } = require('./openai.service');

/**
 * Buscar consultas que precisam de lembrete
 * (consultas agendadas para as próximas 24 horas)
 */
async function getConsultasParaLembrete() {
  const query = `
    SELECT 
      c.id as consulta_id,
      c.data_hora,
      c.tipo,
      c.status,
      p.nome as paciente_nome,
      p.whatsapp as paciente_whatsapp,
      u.nome as medico_nome
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN users u ON c.medico_id = u.id
    WHERE 
      c.status = 'agendada'
      AND c.data_hora >= NOW()
      AND c.data_hora <= NOW() + INTERVAL '24 hours'
      AND p.whatsapp IS NOT NULL
      AND p.whatsapp != ''
      AND NOT EXISTS (
        SELECT 1 FROM lembretes_whatsapp lw
        WHERE lw.consulta_id = c.id
        AND lw.status IN ('enviado', 'pendente')
        AND lw.data_envio_programada >= NOW() - INTERVAL '48 hours'
      )
    ORDER BY c.data_hora ASC
  `;

  try {
    const result = await pool.query(query);
    console.log(`📋 Encontradas ${result.rows.length} consultas para enviar lembrete`);
    return result.rows;
  } catch (error) {
    console.error('❌ Erro ao buscar consultas:', error);
    throw error;
  }
}

/**
 * Enviar lembretes para todas as consultas pendentes
 */
async function enviarLembretes() {
  console.log('🔄 Iniciando envio de lembretes...');

  try {
    const consultas = await getConsultasParaLembrete();

    if (consultas.length === 0) {
      console.log('✅ Nenhuma consulta pendente de lembrete');
      return { total: 0, enviados: 0, erros: 0 };
    }

    let enviados = 0;
    let erros = 0;

    for (const consulta of consultas) {
      try {
        await enviarLembrete(consulta);
        enviados++;
        
        // Aguardar 2 segundos entre mensagens para evitar bloqueio
        await sleep(2000);
      } catch (error) {
        console.error(`❌ Erro ao enviar lembrete para consulta ${consulta.consulta_id}:`, error);
        erros++;
      }
    }

    console.log(`✅ Lembretes enviados: ${enviados}/${consultas.length} (${erros} erros)`);
    
    return {
      total: consultas.length,
      enviados,
      erros
    };
  } catch (error) {
    console.error('❌ Erro ao processar lembretes:', error);
    throw error;
  }
}

/**
 * Enviar lembrete individual
 */
async function enviarLembrete(consulta) {
  const client = await pool.connect();

  try {
    // Registrar lembrete como pendente
    const insertQuery = `
      INSERT INTO lembretes_whatsapp (
        paciente_id, 
        consulta_id, 
        mensagem, 
        data_envio_programada, 
        status, 
        tentativas
      )
      SELECT 
        c.paciente_id,
        c.id,
        $1,
        NOW(),
        'pendente',
        1
      FROM consultas c
      WHERE c.id = $2
      RETURNING id
    `;

    // Gerar mensagem personalizada
    const mensagem = await generatePersonalizedMessage(consulta);

    const result = await client.query(insertQuery, [mensagem, consulta.consulta_id]);
    const lembreteId = result.rows[0].id;

    console.log(`📤 Enviando lembrete ${lembreteId} para ${consulta.paciente_nome} (${consulta.paciente_whatsapp})`);

    // Enviar via WhatsApp
    await sendMessage(consulta.paciente_whatsapp, mensagem);

    // Atualizar status para enviado
    await client.query(
      `UPDATE lembretes_whatsapp 
       SET status = 'enviado', data_enviado = NOW() 
       WHERE id = $1`,
      [lembreteId]
    );

    console.log(`✅ Lembrete ${lembreteId} enviado com sucesso`);
  } catch (error) {
    // Marcar como falhou
    await client.query(
      `UPDATE lembretes_whatsapp 
       SET status = 'falhou' 
       WHERE consulta_id = $1 AND status = 'pendente'`,
      [consulta.consulta_id]
    );
    
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Reenviar lembrete
 */
async function reenviarLembrete(lembreteId) {
  const client = await pool.connect();

  try {
    // Buscar lembrete
    const result = await client.query(
      `SELECT 
        lw.id,
        lw.mensagem,
        lw.tentativas,
        c.id as consulta_id,
        p.nome as paciente_nome,
        p.whatsapp as paciente_whatsapp
       FROM lembretes_whatsapp lw
       INNER JOIN consultas c ON lw.consulta_id = c.id
       INNER JOIN pacientes p ON c.paciente_id = p.id
       WHERE lw.id = $1`,
      [lembreteId]
    );

    if (result.rows.length === 0) {
      throw new Error('Lembrete não encontrado');
    }

    const lembrete = result.rows[0];

    // Reenviar
    await sendMessage(lembrete.paciente_whatsapp, lembrete.mensagem);

    // Atualizar status
    await client.query(
      `UPDATE lembretes_whatsapp 
       SET 
         status = 'enviado',
         data_enviado = NOW(),
         tentativas = tentativas + 1
       WHERE id = $1`,
      [lembreteId]
    );

    console.log(`✅ Lembrete ${lembreteId} reenviado com sucesso`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao reenviar lembrete ${lembreteId}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getConsultasParaLembrete,
  enviarLembretes,
  enviarLembrete,
  reenviarLembrete
};

