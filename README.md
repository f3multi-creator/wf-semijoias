# WF Semijoias

E-commerce de semijoias artesanais brasileiras.

🌐 **Site**: [wfsemijoias.com.br](https://wfsemijoias.com.br)

## Stack

- **Frontend**: Next.js 14 + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js (Google + Email)
- **Pagamentos**: Mercado Pago
- **Frete**: Melhor Envio API
- **Deploy**: Vercel

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Documentação

| Arquivo | Descrição |
|---------|-----------|
| `CLAUDE.md` | Documento-mãe do projeto |
| `.agent/SPEC.md` | Especificação técnica |
| `.agent/CHANGELOG.md` | Histórico de mudanças |
| `.agent/tasks.json` | Backlog de tarefas |

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

- Supabase (URL, Anon Key, Service Role Key)
- Mercado Pago (Access Token, Public Key)
- NextAuth (Secret, Google OAuth)
- Melhor Envio (Token)
- Resend (API Key)
