"use client"

import Link from "next/link"
import { Award, BookOpen, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function PortalPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpen />
              </EmptyMedia>
              <EmptyTitle>Portal do colaborador sem dados</EmptyTitle>
              <EmptyDescription>
                O portal fica disponível quando existir um fluxo real de inscrição, progresso e certificados para os colaboradores. Nesta fase, a configuração principal começa no dashboard de administração e formação.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="grid w-full gap-3 text-left md:grid-cols-3">
                <HelperCard
                  title="Catálogo"
                  description="As formações criadas no dashboard podem mais tarde alimentar o catálogo do portal."
                  href="/dashboard/trainings"
                  action="Abrir formações"
                  icon={BookOpen}
                />
                <HelperCard
                  title="Calendário"
                  description="Quando houver sessões planeadas, o colaborador poderá acompanhar datas importantes aqui."
                  href="/dashboard/calendar"
                  action="Abrir calendário"
                  icon={CalendarDays}
                />
                <HelperCard
                  title="Certificados"
                  description="Os certificados do portal dependem da conclusão de formações e da política de emissão."
                  href="/dashboard/certifications"
                  action="Abrir certificações"
                  icon={Award}
                />
              </div>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
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
