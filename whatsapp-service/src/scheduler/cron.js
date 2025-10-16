const cron = require('node-cron');
const { enviarLembretes } = require('../services/reminder.service');
const { isWhatsAppReady } = require('../config/whatsapp');
require('dotenv').config();

/**
 * Configurar tarefas agendadas
 */
function setupCronJobs() {
  // Obter schedule do .env ou usar padrão (10:00 AM todos os dias)
  const schedule = process.env.REMINDER_CRON_SCHEDULE || '0 10 * * *';

  console.log(`⏰ Agendador configurado: ${schedule}`);

  // Tarefa: Enviar lembretes diários
  cron.schedule(schedule, async () => {
    console.log(`\n🔔 [${new Date().toISOString()}] Executando tarefa de lembretes...`);

    if (!isWhatsAppReady()) {
      console.log('⚠️  WhatsApp não está conectado. Pulando envio de lembretes.');
      return;
    }

    try {
      await enviarLembretes();
      console.log('✅ Tarefa de lembretes concluída\n');
    } catch (error) {
      console.error('❌ Erro na tarefa de lembretes:', error);
    }
  });

  // Tarefa: Verificar status do WhatsApp a cada 5 minutos
  cron.schedule('*/5 * * * *', () => {
    const status = isWhatsAppReady() ? '✅ Conectado' : '❌ Desconectado';
    console.log(`[${new Date().toISOString()}] Status WhatsApp: ${status}`);
  });

  console.log('✅ Tarefas agendadas configuradas');
}

module.exports = { setupCronJobs };

