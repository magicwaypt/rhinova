"use client"

import Link from "next/link"
import { BookOpen, ClipboardList, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function PortalTrainingsPage() {
  return (
    <Card>
      <CardContent className="p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>Sem formações atribuídas ao portal</EmptyTitle>
            <EmptyDescription>
              Esta área mostrará as formações do colaborador quando existir um fluxo real de publicação e atribuição. Para já, o trabalho começa no dashboard da operação.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="grid w-full gap-3 text-left md:grid-cols-3">
              <HelperCard title="Criar formação" description="Registe as primeiras ações no catálogo operativo." href="/dashboard/trainings/new" action="Nova formação" icon={ClipboardList} />
              <HelperCard title="Criar colaboradores" description="Adicione pessoas para as poder associar às formações." href="/dashboard/trainings" action="Abrir módulo" icon={Users} />
              <HelperCard title="Preparar catálogo" description="Quando existirem sessões e participantes, o portal pode evoluir para consumo individual." href="/dashboard/trainings" action="Ver catálogo" icon={BookOpen} />
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}

function HelperCard({
  title,
  description,
  href,
  action,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  action: string
  icon: typeof BookOpen
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="font-medium">{title}</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild variant="link" className="mt-2 h-auto px-0">
        <Link href={href}>{action}</Link>
      </Button>
    </div>
  )
}
