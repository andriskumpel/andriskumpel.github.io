# Weekly Planner Gen Z

App pessoal de planejamento semanal em React, com UI gamificada, modos noturno/diurno, tarefas por dia, progresso semanal, streak, energia do dia e modo foco.

## Funcionalidades

- Alternância entre modo noturno e modo diurno
- Planejamento por dia da semana
- Cadastro de tarefas/quests com área e prioridade
- Marcação de tarefas como concluídas
- Exclusão de tarefas
- Progresso semanal automático
- Contador de streak para dias totalmente concluídos
- Campo de foco da semana
- Campo de missão principal
- Seletor de energia do dia
- Modo foco para reduzir distrações
- UI mobile-first com visual neon/glassmorphism

## Tecnologias

- React
- Vite
- Tailwind CSS

## Como rodar localmente

```bash
cd weekly-planner-genz
npm install
npm run dev
```

Depois, abra o endereço exibido pelo Vite no navegador.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```txt
weekly-planner-genz/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── src/
    ├── main.jsx
    ├── styles.css
    └── WeeklyPlannerApp.jsx
```

## Observação

O app não usa bibliotecas externas de ícones. Os ícones foram implementados como SVGs locais para evitar erro de carregamento em ambientes sem acesso a CDN.
