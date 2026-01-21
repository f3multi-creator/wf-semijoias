import { Resend } from 'resend';

// Lazy loading do Resend para evitar erro no build
let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured');
      return null;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Email base da loja
const FROM_EMAIL = 'WF Semijoias <noreply@wfsemijoias.com.br>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wfsemijoias.com.br';

// Templates de email em HTML
const emailStyles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #b8860b; }
    .content { background: #fafaf8; border: 1px solid #e8e6e3; padding: 30px; }
    .button { display: inline-block; background: #1a1a1a; color: white !important; padding: 12px 30px; text-decoration: none; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
`;

// Email de boas-vindas após registro
export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Bem-vinda à WF Semijoias! ✨',
      html: `
        <!DOCTYPE html>
        <html>
        <head>${emailStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WF Semijoias</div>
            </div>
            <div class="content">
              <h2>Olá, ${name}! 💎</h2>
              <p>Seja muito bem-vinda à WF Semijoias!</p>
              <p>Sua conta foi criada com sucesso. Agora você pode:</p>
              <ul>
                <li>Acompanhar seus pedidos</li>
                <li>Salvar seus endereços favoritos</li>
                <li>Receber ofertas exclusivas</li>
              </ul>
              <a href="${SITE_URL}" class="button">Explorar Coleção</a>
              <p>Qualquer dúvida, estamos à disposição!</p>
            </div>
            <div class="footer">
              <p>WF Semijoias - Joias que contam histórias</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    return { success: false, error };
  }
}

// Email de recuperação de senha
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };

  const resetUrl = `${SITE_URL}/redefinir-senha?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Redefinir sua senha - WF Semijoias',
      html: `
        <!DOCTYPE html>
        <html>
        <head>${emailStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WF Semijoias</div>
            </div>
            <div class="content">
              <h2>Olá, ${name}!</h2>
              <p>Você solicitou a redefinição da sua senha.</p>
              <p>Clique no botão abaixo para criar uma nova senha:</p>
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
              <p><small>Este link expira em 1 hora.</small></p>
              <p>Se você não solicitou essa alteração, ignore este email.</p>
            </div>
            <div class="footer">
              <p>WF Semijoias - Joias que contam histórias</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    return { success: false, error };
  }
}

// Email de confirmação de pedido
export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido #${orderId.slice(0, 8).toUpperCase()} confirmado! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>${emailStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WF Semijoias</div>
            </div>
            <div class="content">
              <h2>Pedido Confirmado! 🎉</h2>
              <p>Olá, ${name}!</p>
              <p>Seu pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> foi recebido com sucesso.</p>
              
              <table style="width: 100%; margin: 20px 0;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Produto</th>
                    <th style="padding: 10px; text-align: center;">Qtd</th>
                    <th style="padding: 10px; text-align: right;">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #b8860b;">R$ ${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <p>Você receberá atualizações sobre o status do seu pedido por email.</p>
              <a href="${SITE_URL}/minha-conta/pedidos" class="button">Ver Meus Pedidos</a>
            </div>
            <div class="footer">
              <p>WF Semijoias - Joias que contam histórias</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return { success: false, error };
  }
}

// Email de pedido enviado com código de rastreamento
export async function sendShippingEmail(
  to: string,
  name: string,
  orderId: string,
  trackingCode: string
) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Seu pedido foi enviado! 📦 - #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>${emailStyles}</head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WF Semijoias</div>
            </div>
            <div class="content">
              <h2>Pedido Enviado! 📦</h2>
              <p>Olá, ${name}!</p>
              <p>Ótima notícia! Seu pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> está a caminho.</p>
              
              <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #666;">Código de Rastreamento:</p>
                <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">${trackingCode}</p>
              </div>
              
              <a href="https://www.linkcorreios.com.br/?id=${trackingCode}" class="button" target="_blank">Rastrear Pedido</a>
              
              <p>Em breve suas joias estarão com você!</p>
            </div>
            <div class="footer">
              <p>WF Semijoias - Joias que contam histórias</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de envio:', error);
    return { success: false, error };
  }
}
