import React, { useMemo, useState } from "react";

const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const shortDays = {
  Segunda: "SEG",
  Terça: "TER",
  Quarta: "QUA",
  Quinta: "QUI",
  Sexta: "SEX",
  Sábado: "SÁB",
  Domingo: "DOM",
};

const plannerModes = {
  noturno: {
    id: "noturno",
    title: "Night Mode Planner",
    subtitle: "Planejamento semanal para quem rende melhor quando o mundo cala.",
    icon: "moon",
    routineTitle: "Flow noturno",
    focusDefault: "Proteger meu bloco noturno e fazer a semana andar sem caos.",
    missionLabel: "Missão da noite",
    missionDefault: "Entrar no modo foco e resolver a tarefa mais importante entre 22h e 00h30.",
    deepBlockLabel: "Deep work",
    defaultMainTask: "Definir a missão principal da noite",
    heroTag: "vibe noturna",
    emptyState: "Dia livre ainda. Joga uma tarefa aí pra não virar caos depois.",
    steps: [
      ["Pick", "Escolha uma missão realista"],
      ["Lock", "Até 3 tarefas essenciais"],
      ["Focus", "22h–00h30 sem feed infinito"],
      ["Reset", "Feche o dia antes de dormir"],
    ],
    timeBlocks: [
      { time: "11h30 – 13h00", label: "Warm-up", description: "Mensagens, e-mails e pendências pequenas." },
      { time: "14h30 – 16h30", label: "Build leve", description: "Estudo, leitura, organização ou pesquisa." },
      { time: "17h00 – 18h30", label: "Side quest", description: "Uma tarefa importante, mas sem fritar o cérebro." },
      { time: "20h30 – 22h00", label: "Pré-game", description: "Organizar materiais e preparar o bloco principal." },
      { time: "22h00 – 00h30", label: "Deep work", description: "TCC, programação, criação ou tarefa difícil." },
      { time: "00h30 – 01h00", label: "Shutdown", description: "Salvar progresso e deixar amanhã encaminhado." },
    ],
  },
  diurno: {
    id: "diurno",
    title: "Day Mode Planner",
    subtitle: "Planejamento semanal para fazer o dia render sem virar planilha chata.",
    icon: "sun",
    routineTitle: "Flow diurno",
    focusDefault: "Resolver o essencial cedo e deixar o resto do dia mais leve.",
    missionLabel: "Missão do dia",
    missionDefault: "Resolver a tarefa mais importante no bloco 09h–11h30.",
    deepBlockLabel: "Main quest",
    defaultMainTask: "Definir a missão principal do dia",
    heroTag: "vibe diurna",
    emptyState: "Nada por aqui ainda. Coloca uma tarefa e dá start no dia.",
    steps: [
      ["Pick", "Escolha a missão do dia"],
      ["Lock", "Até 3 tarefas essenciais"],
      ["Focus", "09h–11h30 sem distração"],
      ["Review", "Revise tudo no fim da tarde"],
    ],
    timeBlocks: [
      { time: "07h30 – 08h30", label: "Boot", description: "Café, banho, ambiente e revisão rápida da agenda." },
      { time: "08h30 – 09h00", label: "Setup", description: "Escolher a tarefa principal e preparar materiais." },
      { time: "09h00 – 11h30", label: "Main quest", description: "Tarefa difícil, estudo, TCC ou programação." },
      { time: "11h30 – 13h30", label: "Break", description: "Almoço e intervalo real para recarregar." },
      { time: "13h30 – 15h30", label: "Sprint", description: "Tarefas importantes, reuniões, faculdade ou projetos." },
      { time: "15h30 – 17h00", label: "Admin", description: "Mensagens, e-mails, organização e pendências pequenas." },
      { time: "17h00 – 17h30", label: "Wrap", description: "Revisar progresso e definir o primeiro passo de amanhã." },
    ],
  },
};

const priorities = ["Alta", "Média", "Baixa"];
const areas = ["TCC", "Faculdade", "Trabalho", "Conteúdo", "Saúde", "Casa", "Finanças", "Organização", "Foco"];
const energyLevels = ["Baixa", "Média", "Alta", "Caótica"];

function createDefaultTasks(modeId = "noturno") {
  const mode = plannerModes[modeId] || plannerModes.noturno;
  return {
    Segunda: [
      { id: 1, text: "Planejar a semana", area: "Organização", priority: "Alta", done: false },
      { id: 2, text: mode.defaultMainTask, area: "Foco", priority: "Alta", done: false },
    ],
    Terça: [],
    Quarta: [],
    Quinta: [],
    Sexta: [],
    Sábado: [],
    Domingo: [{ id: 3, text: "Revisar o que funcionou na semana", area: "Revisão", priority: "Média", done: false }],
  };
}

function Icon({ name, size = 20, className = "" }) {
  const commonProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className, "aria-hidden": true };
  const icons = {
    moon: <svg {...commonProps}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" /></svg>,
    sun: <svg {...commonProps}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>,
    calendar: <svg {...commonProps}><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></svg>,
    plus: <svg {...commonProps}><path d="M12 5v14" /><path d="M5 12h14" /></svg>,
    trash: <svg {...commonProps}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v5" /><path d="M14 11v5" /></svg>,
    check: <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.2 2.2 4.8-5.4" /></svg>,
    circle: <svg {...commonProps}><circle cx="12" cy="12" r="9" /></svg>,
    clock: <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
    target: <svg {...commonProps}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>,
    reset: <svg {...commonProps}><path d="M4 4v6h6" /><path d="M20 20v-6h-6" /><path d="M20 9A8 8 0 0 0 6.5 5.5L4 8" /><path d="M4 15a8 8 0 0 0 13.5 3.5L20 16" /></svg>,
    spark: <svg {...commonProps}><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></svg>,
    flame: <svg {...commonProps}><path d="M12 22c4 0 7-2.8 7-6.8 0-3.2-2-5.4-4.3-7.4-.7 2.3-2.1 3.6-3.7 4.4.1-2.8-1.3-5.3-4-7.2.2 3.4-2 5.2-2 9.8C5 19 8 22 12 22Z" /></svg>,
    bolt: <svg {...commonProps}><path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" /></svg>,
  };
  return icons[name] || null;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>{children}</button>;
}

function calculateStats(tasksByDay) {
  const allTasks = Object.values(tasksByDay).flat();
  const done = allTasks.filter((task) => task.done).length;
  const total = allTasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { done, total, percent };
}

function calculateStreak(tasksByDay) {
  return Object.values(tasksByDay).filter((dayTasks) => dayTasks.length > 0 && dayTasks.every((task) => task.done)).length;
}

function getPriorityRank(priority) {
  return { Alta: 3, Média: 2, Baixa: 1 }[priority] || 0;
}

function runSelfTests() {
  const emptyStats = calculateStats({ Segunda: [] });
  console.assert(emptyStats.percent === 0, "Teste 1 falhou: semana vazia deve ter 0%.");
  const partialStats = calculateStats({ Segunda: [{ id: 1, text: "A", done: true }, { id: 2, text: "B", done: false }] });
  console.assert(partialStats.done === 1, "Teste 2 falhou: deve haver 1 tarefa concluída.");
  console.assert(partialStats.total === 2, "Teste 3 falhou: deve haver 2 tarefas no total.");
  console.assert(partialStats.percent === 50, "Teste 4 falhou: progresso deve ser 50%.");
  const roundedStats = calculateStats({ Segunda: [{ id: 1, text: "A", done: true }, { id: 2, text: "B", done: false }, { id: 3, text: "C", done: false }] });
  console.assert(roundedStats.percent === 33, "Teste 5 falhou: progresso arredondado deve ser 33%.");
  console.assert(plannerModes.diurno.title === "Day Mode Planner", "Teste 6 falhou: modo diurno deve ter título próprio.");
  console.assert(plannerModes.diurno.timeBlocks.some((block) => block.label === "Main quest"), "Teste 7 falhou: modo diurno deve ter bloco principal.");
  const dayTasks = createDefaultTasks("diurno");
  console.assert(dayTasks.Segunda[1].text.includes("dia"), "Teste 8 falhou: tarefa padrão do modo diurno deve mencionar o dia.");
  const streak = calculateStreak({ Segunda: [{ done: true }], Terça: [{ done: true }, { done: true }], Quarta: [{ done: false }] });
  console.assert(streak === 2, "Teste 9 falhou: streak deve contar dias totalmente concluídos.");
  console.assert(getPriorityRank("Alta") > getPriorityRank("Baixa"), "Teste 10 falhou: prioridade Alta deve valer mais que Baixa.");
}

if (typeof window !== "undefined" && !window.__weeklyPlannerTestsDone) {
  window.__weeklyPlannerTestsDone = true;
  runSelfTests();
}

export default function WeeklyPlannerApp() {
  const [plannerMode, setPlannerMode] = useState("noturno");
  const mode = plannerModes[plannerMode];
  const isDayMode = plannerMode === "diurno";
  const [selectedDay, setSelectedDay] = useState("Segunda");
  const [weeklyFocus, setWeeklyFocus] = useState(plannerModes.noturno.focusDefault);
  const [tasks, setTasks] = useState(createDefaultTasks("noturno"));
  const [newTask, setNewTask] = useState("");
  const [newArea, setNewArea] = useState("TCC");
  const [newPriority, setNewPriority] = useState("Alta");
  const [mission, setMission] = useState(plannerModes.noturno.missionDefault);
  const [energy, setEnergy] = useState("Média");
  const [focusMode, setFocusMode] = useState(false);

  const selectedTasks = tasks[selectedDay] || [];
  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  const streak = useMemo(() => calculateStreak(tasks), [tasks]);
  const topTask = useMemo(() => [...selectedTasks].filter((task) => !task.done).sort((a, b) => getPriorityRank(b.priority) - getPriorityRank(a.priority))[0], [selectedTasks]);

  const accentClasses = isDayMode
    ? { page: "from-orange-950 via-zinc-950 to-yellow-950", orbOne: "bg-amber-400/20", orbTwo: "bg-orange-500/20", ring: "ring-amber-300/30", iconBg: "bg-amber-400/20 text-amber-100 border-amber-300/20", border: "border-amber-300/50", bgSoft: "bg-amber-300/15", bgButton: "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-zinc-950", textSoft: "text-amber-200", badge: "bg-amber-300/15 border-amber-200/20 text-amber-100", progress: "bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400", glow: "shadow-amber-500/20" }
    : { page: "from-fuchsia-950 via-zinc-950 to-cyan-950", orbOne: "bg-fuchsia-500/20", orbTwo: "bg-cyan-400/20", ring: "ring-fuchsia-300/30", iconBg: "bg-fuchsia-400/20 text-fuchsia-100 border-fuchsia-300/20", border: "border-fuchsia-300/50", bgSoft: "bg-fuchsia-300/15", bgButton: "bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-400 hover:to-cyan-300 text-white", textSoft: "text-fuchsia-200", badge: "bg-fuchsia-300/15 border-fuchsia-200/20 text-fuchsia-100", progress: "bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300", glow: "shadow-fuchsia-500/20" };

  function addTask() {
    const text = newTask.trim();
    if (!text) return;
    const task = { id: Date.now(), text, area: newArea, priority: newPriority, done: false };
    setTasks((prev) => ({ ...prev, [selectedDay]: [...(prev[selectedDay] || []), task] }));
    setNewTask("");
  }

  function toggleTask(id) {
    setTasks((prev) => ({ ...prev, [selectedDay]: (prev[selectedDay] || []).map((task) => task.id === id ? { ...task, done: !task.done } : task) }));
  }

  function deleteTask(id) {
    setTasks((prev) => ({ ...prev, [selectedDay]: (prev[selectedDay] || []).filter((task) => task.id !== id) }));
  }

  function applyPlannerMode(nextModeId) {
    const nextMode = plannerModes[nextModeId];
    setPlannerMode(nextModeId);
    setWeeklyFocus(nextMode.focusDefault);
    setMission(nextMode.missionDefault);
    setTasks(createDefaultTasks(nextModeId));
    setSelectedDay("Segunda");
    setNewTask("");
    setFocusMode(false);
  }

  function resetWeek() {
    setTasks(createDefaultTasks(plannerMode));
    setSelectedDay("Segunda");
    setWeeklyFocus(mode.focusDefault);
    setMission(mode.missionDefault);
    setNewTask("");
    setNewArea("TCC");
    setNewPriority("Alta");
    setEnergy("Média");
    setFocusMode(false);
  }

  const priorityClass = { Alta: "bg-red-400/15 text-red-100 border-red-300/30", Média: "bg-yellow-300/15 text-yellow-100 border-yellow-200/30", Baixa: "bg-emerald-300/15 text-emerald-100 border-emerald-200/30" };

  return (
    <div className={`min-h-screen overflow-hidden bg-gradient-to-br ${accentClasses.page} text-white p-3 md:p-8`}>
      <div className={`pointer-events-none fixed left-[-10rem] top-[-10rem] h-80 w-80 rounded-full blur-3xl ${accentClasses.orbOne}`} />
      <div className={`pointer-events-none fixed right-[-8rem] top-40 h-72 w-72 rounded-full blur-3xl ${accentClasses.orbTwo}`} />
      <div className="pointer-events-none fixed bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className={`mx-auto max-w-7xl space-y-5 ${focusMode ? "max-w-4xl" : ""}`}>
        <header className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <Card className={`relative overflow-hidden ${accentClasses.glow}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <CardContent className="p-5 md:p-7 space-y-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-[1.5rem] border p-4 shadow-xl ${accentClasses.iconBg}`}><Icon name={mode.icon} size={30} /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.2em] ${accentClasses.badge}`}>{mode.heroTag}</span></div>
                    <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.06em] md:text-6xl">{mode.title}</h1>
                    <p className="mt-2 max-w-xl text-sm font-medium text-white/60 md:text-base">{mode.subtitle}</p>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-1 flex w-full shrink-0 md:w-auto">
                  <button type="button" onClick={() => applyPlannerMode("noturno")} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-black transition active:scale-[0.98] ${plannerMode === "noturno" ? "bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-fuchsia-500/20" : "text-white/50 hover:text-white"}`}>🌙 Noturno</button>
                  <button type="button" onClick={() => applyPlannerMode("diurno")} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-black transition active:scale-[0.98] ${plannerMode === "diurno" ? "bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "text-white/50 hover:text-white"}`}>☀️ Diurno</button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_.7fr]">
                <div className="space-y-2"><label htmlFor="weekly-focus" className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Foco da semana</label><textarea id="weekly-focus" value={weeklyFocus} onChange={(event) => setWeeklyFocus(event.target.value)} className={`w-full min-h-28 rounded-[1.5rem] bg-black/30 border border-white/10 p-4 text-sm font-medium text-white outline-none resize-none placeholder:text-white/30 focus:${accentClasses.border}`} /></div>
                <div className="space-y-2"><label htmlFor="main-mission" className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{mode.missionLabel}</label><textarea id="main-mission" value={mission} onChange={(event) => setMission(event.target.value)} className={`w-full min-h-28 rounded-[1.5rem] bg-black/30 border border-white/10 p-4 text-sm font-medium text-white outline-none resize-none placeholder:text-white/30 focus:${accentClasses.border}`} /></div>
                <div className="space-y-2"><label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Energia hoje</label><div className="grid grid-cols-2 gap-2">{energyLevels.map((level) => <button key={level} type="button" onClick={() => setEnergy(level)} className={`rounded-2xl border px-3 py-3 text-sm font-black transition active:scale-[0.98] ${energy === level ? `${accentClasses.badge} ring-2 ${accentClasses.ring}` : "border-white/10 bg-black/20 text-white/45 hover:text-white"}`}>{level}</button>)}</div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 md:p-7 h-full flex flex-col justify-between gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4"><div className="flex items-center gap-2 text-white/45"><Icon name="spark" size={16} /> <span className="text-xs font-black uppercase tracking-widest">XP semanal</span></div><div className="mt-3 text-5xl font-black tracking-[-0.08em]">{stats.percent}%</div><p className="mt-1 text-xs font-bold text-white/45">{stats.done}/{stats.total} quests</p></div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4"><div className="flex items-center gap-2 text-white/45"><Icon name="flame" size={16} /> <span className="text-xs font-black uppercase tracking-widest">Streak</span></div><div className="mt-3 text-5xl font-black tracking-[-0.08em]">{streak}</div><p className="mt-1 text-xs font-bold text-white/45">dias fechados</p></div>
              </div>
              <div className="rounded-full bg-black/30 p-1.5"><div className={`h-4 rounded-full transition-all duration-300 ${accentClasses.progress}`} style={{ width: `${stats.percent}%` }} aria-label={`Progresso semanal: ${stats.percent}%`} /></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4"><div className="flex items-center gap-2 text-white/45"><Icon name="bolt" size={16} /> <span className="text-xs font-black uppercase tracking-widest">Next up</span></div><p className="mt-2 text-sm font-bold text-white/80">{topTask ? topTask.text : "Tudo limpo por enquanto."}</p></div>
              <div className="grid grid-cols-2 gap-2"><Button onClick={() => setFocusMode((value) => !value)} className={`${focusMode ? accentClasses.bgButton : "bg-white/10 text-white hover:bg-white/15"}`}><Icon name="target" size={16} /> {focusMode ? "Sair" : "Foco"}</Button><Button onClick={resetWeek} className="bg-white/10 text-white hover:bg-white/15"><Icon name="reset" size={16} /> Reset</Button></div>
            </CardContent>
          </Card>
        </header>
        <main className={`grid gap-5 ${focusMode ? "lg:grid-cols-[.85fr_1.15fr]" : "lg:grid-cols-[.75fr_1.25fr_.9fr]"}`}>
          <Card><CardContent className="p-5 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Icon name="calendar" size={20} className={accentClasses.textSoft} /><h2 className="text-xl font-black tracking-tight">Semana</h2></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/50">tap no dia</span></div><div className="grid grid-cols-2 gap-2 md:grid-cols-1">{days.map((day) => { const dayTasks = tasks[day] || []; const done = dayTasks.filter((task) => task.done).length; const active = selectedDay === day; const dayPercent = dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0; return <button key={day} type="button" onClick={() => setSelectedDay(day)} className={`group rounded-[1.5rem] border p-4 text-left transition active:scale-[0.98] ${active ? `${accentClasses.bgSoft} ${accentClasses.border} ring-2 ${accentClasses.ring}` : "border-white/10 bg-black/20 hover:bg-white/10"}`}><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-black tracking-[0.2em] text-white/35">{shortDays[day]}</p><span className="font-black">{day}</span></div><span className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-black text-white/55">{done}/{dayTasks.length}</span></div><div className="mt-3 h-2 rounded-full bg-black/30 overflow-hidden"><div className={`h-full transition-all duration-300 ${accentClasses.progress}`} style={{ width: `${dayPercent}%` }} /></div></button>; })}</div></CardContent></Card>
          <Card><CardContent className="p-5 space-y-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-white/35">Hoje no board</p><h2 className="text-4xl font-black tracking-[-0.06em]">{selectedDay}</h2></div><div className={`w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest ${accentClasses.badge}`}><span className="inline-flex items-center gap-2"><Icon name="target" size={16} /> 3 quests no máx.</span></div></div><div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto]"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addTask(); }} placeholder="Nova quest..." className={`rounded-[1.4rem] bg-black/30 border border-white/10 px-4 py-3 font-bold text-white outline-none placeholder:text-white/25 focus:${accentClasses.border}`} aria-label="Nova tarefa" /><select value={newArea} onChange={(event) => setNewArea(event.target.value)} className={`rounded-[1.4rem] bg-black/30 border border-white/10 px-3 py-3 font-bold text-white outline-none focus:${accentClasses.border}`} aria-label="Área da tarefa">{areas.map((area) => <option key={area}>{area}</option>)}</select><select value={newPriority} onChange={(event) => setNewPriority(event.target.value)} className={`rounded-[1.4rem] bg-black/30 border border-white/10 px-3 py-3 font-bold text-white outline-none focus:${accentClasses.border}`} aria-label="Prioridade da tarefa">{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select><Button onClick={addTask} disabled={!newTask.trim()} className={`${accentClasses.bgButton}`}><Icon name="plus" size={18} /> Add</Button></div><div className="space-y-3">{selectedTasks.length === 0 ? <div className="rounded-[1.8rem] border border-dashed border-white/15 bg-black/20 p-8 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10"><Icon name="spark" size={24} /></div><p className="font-black text-white/75">{mode.emptyState}</p></div> : selectedTasks.map((task) => <div key={task.id} className={`rounded-[1.6rem] border p-4 transition ${task.done ? "border-emerald-300/20 bg-emerald-300/10" : "border-white/10 bg-black/25 hover:bg-white/[0.08]"}`}><div className="flex items-center gap-3"><button type="button" onClick={() => toggleTask(task.id)} className={`${task.done ? "text-emerald-200" : accentClasses.textSoft} transition active:scale-90`} aria-label={task.done ? "Marcar tarefa como pendente" : "Marcar tarefa como concluída"}>{task.done ? <Icon name="check" size={26} /> : <Icon name="circle" size={26} />}</button><div className="flex-1 min-w-0"><p className={`text-base font-black ${task.done ? "line-through text-white/35" : "text-white"}`}>{task.text}</p><div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white/10 px-3 py-1 font-black text-white/55">#{task.area}</span><span className={`rounded-full border px-3 py-1 font-black ${priorityClass[task.priority]}`}>{task.priority}</span></div></div><button type="button" onClick={() => deleteTask(task.id)} className="text-white/30 hover:text-red-200 transition" aria-label="Excluir tarefa"><Icon name="trash" size={18} /></button></div></div>)}</div></CardContent></Card>
          {!focusMode && <Card><CardContent className="p-5 space-y-4"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><Icon name="clock" size={20} className={accentClasses.textSoft} /><h2 className="text-xl font-black tracking-tight">{mode.routineTitle}</h2></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/50">flow</span></div><div className="space-y-3">{mode.timeBlocks.map((block) => <div key={block.time} className={`rounded-[1.5rem] border p-4 transition ${block.label === mode.deepBlockLabel ? `${accentClasses.badge} ring-2 ${accentClasses.ring}` : "bg-black/20 border-white/10 hover:bg-white/[0.08]"}`}><p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">{block.time}</p><h3 className="mt-1 text-lg font-black">{block.label}</h3><p className="mt-1 text-sm font-medium text-white/50">{block.description}</p></div>)}</div></CardContent></Card>}
        </main>
        {!focusMode && <Card><CardContent className="p-4 grid gap-3 md:grid-cols-4">{mode.steps.map(([label, description]) => <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"><p className="text-xs font-black uppercase tracking-[0.22em] text-white/35">{label}</p><p className="mt-1 font-black text-white/80">{description}</p></div>)}</CardContent></Card>}
      </div>
    </div>
  );
}
