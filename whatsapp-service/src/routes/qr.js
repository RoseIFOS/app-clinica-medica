const express = require('express');
const { getClient } = require('../config/whatsapp');

const router = express.Router();

let currentQR = null;

// Armazenar o QR code quando for gerado
function setQRCode(qr) {
  currentQR = qr;
}

/**
 * Endpoint para ver o QR Code no navegador
 */
router.get('/qr', (req, res) => {
  if (!currentQR) {
    return res.send(`
      <html>
        <head>
          <title>WhatsApp QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f0f0f0;
            }
            .container {
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #25D366; }
            p { color: #666; }
            .refresh {
              margin-top: 20px;
              padding: 10px 20px;
              background: #25D366;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
            .refresh:hover { background: #128C7E; }
          </style>
          <meta http-equiv="refresh" content="3">
        </head>
        <body>
          <div class="container">
            <h1>⏳ Aguardando QR Code...</h1>
            <p>O WhatsApp está se conectando. Aguarde alguns segundos.</p>
            <p><small>Esta página atualiza automaticamente a cada 3 segundos</small></p>
            <button class="refresh" onclick="location.reload()">Atualizar Agora</button>
          </div>
        </body>
      </html>
    `);
  }

  // Renderizar QR Code como imagem SVG
  const QRCode = require('qrcode');
  
  res.type('html');
  
  QRCode.toString(currentQR, { type: 'svg', width: 400 }, (err, svg) => {
    if (err) {
      return res.send(`
        <html>
          <head><title>Erro</title></head>
          <body>
            <h1>Erro ao gerar QR Code</h1>
            <p>${err.message}</p>
          </body>
        </html>
      `);
    }

    res.send(`
      <html>
        <head>
          <title>WhatsApp QR Code - Escaneie Aqui</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            }
            .container {
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              max-width: 500px;
            }
            h1 {
              color: #25D366;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              margin-bottom: 30px;
            }
            .qr-container {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 10px;
              display: inline-block;
              margin: 20px 0;
            }
            .instructions {
              text-align: left;
              background: #f0f0f0;
              padding: 20px;
              border-radius: 10px;
              margin-top: 20px;
            }
            .instructions h3 {
              color: #128C7E;
              margin-top: 0;
            }
            .instructions ol {
              padding-left: 20px;
            }
            .instructions li {
              margin: 10px 0;
              color: #333;
            }
            .status {
              margin-top: 20px;
              padding: 10px;
              background: #fffacd;
              border-radius: 5px;
              font-size: 14px;
            }
            .refresh {
              margin-top: 20px;
              padding: 10px 20px;
              background: #25D366;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
            .refresh:hover { background: #128C7E; }
          </style>
          <meta http-equiv="refresh" content="30">
        </head>
        <body>
          <div class="container">
            <h1>📱 WhatsApp QR Code</h1>
            <p class="subtitle">Escaneie este código com seu WhatsApp</p>
            
            <div class="qr-container">
              ${svg}
            </div>

            <div class="instructions">
              <h3>Como conectar:</h3>
              <ol>
                <li>Abra o <strong>WhatsApp</strong> no seu celular</li>
                <li>Vá em <strong>Configurações</strong> (⚙️)</li>
                <li>Toque em <strong>Aparelhos conectados</strong></li>
                <li>Clique em <strong>Conectar aparelho</strong></li>
                <li><strong>Escaneie este QR Code</strong> com a câmera do celular</li>
              </ol>
            </div>

            <div class="status">
              ⏰ Esta página atualiza automaticamente a cada 30 segundos<br>
              Se o código expirar, aguarde a atualização
            </div>

            <button class="refresh" onclick="location.reload()">
              🔄 Atualizar QR Code
            </button>
          </div>
        </body>
      </html>
    `);
  });
});

module.exports = { router, setQRCode };

