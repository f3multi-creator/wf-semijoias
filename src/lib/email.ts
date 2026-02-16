import { Resend } from 'resend';

// Lazy loading do Resend para evitar erro no build
let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[EMAIL] ❌ RESEND_API_KEY não configurada — nenhum email será enviado. Configure a variável de ambiente.');
      return null;
    }
    resendInstance = new Resend(apiKey);
    console.log('[EMAIL] ✅ Resend inicializado com sucesso');
  }
  return resendInstance;
}

// Diagnóstico do serviço de email (usada pelo debug endpoint)
export function getEmailServiceStatus() {
  const apiKey = process.env.RESEND_API_KEY;
  return {
    configured: !!apiKey,
    apiKeyPrefix: apiKey ? `${apiKey.substring(0, 8)}...` : null,
    fromEmail: FROM_EMAIL,
    siteUrl: SITE_URL,
  };
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
  console.log(`[EMAIL] Enviando boas-vindas para ${to}`);
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Bem-vinda à WF Semijoias!',
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
    console.log(`[EMAIL] ✅ Boas-vindas enviado para ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] ❌ Falha ao enviar boas-vindas para ${to}:`, error);
    return { success: false, error };
  }
}

// Email de recuperação de senha
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };
  console.log(`[EMAIL] Enviando reset de senha para ${to}`);
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
    console.log(`[EMAIL] ✅ Reset de senha enviado para ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] ❌ Falha ao enviar reset de senha para ${to}:`, error);
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
  console.log(`[EMAIL] Enviando confirmação do pedido ${orderId} para ${to}`);
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
      subject: `Pedido #${orderId.slice(0, 8).toUpperCase()} confirmado!`,
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
              <h2>Pedido Confirmado!</h2>
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
    console.log(`[EMAIL] ✅ Confirmação do pedido ${orderId} enviada para ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] ❌ Falha ao enviar confirmação do pedido ${orderId} para ${to}:`, error);
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
  console.log(`[EMAIL] Enviando notificação de envio do pedido ${orderId} para ${to}`);
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Seu pedido foi enviado! - #${orderId.slice(0, 8).toUpperCase()}`,
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
              <h2>Pedido Enviado!</h2>
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
    console.log(`[EMAIL] ✅ Notificação de envio do pedido ${orderId} enviada para ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] ❌ Falha ao enviar notificação de envio para ${to}:`, error);
    return { success: false, error };
  }
}

// Email de alerta de estoque baixo (Admin)
export async function sendStockAlertEmail(
  products: Array<{ name: string; stock: number; slug: string }>
) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };
  console.log(`[EMAIL] Enviando alerta de estoque para ${products.length} produtos`);
  // Admin email - pode ser configurado via env ou usar o mesmo do remetente por enquanto
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contato@wfsemijoias.com.br';

  const productsHtml = products.map(p => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #b8860b; font-weight: bold;">${p.stock}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        <a href="${SITE_URL}/produto/${p.slug}" style="color: #1a1a1a; text-decoration: underline;">Ver</a>
      </td>
    </tr>
  `).join('');

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ Alerta de Estoque Baixo - ${products.length} produtos`,
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
              <h2>Alerta de Estoque</h2>
              <p>Os seguintes produtos estão com estoque baixo (menos de 5 unidades):</p>
              
              <table style="width: 100%; margin: 20px 0;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Produto</th>
                    <th style="padding: 10px; text-align: center;">Estoque</th>
                    <th style="padding: 10px; text-align: right;">Link</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
              </table>
              
              <a href="${SITE_URL}/admin/produtos" class="button">Gerenciar Estoque</a>
            </div>
            <div class="footer">
              <p>Sistema de Monitoramento WF Semijoias</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`[EMAIL] ✅ Alerta de estoque enviado`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] ❌ Falha ao enviar alerta de estoque:`, error);
    return { success: false, error };
  }
}

// Email de Carrinho Abandonado
export async function sendAbandonedCartEmail(to: string, name: string, recoverLink: string) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email service not configured' };
  console.log(`[EMAIL] Enviando email de carrinho abandonado para ${to}`);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Você esqueceu algo especial... ✨',
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
              <p>Notamos que você deixou algumas peças lindas no seu carrinho.</p>
              <p>Elas estão te esperando, mas nosso estoque é limitado.</p>
              <p>Que tal finalizar sua compra agora?</p>

              <a href="${recoverLink}" class="button">Voltar ao Carrinho</a>
              
              <p>Se tiver alguma dúvida, nossa equipe está pronta para te ajudar no WhatsApp.</p>
            </div>
            <div class="footer">
              <p>WF Semijoias - Joias que contam histórias</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`[EMAIL] ✅ Carrinho abandonado enviado para ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[EMAIL] ❌ Falha ao enviar email de carrinho abandonado para ${to}:`, error);
    return { success: false, error };
  }
}
