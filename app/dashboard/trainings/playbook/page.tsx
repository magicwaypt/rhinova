"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Download,
  FileSpreadsheet,
  ListChecks,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { collaboratorTemplatePath, trainingTestingGuide } from "@/lib/training-platform"

const importColumns = [
  "nome_completo",
  "email",
  "departamento",
  "funcao",
  "numero_colaborador",
  "data_admissao",
  "manager",
  "localizacao",
  "horas_formacao_ano",
]

const suggestions = [
  "Aceitar ficheiros Excel (.xls e .xlsx) reduz a friccao para equipas de RH que ja trabalham em folhas partilhadas.",
  "O passo seguinte pode ser mostrar preview das linhas e validar colunas antes de confirmar a importacao.",
  "Depois ligar a importacao a integracoes HRIS, para sincronizar colaboradores sem ficheiros manuais.",
]

const recommendedFlow = [
  "Criar colaboradores ou importar ficheiro modelo.",
  "Criar uma formacao obrigatoria com datas proximas.",
  "Associar utilizadores e confirmar ocupacao.",
  "Duplicar a sessao para testar reaproveitamento.",
  "Verificar calendario e checklist de tarefas.",
]

const PLAYBOOK_STORAGE_KEY = "rhinova-training-playbook-progress-v1"

export default function TrainingsPlaybookPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PLAYBOOK_STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw) as Record<string, boolean>
      setCompleted(parsed)
    } catch {
      window.localStorage.removeItem(PLAYBOOK_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(PLAYBOOK_STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const totalSteps = trainingTestingGuide.length
  const completedCount = useMemo(
    () => trainingTestingGuide.filter((step) => completed[step.id]).length,
    [completed],
  )
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0
  const allDone = totalSteps > 0 && completedCount === totalSteps

  function toggleStep(id: string) {
    setCompleted((previous) => ({ ...previous, [id]: !previous[id] }))
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="rounded-full" asChild>
        <Link href="/dashboard/trainings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao catálogo
        </Link>
      </Button>

      {/* Hero */}
      <Card className="relative overflow-hidden border-none bg-mesh-brand text-white shadow-soft-lg">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.18]" />
        <CardContent className="relative grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="space-y-4">
            <Badge className="w-fit border border-white/25 bg-white/15 text-white hover:bg-white/20">
              Guia de testes
            </Badge>
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Valide o módulo de formação ponta a ponta.
              </h1>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
                Siga a checklist interativa para confirmar que o RH consegue montar, acompanhar e reportar formação sem
                trabalho manual disperso.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-white text-primary shadow-soft hover:bg-white/90">
                <Link href="/dashboard/trainings/new">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Criar cenário
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href={collaboratorTemplatePath}>
                  <Download className="mr-2 h-4 w-4" />
                  Modelo Excel
                </Link>
              </Button>
            </div>
          </div>

          {/* Progress panel */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-white/65">Progresso da validação</p>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                {completedCount}/{totalSteps}
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold tracking-tight">{progress}%</p>
            <Progress value={progress} className="mt-3 h-2 bg-white/20 [&>div]:bg-white" />
            <p className="mt-3 text-sm text-white/75">
              {allDone
                ? "Tudo validado. O módulo está pronto para demonstração."
                : "Marque cada passo da checklist à medida que o vai testando."}
            </p>
            <div className="mt-4 space-y-1.5 border-t border-white/15 pt-4 text-sm text-white/80">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">Fluxo recomendado</p>
              {recommendedFlow.map((item, index) => (
                <p key={item} className="flex gap-2">
                  <span className="text-white/55">{index + 1}.</span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Interactive checklist */}
        <Card className="overflow-hidden shadow-soft">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-soft">
                  <ListChecks className="h-4 w-4" />
                </div>
                <CardTitle>Checklist de teste</CardTitle>
              </div>
              <CardDescription>Toque em cada passo para o marcar como validado.</CardDescription>
            </div>
            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground"
                onClick={() => {
                  setCompleted({})
                  window.localStorage.removeItem(PLAYBOOK_STORAGE_KEY)
                }}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Repor
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {trainingTestingGuide.map((step, index) => {
              const isDone = Boolean(completed[step.id])
              return (
                <div
                  key={step.id}
                  className={cn(
                    "group rounded-2xl border p-4 transition-all",
                    isDone
                      ? "border-primary/30 bg-primary/[0.04] shadow-soft"
                      : "bg-card hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      aria-pressed={isDone}
                      aria-label={isDone ? `Marcar "${step.title}" como por validar` : `Marcar "${step.title}" como validado`}
                      onClick={() => toggleStep(step.id)}
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-transparent hover:border-primary/60",
                      )}
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Passo {index + 1}</span>
                        {isDone && (
                          <Badge variant="secondary" className="h-5 bg-primary/10 px-2 text-[11px] text-primary hover:bg-primary/10">
                            Validado
                          </Badge>
                        )}
                      </div>
                      <p className={cn("mt-1 font-medium", isDone && "text-muted-foreground line-through decoration-primary/40")}>
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      {step.href && step.actionLabel && (
                        <Button asChild variant="link" className="h-auto px-0 pt-2">
                          <Link href={step.href}>{step.actionLabel}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Importação de users</CardTitle>
              <CardDescription>Melhor sugestão para a fase atual do produto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-4">
                <p className="font-medium text-foreground">Abordagem recomendada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  O módulo aceita ficheiros Excel <span className="font-medium text-foreground">.xls</span> e{" "}
                  <span className="font-medium text-foreground">.xlsx</span>, além de{" "}
                  <span className="font-medium text-foreground">.csv</span>. Assim a equipa pode trabalhar no formato
                  habitual e importar diretamente.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Colunas do modelo</p>
                <div className="flex flex-wrap gap-2">
                  {importColumns.map((column) => (
                    <Badge key={column} variant="secondary" className="font-mono text-[11px]">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href={collaboratorTemplatePath}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Descarregar modelo Excel
                </Link>
              </Button>
              <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                As tabelas oficiais do RU são mantidas centralmente no módulo e podem ser substituídas pela tabela anual
                descarregada em <span className="font-medium text-foreground">relatoriounico.pt</span> sem reestruturar o
                frontend.
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <CardTitle>Evolução sugerida</CardTitle>
              </div>
              <CardDescription>Como fazer crescer o módulo depois deste MVP de teste.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={suggestion} className="flex gap-3 rounded-2xl border p-4 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                    {index + 1}
                  </span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Atalhos úteis</CardTitle>
              <CardDescription>Navegação rápida para validar os fluxos mais importantes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4">
                <Link href="/dashboard/trainings">
                  <BookOpen className="h-5 w-5" />
                  Catálogo
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4">
                <Link href="/dashboard/calendar">
                  <CalendarDays className="h-5 w-5" />
                  Calendário
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4">
                <Link href="/dashboard/employees">
                  <Users className="h-5 w-5" />
                  Colaboradores
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
