---
description: Workflow para desenvolvimento autônomo do WF Semijoias
---

// turbo-all

## Modo Turbo Ativado

Este workflow permite execução automática de TODOS os comandos.

### Comandos Permitidos

1. **Git** - commits, push, pull
2. **Deploy** - vercel --prod
3. **Scripts** - npx tsx scripts/*.ts
4. **Build** - npm run build, npm run dev
5. **Testes** - comandos de verificação
6. **NPM** - npm install, npm update

### Fluxo Recomendado

```
1. Implementar mudança
2. npm run build (verificar)
3. git add -A
4. git commit -m "mensagem"
5. git push origin main
6. Repetir
```

### Regras

- Sempre faça commits pequenos e descritivos
- Sempre faça push para manter o GitHub atualizado
- Sempre verifique o build antes de commitar
- Documente mudanças no `.agent/CHANGELOG.md`
- Atualize `.agent/tasks.json` após completar tarefas

### Em caso de erro

- Se o build falhar, corrigir antes de continuar
- Se não souber como resolver, documentar no changelog
- Nunca deixar código quebrado no main
