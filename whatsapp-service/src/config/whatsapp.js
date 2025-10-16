const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

let whatsappClient = null;
let isReady = false;
let qrCodeCallback = null;

/**
 * Definir callback para QR Code (usado pela rota web)
 */
function setQRCallback(callback) {
  qrCodeCallback = callback;
}

/**
 * Inicializa o cliente WhatsApp
 */
function initializeWhatsApp() {
  console.log('🔄 Inicializando WhatsApp Web...');

  whatsappClient = new Client({
    authStrategy: new LocalAuth({
      dataPath: process.env.WHATSAPP_SESSION_PATH || './sessions'
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    }
  });

  // Event: QR Code gerado
  whatsappClient.on('qr', (qr) => {
    console.log('📱 QR Code gerado!');
    console.log('🌐 Abra no navegador: http://localhost:3001/qr');
    qrcode.generate(qr, { small: true });
    
    // Notificar callback se definido
    if (qrCodeCallback) {
      qrCodeCallback(qr);
    }
  });

  // Event: Autenticado
  whatsappClient.on('authenticated', () => {
    console.log('✅ WhatsApp autenticado!');
  });

  // Event: Pronto
  whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp Web está pronto!');
    isReady = true;
  });

  // Event: Mensagem recebida
  whatsappClient.on('message', async (message) => {
    console.log(`📩 Mensagem de ${message.from}: ${message.body}`);
    
    // Processar confirmações de consulta
    if (message.body.toLowerCase() === 'sim') {
      // Lógica para confirmar presença
      await handleConfirmation(message);
    }
  });

  // Event: Desconectado
  whatsappClient.on('disconnected', (reason) => {
    console.log('❌ WhatsApp desconectado:', reason);
    isReady = false;
  });

  // Inicializar cliente
  whatsappClient.initialize();
}

/**
 * Processar confirmação de presença
 */
async function handleConfirmation(message) {
  try {
    // TODO: Implementar lógica de confirmação no banco de dados
    await message.reply('✅ Presença confirmada! Obrigado.');
  } catch (error) {
    console.error('❌ Erro ao processar confirmação:', error);
  }
}

/**
 * Enviar mensagem via WhatsApp
 */
async function sendMessage(phoneNumber, message) {
  if (!isReady) {
    throw new Error('WhatsApp não está pronto');
  }

  try {
    // Formatar número (remover caracteres especiais)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Formato: 55119999999999@c.us (Brasil)
    const chatId = `55${cleanNumber}@c.us`;
    
    // Enviar mensagem
    await whatsappClient.sendMessage(chatId, message);
    
    console.log(`✅ Mensagem enviada para ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para ${phoneNumber}:`, error);
    throw error;
  }
}

/**
 * Verificar se WhatsApp está pronto
 */
function isWhatsAppReady() {
  return isReady;
}

/**
 * Obter cliente WhatsApp
 */
function getClient() {
  return whatsappClient;
}

module.exports = {
  initializeWhatsApp,
  sendMessage,
  isWhatsAppReady,
  getClient,
  setQRCallback
};

