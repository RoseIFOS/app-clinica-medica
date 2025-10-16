const express = require('express');
const { isWhatsAppReady } = require('../config/whatsapp');
const { enviarLembretes, reenviarLembrete } = require('../services/reminder.service');

const router = express.Router();

/**
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    whatsapp: isWhatsAppReady() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

/**
 * Status do WhatsApp
 */
router.get('/whatsapp/status', (req, res) => {
  res.json({
    ready: isWhatsAppReady(),
    status: isWhatsAppReady() ? 'connected' : 'disconnected'
  });
});

/**
 * Enviar lembretes manualmente
 */
router.post('/lembretes/enviar', async (req, res) => {
  try {
    if (!isWhatsAppReady()) {
      return res.status(503).json({
        error: 'WhatsApp não está conectado'
      });
    }

    const resultado = await enviarLembretes();
    
    res.json({
      message: 'Lembretes processados',
      ...resultado
    });
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error);
    res.status(500).json({
      error: 'Erro ao enviar lembretes',
      message: error.message
    });
  }
});

/**
 * Reenviar lembrete específico
 */
router.post('/lembretes/:id/reenviar', async (req, res) => {
  try {
    if (!isWhatsAppReady()) {
      return res.status(503).json({
        error: 'WhatsApp não está conectado'
      });
    }

    const lembreteId = req.params.id;
    await reenviarLembrete(lembreteId);
    
    res.json({
      message: 'Lembrete reenviado com sucesso',
      lembreteId
    });
  } catch (error) {
    console.error('Erro ao reenviar lembrete:', error);
    res.status(500).json({
      error: 'Erro ao reenviar lembrete',
      message: error.message
    });
  }
});

module.exports = router;

