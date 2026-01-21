# WF Semijoias - Especificação do Projeto

> Este arquivo define a visão, requisitos e padrões do projeto. O agente deve consultar este arquivo sempre que iniciar uma sessão de trabalho autônomo.

## 🎯 Visão do Produto

E-commerce premium de semijoias artesanais brasileiras, com foco em:
- **Experiência visual luxuosa** - Design minimalista e elegante
- **Performance** - Core Web Vitals otimizados
- **Conversão** - Checkout simples e intuitivo
- **Mobile-first** - 70%+ do tráfico é mobile

## 🏗️ Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16 + React 19 |
| Estilos | Tailwind CSS 4 |
| Estado | Zustand |
| Banco | Supabase (PostgreSQL) |
| Auth | NextAuth v5 |
| Pagamentos | MercadoPago |
| Deploy | Vercel |

## 📐 Arquitetura

```
src/
├── app/              # App Router (páginas)
├── components/       # Componentes React
│   ├── admin/        # Painel administrativo
│   ├── cart/         # Carrinho
│   ├── layout/       # Header, Footer
│   ├── product/      # Cards, galeria
│   └── providers/    # Context providers
├── lib/              # Utilitários e configs
├── store/            # Zustand stores
└── types/            # TypeScript types
```

## 🎨 Design System

### Cores
- **gold**: #C5A572 (destaque, CTAs)
- **dark**: #1A1A1A (textos principais)
- **cream**: #F5F5F0 (backgrounds)
- **taupe**: #8B8B7A (textos secundários)

### Tipografia
- **Display**: Playfair Display (títulos)
- **Body**: Inter (textos)

### Espaçamento
- Container: max-width 1280px
- Section padding: 80px vertical
- Grid gap: 24-32px

## ✅ Funcionalidades Implementadas

- [x] Homepage com hero, categorias, produtos em destaque
- [x] Página de produto com galeria
- [x] Carrinho de compras (Zustand + persistência)
- [x] Página de categoria com filtros
- [x] Sistema de autenticação
- [x] Painel admin básico
- [x] Integração Supabase
- [x] Layout responsivo

## 🚧 Funcionalidades Pendentes

### Prioridade ALTA
- [ ] Checkout completo com MercadoPago
- [ ] Cálculo de frete (Correios API)
- [ ] Emails transacionais
- [ ] Página de busca
- [ ] Wishlist

### Prioridade MÉDIA
- [ ] Reviews de produtos
- [ ] Cupons de desconto
- [ ] Rastreamento de pedidos
- [ ] SEO otimizado (meta tags dinâmicas)
- [ ] Blog/Novidades

### Prioridade BAIXA
- [ ] Instagram feed real
- [ ] Notificações push
- [ ] Chat de suporte
- [ ] PWA

## 📏 Padrões de Qualidade

### Performance
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle size < 200kb (inicial)

### Acessibilidade
- WCAG 2.1 AA
- Navegação por teclado
- Contraste adequado
- Alt texts em imagens

### Código
- TypeScript strict mode
- ESLint sem warnings
- Componentes < 200 linhas
- Funções puras quando possível

## 🔄 Workflow de Desenvolvimento Autônomo

Quando em modo autônomo, o agente deve:

1. **Ler** `tasks.json` para próxima tarefa
2. **Implementar** a tarefa seguindo padrões
3. **Testar** com `npm run build`
4. **Documentar** mudanças no `CHANGELOG.md`
5. **Criar** nova tarefa criativa em `tasks.json`
6. **Repetir** até ser interrompido

### Regras do Modo Autônomo
- Commits pequenos e descritivos
- Nunca quebrar o build
- Priorizar tarefas de alta prioridade
- Documentar TUDO no changelog
- Ser criativo em novas tarefas
