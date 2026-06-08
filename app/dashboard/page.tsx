"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Building2, CalendarDays, Plus, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useAccessManagement } from "@/components/providers/access-management-provider"
import { useTrainingWorkspace } from "@/lib/training-platform"

export default function DashboardPage() {
  const { currentUser, currentUserEntities, isReady: accessReady, isSuperAdmin, state: accessState } = useAccessManagement()
  const { state: trainingState, isReady: trainingReady, pendingTasks } = useTrainingWorkspace()

  if (!accessReady || !trainingReady) {
    return <div className="h-[520px] rounded-3xl bg-muted animate-pulse" />
  }

  const hasPlatformData = accessState.entities.length > 0 || accessState.users.length > 1
  const hasTrainingData = trainingState.trainings.length > 0 || trainingState.employees.length > 0

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#dbeafe_100%)] text-white">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Rhinova</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Plataforma pronta para configurar, sem dados demo.</h1>
            <p className="text-sm text-white/80 sm:text-base">
              {isSuperAdmin
                ? "Comece por criar a sua primeira entidade, configurar utilizadores e montar as primeiras ações de formação. A plataforma mostra conteúdo real à medida que o vai introduzindo."
                : `Está a entrar como ${currentUser?.name || "utilizador"} com acesso operacional. Aqui vê apenas o contexto real da(s) entidade(s) a que está associado.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isSuperAdmin && (
              <Button asChild className="bg-white text-slate-900 hover:bg-white/90">
                <Link href="/dashboard/settings">
                  <Shield className="mr-2 h-4 w-4" />
                  Configurar plataforma
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
              <Link href="/dashboard/trainings/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar formação
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Entidades" value={String(accessState.entities.length)} description="Tenants configurados" icon={Building2} />
        <MetricCard title={isSuperAdmin ? "Users" : "Entidades acessíveis"} value={String(isSuperAdmin ? accessState.users.length : currentUserEntities.length)} description={isSuperAdmin ? "Acessos de plataforma" : "Âmbito do seu acesso"} icon={Users} />
        <MetricCard title="Formações" value={String(trainingState.trainings.length)} description="Ações registadas" icon={BookOpen} />
        <MetricCard title="Tarefas pendentes" value={String(pendingTasks.length)} description="Acompanhar execução" icon={CalendarDays} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isSuperAdmin ? "Configuração da plataforma" : "O meu contexto"}</CardTitle>
            <CardDescription>{isSuperAdmin ? "Base multi-tenant, acessos e governação." : "Resumo do acesso disponível para a sua sessão."}</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuperAdmin && !hasPlatformData ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Shield />
                  </EmptyMedia>
                  <EmptyTitle>Sem estrutura inicial</EmptyTitle>
                  <EmptyDescription>
                    Para começar, crie a primeira entidade e depois adicione os utilizadores que a vão gerir. Cada user pode ter permissões diferentes por entidade.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild>
                    <Link href="/dashboard/settings">
                      Abrir administração
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : isSuperAdmin ? (
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border p-4">
                  <p className="font-medium">{accessState.entities.length} entidade(s) pronta(s)</p>
                  <p className="mt-1 text-muted-foreground">Use a área de administração para editar tenants, definir passwords e ajustar memberships.</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/settings">Gerir entidades e users</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border p-4">
                  <p className="font-medium">{currentUserEntities.length} entidade(s) acessível(eis)</p>
                  <p className="mt-1 text-muted-foreground">
                    A sua sessão está focada na operação. As opções de administração global continuam reservadas ao super admin.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/trainings">Abrir operação de formação</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operação de formação</CardTitle>
            <CardDescription>Catálogo, sessões, calendário e reporting.</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasTrainingData ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BookOpen />
                  </EmptyMedia>
                  <EmptyTitle>Sem ações de formação</EmptyTitle>
                  <EmptyDescription>
                    Crie a primeira formação para começar a usar o catálogo, preencher o calendário e acompanhar participantes e tarefas.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button asChild>
                      <Link href="/dashboard/trainings/new">Criar formação</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/trainings">Ver módulo de formação</Link>
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border p-4">
                  <p className="font-medium">{trainingState.trainings.length} formação(ões) criada(s)</p>
                  <p className="mt-1 text-muted-foreground">{trainingState.employees.length} colaborador(es) e {pendingTasks.length} tarefa(s) pendente(s) no workspace.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/trainings">Abrir catálogo</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/calendar">Abrir calendário</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: typeof Building2
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
