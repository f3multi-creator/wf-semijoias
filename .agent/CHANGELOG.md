# Changelog - WF Semijoias

Todas as mudanças notáveis do projeto são documentadas neste arquivo.

---

## [Sessão 2026-01-21] - Desenvolvimento Autônomo

### Adicionado

- **[src/app/api/search/route.ts](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/app/api/search/route.ts)**: API de busca de produtos
  - Full-text search em nome e descrição
  - Limite de 20 resultados
  - Mínimo 2 caracteres para buscar

- **[src/app/busca/page.tsx](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/app/busca/page.tsx)**: Página de busca
  - Busca em tempo real com debounce de 300ms
  - Grid responsivo de resultados
  - Estado de loading, vazio e resultados
  - *Para testar: acesse `/busca`*

- **[src/store/wishlist.ts](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/store/wishlist.ts)**: Store de favoritos (Zustand)
  - Persistência em localStorage
  - Add/remove/toggle/clear

- **[src/app/favoritos/page.tsx](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/app/favoritos/page.tsx)**: Página de favoritos
  - Lista todos os itens salvos
  - Botão para adicionar ao carrinho
  - Botão para remover dos favoritos
  - *Para testar: acesse `/favoritos`*

### Corrigido

- **[src/app/admin/produtos/page.tsx](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/app/admin/produtos/page.tsx)**: Filtros de produtos agora funcionam
  - Busca por nome com debounce
  - Filtro por categoria (dinâmico do banco)
  - Filtro por status ativo/inativo
  - Botão "Limpar filtros"
  - *BUG CORRIGIDO: filtros eram apenas UI estática*

- **[src/app/api/admin/products/route.ts](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/app/api/admin/products/route.ts)**: API agora aceita query params
  - `search`: busca por nome/slug
  - `category_id`: filtro por categoria
  - `is_active`: filtro por status

### Modificado

- **[src/components/product/ProductCard.tsx](file:///c:/Users/DBS%20Web/Downloads/wf-semijoias/src/components/product/ProductCard.tsx)**: Botão de wishlist funcional
  - Convertido para client component
  - Conectado ao wishlist store
  - Visual diferente quando item está nos favoritos
  - *Para testar: passe o mouse sobre qualquer produto na home*

---

## Auditoria do Painel Admin

| Módulo | Status | Notas |
|--------|--------|-------|
| Dashboard | ✅ OK | Métricas, alertas, ações rápidas |
| Produtos | ✅ Corrigido | Filtros agora funcionam |
| Pedidos | ✅ OK | Listagem, filtros, detalhes |
| Cupons | ✅ OK | CRUD completo |
| Configurações | ✅ OK | Frete com Melhor Envio |

---

## Próximas Tarefas

- [ ] Instagram feed real
- [ ] SEO meta tags dinâmicas
- [ ] Paginação na lista de produtos admin
