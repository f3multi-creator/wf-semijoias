// Configurações do site
export const siteConfig = {
    name: "WF Semijoias",
    description: "Semijoias artesanais feitas à mão com pedras brasileiras premium",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://wfsemijoias.com.br",

    // Contato
    whatsapp: "5511999999999", // Número do WhatsApp (DDD + número sem espaços)
    email: "contato@wfsemijoias.com.br",
    instagram: "@wfsemijoias",

    // Políticas
    freeShippingThreshold: 300, // Frete grátis acima de R$ 300
    maxInstallments: 12,

    // Prazos (em dias úteis)
    shipping: {
        processingDays: 2, // Dias para preparar o pedido
        sedexDays: "3-5",
        pacDays: "7-12",
    },
};

// Templates de mensagens
export const messageTemplates = {
    // Mensagem para cliente - Pedido confirmado
    orderConfirmed: (orderNumber: number, customerName: string) => `
Olá ${customerName}! 🌟

Seu pedido #${orderNumber} foi confirmado com sucesso na WF Semijoias!

📦 Prazo de envio: até ${siteConfig.shipping.processingDays} dias úteis após a confirmação do pagamento.

Você receberá o código de rastreio assim que o pedido for enviado.

Qualquer dúvida, estamos à disposição!

✨ WF Semijoias
  `.trim(),

    // Mensagem para cliente - Pedido enviado
    orderShipped: (orderNumber: number, customerName: string, trackingCode: string) => `
Olá ${customerName}! 🎉

Ótima notícia! Seu pedido #${orderNumber} foi enviado!

📦 Código de rastreio: ${trackingCode}
🔗 Rastreie em: https://rastreamento.correios.com.br

Prazo estimado de entrega: ${siteConfig.shipping.sedexDays} dias úteis (Sedex) ou ${siteConfig.shipping.pacDays} dias úteis (PAC).

✨ WF Semijoias
  `.trim(),

    // Mensagem para admin - Novo pedido
    newOrderAdmin: (orderNumber: number, customerName: string, total: string) => `
🔔 NOVO PEDIDO #${orderNumber}

Cliente: ${customerName}
Total: ${total}

Acesse o painel para ver detalhes e preparar o envio.
  `.trim(),

    // Mensagem WhatsApp para produto esgotado
    outOfStock: (productName: string) =>
        `Olá! Vi que o produto "${productName}" está esgotado. Vocês têm previsão de reposição?`,
};

// Gerar link do WhatsApp
export function getWhatsAppLink(message: string, phone?: string) {
    const number = phone || siteConfig.whatsapp;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encodedMessage}`;
}

// Formatar número de telefone para WhatsApp
export function formatPhoneForWhatsApp(phone: string) {
    // Remove tudo que não é número
    let cleaned = phone.replace(/\D/g, '');

    // Se não começar com 55, adiciona
    if (!cleaned.startsWith('55')) {
        cleaned = '55' + cleaned;
    }

    return cleaned;
}
