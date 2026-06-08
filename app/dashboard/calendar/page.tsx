"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { useTrainingWorkspace } from "@/lib/training-platform"

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

export default function CalendarPage() {
  const { calendarEvents, state, isReady } = useTrainingWorkspace()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
      })
    }

    return days
  }, [currentDate])

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return []
    return calendarEvents.filter((event) => new Date(event.start).toDateString() === selectedDate.toDateString())
  }, [calendarEvents, selectedDate])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return calendarEvents
      .filter((event) => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6)
  }, [calendarEvents])

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter((event) => new Date(event.start).toDateString() === date.toDateString())
  }

  if (!isReady) {
    return <div className="h-[720px] rounded-3xl bg-muted animate-pulse" />
  }

  if (calendarEvents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Calendário da formação</h1>
            <p className="text-muted-foreground">O calendário será preenchido automaticamente à medida que criar formações e tarefas.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova formação
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarDays />
                </EmptyMedia>
                <EmptyTitle>Sem eventos no calendário</EmptyTitle>
                <EmptyDescription>
                  Quando criar uma ação de formação, as sessões e prazos operacionais passam a aparecer aqui automaticamente. Este ecrã serve para planear o mês e acompanhar datas críticas.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link href="/dashboard/trainings/new">Criar primeira formação</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/trainings">Abrir catálogo</Link>
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Calendario da formacao</h1>
          <p className="text-muted-foreground">Eventos reais do modulo: sessoes, prazos e tarefas criticas.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/trainings/playbook">Folha de guias</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova formacao
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
              <CardDescription>{calendarEvents.length} eventos gerados automaticamente a partir do modulo.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 pb-2">
              {DAYS.map((day) => (
                <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 border-l border-t border-border">
              {calendarDays.map((day) => {
                const events = getEventsForDate(day.date)
                return (
                  <button
                    key={day.date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    className={cn(
                      "min-h-[110px] border-b border-r border-border p-2 text-left transition-colors hover:bg-secondary/40",
                      !day.isCurrentMonth && "bg-muted/20",
                      day.isToday && "bg-primary/5",
                      selectedDate?.toDateString() === day.date.toDateString() && "ring-2 ring-primary ring-inset",
                    )}
                  >
                    <div className={cn("text-sm font-medium", !day.isCurrentMonth && "text-muted-foreground", day.isToday && "text-primary")}>
                      {day.date.getDate()}
                    </div>
                    <div className="mt-2 space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "truncate rounded px-1.5 py-0.5 text-[11px]",
                            event.type === "training" && "bg-primary/15 text-primary",
                            event.type === "deadline" && "bg-rose-100 text-rose-700",
                            event.type === "certification_expiry" && "bg-amber-100 text-amber-700",
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 3 && <div className="text-[11px] text-muted-foreground">+{events.length - 3} mais</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos do dia</CardTitle>
              <CardDescription>
                {selectedDate
                  ? selectedDate.toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })
                  : "Selecione um dia"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDayEvents.length === 0 && (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Sem eventos para esta data.
                </div>
              )}
              {selectedDayEvents.map((event) => {
                const linkedTraining = state.trainings.find((training) => training.id === event.trainingId)
                return (
                  <div key={event.id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant={event.type === "training" ? "default" : "secondary"}>
                        {event.type === "training" ? "Sessao" : "Prazo"}
                      </Badge>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(event.start).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {linkedTraining && (
                      <Button asChild variant="link" className="mt-2 h-auto px-0">
                        <Link href={`/dashboard/trainings/${linkedTraining.id}`}>Abrir formacao</Link>
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proximos eventos</CardTitle>
              <CardDescription>Resumo das proximas sessoes e tarefas do modulo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-2xl border p-3">
                  <div className={cn("mt-1 h-2.5 w-2.5 rounded-full", event.type === "training" ? "bg-primary" : "bg-rose-500")} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legenda</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary/30" />
                <span>Sessao de formacao</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-rose-200" />
                <span>Tarefa ou prazo critico</span>
              </div>
              <div className="rounded-2xl border bg-secondary/20 p-4 text-muted-foreground">
                Tudo o que cria ou duplica em <span className="font-medium text-foreground">/dashboard/trainings</span> aparece aqui automaticamente.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
