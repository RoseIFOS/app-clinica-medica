const express = require('express');
const { initializeWhatsApp, isWhatsAppReady, setQRCallback } = require('./config/whatsapp');
const { setupCronJobs } = require('./scheduler/cron');
const routes = require('./routes');
const { router: qrRouter, setQRCode } = require('./routes/qr');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rotas
app.use('/api', routes);
app.use('/', qrRouter);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    service: 'WhatsApp Reminder Service',
    version: '1.0.0',
    status: 'running',
    whatsapp: isWhatsAppReady() ? 'connected' : 'disconnected'
  });
});

// Inicialização
async function start() {
  console.log('================================');
  console.log('  WhatsApp Reminder Service');
  console.log('================================\n');

  try {
    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}\n`);
    });

    // Configurar callback do QR Code
    setQRCallback(setQRCode);
    
    // Inicializar WhatsApp
    initializeWhatsApp();

    // Aguardar WhatsApp estar pronto antes de configurar cron jobs
    console.log('⏳ Aguardando WhatsApp ficar pronto...\n');
    
    // Configurar cron jobs após 30 segundos (tempo para WhatsApp conectar)
    setTimeout(() => {
      if (isWhatsAppReady()) {
        console.log('\n✅ WhatsApp pronto! Configurando agendador...\n');
        setupCronJobs();
      } else {
        console.log('\n⚠️  WhatsApp ainda não conectado. Agendador configurado, mas lembretes não serão enviados até conexão.\n');
        setupCronJobs();
      }
    }, 30000);

  } catch (error) {
    console.error('❌ Erro ao iniciar serviço:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('SIGINT', () => {
  console.log('\n👋 Encerrando serviço...');
  process.exit(0);
});

// Iniciar aplicação
start();

