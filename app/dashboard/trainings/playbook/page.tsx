"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, CalendarDays, Download, FileSpreadsheet, Sparkles, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function TrainingsPlaybookPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/trainings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Folha de guias auxiliares</h1>
            <p className="text-muted-foreground">Playbook rapido para testar o modulo de Gestao da Formacao.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Sparkles className="mr-2 h-4 w-4" />
              Criar cenario
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={collaboratorTemplatePath}>
              <Download className="mr-2 h-4 w-4" />
              Modelo Excel
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-none bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_45%,#f8fafc_100%)]">
        <CardContent className="grid gap-4 p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/10">Objetivo do teste</Badge>
            <h2 className="text-2xl font-bold">Validar que o RH consegue montar, acompanhar e reportar formacao sem trabalho manual disperso.</h2>
            <p className="text-muted-foreground">
              Este modulo foi preparado para simular o problema real dos gestores de RH: consolidar horas, participantes e evidencias para o relatorio anual de formacao.
            </p>
          </div>
          <div className="rounded-3xl border bg-white/80 p-5">
            <p className="text-sm font-semibold">Fluxo recomendado</p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>1. Criar colaboradores ou importar ficheiro modelo.</p>
              <p>2. Criar uma formacao obrigatoria com datas proximas.</p>
              <p>3. Associar utilizadores e confirmar ocupacao.</p>
              <p>4. Duplicar a sessao para testar reaproveitamento.</p>
              <p>5. Verificar calendario e checklist de tarefas.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Checklist de teste</CardTitle>
            <CardDescription>Use esta sequencia para validar o modulo ponta a ponta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {trainingTestingGuide.map((step, index) => (
              <div key={step.id} className="rounded-2xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.href && step.actionLabel && (
                      <Button asChild variant="link" className="h-auto px-0 pt-2">
                        <Link href={step.href}>{step.actionLabel}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Importacao de users</CardTitle>
              <CardDescription>Melhor sugestao para a fase atual do produto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-secondary/20 p-4">
                <p className="font-medium">Abordagem recomendada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  O modulo aceita ficheiros Excel `.xls` e `.xlsx`, alem de `csv`. Assim a equipa pode trabalhar no formato habitual e importar diretamente.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Colunas do modelo</p>
                <div className="flex flex-wrap gap-2">
                  {importColumns.map((column) => (
                    <Badge key={column} variant="secondary">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={collaboratorTemplatePath}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Descarregar modelo Excel
                </Link>
              </Button>
              <div className="rounded-2xl border bg-secondary/20 p-4 text-sm text-muted-foreground">
                As tabelas oficiais do RU são mantidas centralmente no módulo e podem ser substituídas pela tabela anual descarregada em <span className="font-medium text-foreground">relatoriounico.pt</span> sem reestruturar o frontend.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolucao sugerida</CardTitle>
              <CardDescription>Como fazer crescer o modulo depois deste MVP de teste.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {suggestions.map((suggestion) => (
                <div key={suggestion} className="rounded-2xl border p-4">
                  {suggestion}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atalhos uteis</CardTitle>
              <CardDescription>Navegacao rapida para validar os fluxos mais importantes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard/trainings">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Abrir catalogo
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/calendar">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Validar calendario
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/employees">
                  <Users className="mr-2 h-4 w-4" />
                  Ver colaboradores
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
