"use client"

import Link from "next/link"
import { Award, CalendarDays, FileCheck2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function CertificatesPage() {
  return (
    <Card>
      <CardContent className="p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Award />
            </EmptyMedia>
            <EmptyTitle>Sem certificados publicados</EmptyTitle>
            <EmptyDescription>
              Os certificados do portal aparecem quando as formações forem concluídas e a política de emissão estiver definida. Esta vista está pronta para receber esses registos reais.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="grid w-full gap-3 text-left md:grid-cols-3">
              <HelperCard title="Concluir formações" description="Marque participantes como concluídos para preparar futuras emissões." href="/dashboard/trainings" action="Abrir formações" icon={FileCheck2} />
              <HelperCard title="Configurar certificações" description="A área de certificações da operação centraliza a gestão interna." href="/dashboard/certifications" action="Abrir certificações" icon={Award} />
              <HelperCard title="Monitorizar datas" description="Quando existirem emissões, as validades podem ser acompanhadas por aqui." href="/dashboard/calendar" action="Abrir calendário" icon={CalendarDays} />
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
  icon: typeof Award
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
