"use client"

import Link from "next/link"
import { Award, CalendarDays, FileCheck2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useTrainingWorkspace } from "@/lib/training-platform"

export default function CertificationsPage() {
  const { state, isReady } = useTrainingWorkspace()

  if (!isReady) {
    return <div className="h-[520px] rounded-3xl bg-muted animate-pulse" />
  }

  const completedTrainings = state.trainings.filter((training) => training.status === "completed").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Award className="h-7 w-7 text-primary" />
            Certificações
          </h1>
          <p className="text-muted-foreground">Área preparada para acompanhar certificados emitidos e respetivas validades.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/trainings/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova formação
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Formações concluídas" value={String(completedTrainings)} description="Base para emissão futura" icon={FileCheck2} />
        <MetricCard title="Certificados emitidos" value="0" description="Ainda sem emissões reais" icon={Award} />
        <MetricCard title="Validades monitorizadas" value="0" description="Sem renovações configuradas" icon={CalendarDays} />
      </div>

      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Award />
              </EmptyMedia>
              <EmptyTitle>Sem certificados registados</EmptyTitle>
              <EmptyDescription>
                Esta área entra em ação quando começar a concluir formações e decidir como quer emitir ou importar certificados. Para já, está pronta para receber dados reais.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="grid w-full gap-3 text-left md:grid-cols-3">
                <HelperCard
                  title="1. Crie formações"
                  description="Registe ações com datas, participantes e tarefas para começar a construir histórico."
                  href="/dashboard/trainings/new"
                  action="Criar formação"
                />
                <HelperCard
                  title="2. Marque conclusões"
                  description="Quando os participantes concluírem uma sessão, o módulo de certificações fica pronto para receber emissões."
                  href="/dashboard/trainings"
                  action="Abrir catálogo"
                />
                <HelperCard
                  title="3. Defina a política"
                  description="Pode usar esta área para emissão interna, controlo de validades ou importação de certificados externos."
                  href="/dashboard/settings"
                  action="Ver plataforma"
                />
              </div>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
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
  icon: typeof Award
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

function HelperCard({
  title,
  description,
  href,
  action,
}: {
  title: string
  description: string
  href: string
  action: string
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <Button asChild variant="link" className="mt-2 h-auto px-0">
        <Link href={href}>{action}</Link>
      </Button>
    </div>
  )
}
