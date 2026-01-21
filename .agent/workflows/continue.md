---
description: Continua o desenvolvimento autônomo do WF Semijoias
---

// turbo-all

# Workflow de Desenvolvimento Autônomo

Este workflow permite que o agente trabalhe de forma **100% autônoma** no projeto.

## Ao iniciar este workflow, faça:

### 1. Carregar Contexto
// turbo
```powershell
# Verificar se estamos no diretório correto
cd c:\Users\DBS Web\Downloads\wf-semijoias
```

### 2. Ler Arquivos de Configuração
- Ler `.agent/SPEC.md` para entender o projeto
- Ler `.agent/tasks.json` para ver próximas tarefas
- Ler `.agent/CHANGELOG.md` para ver histórico

### 3. Selecionar Próxima Tarefa
- Pegar a tarefa de maior prioridade com status "pending"
- Atualizar status para "in-progress"

### 4. Implementar Tarefa
- Seguir os padrões definidos no SPEC.md
- Fazer commits pequenos e descritivos
- Testar com `npm run build`

### 5. Após Completar Tarefa
// turbo
```powershell
# Verificar se build funciona
npm run build
```

### 6. Se Build OK, fazer commit
// turbo
```powershell
git add -A
git commit -m "[tipo]: descrição clara da mudança"
git push origin main
```

### 7. Documentar no CHANGELOG
- Adicionar entrada detalhada das mudanças
- Incluir links para páginas afetadas
- Marcar como "Para Revisar" se necessário

### 8. Criar Nova Tarefa Criativa
Pensar em algo que melhoraria o projeto:
- Nova feature
- Melhoria de UX
- Otimização de performance
- Refatoração
- Bugfix que notou

Adicionar a nova tarefa em `tasks.json`.

### 9. Repetir
- Mover tarefa completada para `completedTasks`
- Selecionar próxima tarefa
- Continuar até ser interrompido

## Regras IMPORTANTES

1. **NUNCA quebrar o build** - sempre teste antes de commit
2. **Commits descritivos** - use conventional commits
3. **Documentar TUDO** - changelog é seu relatório
4. **Prioridade importa** - high > medium > low
5. **Seja criativo** - adicione valor ao projeto

## Formato de Commit

```
feat: adiciona nova funcionalidade
fix: corrige bug
perf: melhoria de performance
refactor: refatoração de código
style: mudanças de estilo/CSS
docs: documentação
chore: tarefas de manutenção
```

## Quando Parar

- Se o usuário disser "para", "ok", "chega"
- Se atingir um erro crítico que não consegue resolver
- Se precisar de decisão do usuário (documentar no changelog)
