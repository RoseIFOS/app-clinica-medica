const OpenAI = require('openai');
require('dotenv').config();

let openai = null;

// Inicializar OpenAI se a chave estiver configurada
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('✅ OpenAI configurado');
} else {
  console.log('⚠️  OpenAI não configurado (usando mensagens template)');
}

/**
 * Gerar mensagem personalizada com IA
 */
async function generatePersonalizedMessage(consulta) {
  // Se OpenAI não estiver configurado, usar template padrão
  if (!openai) {
    return generateTemplateMessage(consulta);
  }

  try {
    const prompt = `
Gere uma mensagem curta e amigável de lembrete de consulta médica com as seguintes informações:

Paciente: ${consulta.paciente_nome}
Médico: Dr(a). ${consulta.medico_nome}
Data: ${formatDate(consulta.data_hora)}
Horário: ${formatTime(consulta.data_hora)}
Tipo: ${consulta.tipo}

A mensagem deve:
- Ser cordial e profissional
- Incluir emojis apropriados
- Pedir confirmação de presença
- Ser concisa (máximo 5 linhas)
- Incluir as informações da clínica: ${process.env.CLINICA_NOME}, ${process.env.CLINICA_ENDERECO}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente de uma clínica médica que cria mensagens de lembrete amigáveis e profissionais.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Erro ao gerar mensagem com IA:', error.message);
    // Fallback para template padrão
    return generateTemplateMessage(consulta);
  }
}

/**
 * Gerar mensagem usando template padrão
 */
function generateTemplateMessage(consulta) {
  const clinicaNome = process.env.CLINICA_NOME || 'Clínica Médica';
  const clinicaEndereco = process.env.CLINICA_ENDERECO || '';
  const clinicaTelefone = process.env.CLINICA_TELEFONE || '';

  const tipoConsulta = {
    'primeira_consulta': 'Primeira Consulta',
    'retorno': 'Consulta de Retorno',
    'exame': 'Exame',
    'avaliacao': 'Avaliação'
  }[consulta.tipo] || 'Consulta';

  return `Olá ${consulta.paciente_nome}! 👋

Este é um lembrete da sua ${tipoConsulta}:

📅 Data: ${formatDate(consulta.data_hora)}
🕐 Horário: ${formatTime(consulta.data_hora)}
👨‍⚕️ Dr(a): ${consulta.medico_nome}
📍 ${clinicaNome}
${clinicaEndereco ? `   ${clinicaEndereco}` : ''}

Por favor, confirme sua presença respondendo *SIM*.

${clinicaTelefone ? `Para remarcar, ligue: ${clinicaTelefone}` : ''}`;
}

/**
 * Gerar mensagem de confirmação
 */
function generateConfirmationMessage(pacienteNome) {
  return `✅ Obrigado, ${pacienteNome}! Sua presença foi confirmada.

Aguardamos você no horário marcado. 😊`;
}

/**
 * Gerar mensagem de cancelamento
 */
function generateCancellationMessage(pacienteNome) {
  const clinicaTelefone = process.env.CLINICA_TELEFONE || '';
  
  return `Olá ${pacienteNome},

Sua consulta foi cancelada.

${clinicaTelefone ? `Para reagendar, entre em contato: ${clinicaTelefone}` : 'Entre em contato para reagendar.'}`;
}

/**
 * Formatar data (ex: 16/10/2025 - Quinta-feira)
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const diaSemana = diasSemana[date.getDay()];
  
  return `${dia}/${mes}/${ano} (${diaSemana})`;
}

/**
 * Formatar hora (ex: 14:30)
 */
function formatTime(dateString) {
  const date = new Date(dateString);
  const hora = String(date.getHours()).padStart(2, '0');
  const minuto = String(date.getMinutes()).padStart(2, '0');
  
  return `${hora}:${minuto}`;
}

module.exports = {
  generatePersonalizedMessage,
  generateConfirmationMessage,
  generateCancellationMessage,
  generateTemplateMessage
};

