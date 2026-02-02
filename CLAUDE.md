# CLAUDE.md - WF Semijoias

> **Documento-mãe do projeto.** Leia SEMPRE que iniciar uma sessão.

## 🎯 Sobre o Projeto

**WF Semijoias** é um e-commerce de semijoias artesanais brasileiras.

| Info | Valor |
|------|-------|
| Site | [wfsemijoias.com.br](https://wfsemijoias.com.br) |
| Repo | [github.com/f3multi-creator/wf-semijoias](https://github.com/f3multi-creator/wf-semijoias) |
| Deploy | Vercel (auto-deploy do GitHub) |
| Branch | `master` |

---

## 🧠 Modelo de Negócio

> **IMPORTANTE**: Decisões de desenvolvimento devem respeitar isso.

- **Estoque**: 2-3 peças por modelo (artesanal)
- **Esgotado**: Mostrar "Sob encomenda" + botão WhatsApp
- **WhatsApp**: Canal de conversão TÃO forte quanto o site
- **Customização**: Peças personalizadas disponíveis
- **Número**: `55 27 99920-1077`

---

## 🏗️ Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| Estado | Zustand |
| Banco | Supabase (PostgreSQL) |
| Auth | NextAuth.js (Google + Email) |
| Pagamentos | Mercado Pago |
| Frete | Melhor Envio API |
| Emails | Resend |
| Deploy | Vercel |

---

## 📁 Estrutura

```
src/
├── app/              # Páginas (App Router)
│   ├── admin/        # Painel administrativo
│   ├── api/          # API routes
│   └── ...           # Outras páginas
├── components/       # Componentes React
├── lib/              # Utilitários e configs
├── store/            # Zustand stores
└── types/            # TypeScript types
```

---

## 📚 Documentação Relacionada

| Arquivo | Propósito |
|---------|-----------|
| `.agent/SPEC.md` | Especificação técnica detalhada |
| `.agent/CHANGELOG.md` | Histórico de mudanças |
| `.agent/tasks.json` | Backlog de tarefas |
| `.agent/workflows/` | Comandos `/continue` e `/turbo` |

---

## ⚠️ Problemas Críticos Atuais

> Resolver ANTES de qualquer nova feature!

1. **Webhook Mercado Pago inativo** - Cliente paga, pedido não registra
2. **Emails não disparam** - Funções existem mas não são chamadas
3. **Área "Meus Pedidos"** - Cliente não vê histórico

---

## ✅ Regras de Desenvolvimento

### Git
- Branch principal: `master`
- Commits: conventional commits (`feat:`, `fix:`, etc.)
- Sempre testar build antes de push
- Email git: `f3multi@gmail.com`

### Código
- TypeScript strict
- Componentes < 200 linhas
- ESLint sem warnings

### Workflow Autônomo
1. Ler `tasks.json` para próxima tarefa
2. Implementar seguindo padrões
3. Testar com `npm run build`
4. Documentar em `CHANGELOG.md`
5. Commit e push quando autorizado

---

## 🎨 Design System

| Token | Valor | Uso |
|-------|-------|-----|
| gold | #C5A572 | CTAs, destaques |
| dark | #1A1A1A | Textos principais |
| cream | #F5F5F0 | Backgrounds |
| taupe | #8B8B7A | Textos secundários |

**Fontes**: Playfair Display (títulos), Inter (corpo)

---

## 📝 Aprendizados (Atualizar Sempre!)

> Quando errar, adicione aqui: *"Atualiza o CLAUDE.md pra não errar isso de novo"*

### Erros a Evitar
- URL do Mercado Pago não pode ter newlines/caracteres inválidos
- Variáveis de ambiente precisam estar na Vercel E no `.env.local`
- Sempre usar `supabase-admin.ts` para operações server-side sensíveis

### Soluções que Funcionam
- Frete: fallback simulado quando API Melhor Envio falha
- Produtos esgotados: redirecionar para WhatsApp

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build (sempre antes de commit)
npm run build

# Git
git add -A && git commit -m "feat: descrição" && git push

# Workflows
/continue  # Desenvolvimento autônomo
/turbo     # Modo turbo (auto-aprovação de comandos)
```

---

*Última atualização: 02/02/2026*
