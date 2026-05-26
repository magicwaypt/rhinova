"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  GraduationCap,
  Award,
  Clock,
  AlertTriangle
} from "lucide-react"
import { trainings, calendarEvents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: typeof calendarEvents
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dayEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.start)
        return eventDate.toDateString() === date.toDateString()
      })
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        events: dayEvents
      })
    }
    
    return days
  }, [currentDate])

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const selectedDayEvents = selectedDate 
    ? calendarEvents.filter(event => {
        const eventDate = new Date(event.start)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    : []

  const upcomingEvents = calendarEvents
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">
            Visualize todas as formacoes e prazos
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={view} onValueChange={(v: "month" | "week") => setView(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 border-t border-l border-border">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] p-2 border-r border-b border-border cursor-pointer transition-colors hover:bg-secondary/50",
                    !day.isCurrentMonth && "bg-muted/30",
                    day.isToday && "bg-primary/5",
                    selectedDate?.toDateString() === day.date.toDateString() && "ring-2 ring-primary ring-inset"
                  )}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className={cn(
                    "text-sm font-medium mb-1",
                    !day.isCurrentMonth && "text-muted-foreground",
                    day.isToday && "text-primary"
                  )}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.events.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded truncate",
                          event.type === "training" && "bg-primary/20 text-primary",
                          event.type === "certification_expiry" && "bg-warning/20 text-warning-foreground",
                          event.type === "deadline" && "bg-destructive/20 text-destructive"
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{day.events.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-primary/20" />
                <span>Formacao</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-warning/20" />
                <span>Certificacao a Expirar</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-destructive/20" />
                <span>Prazo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected day details */}
          {selectedDate && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('pt-PT', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sem eventos neste dia
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((event, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          {event.type === "training" && (
                            <GraduationCap className="w-4 h-4 text-primary" />
                          )}
                          {event.type === "certification_expiry" && (
                            <Award className="w-4 h-4 text-warning" />
                          )}
                          {event.type === "deadline" && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                          <span className="font-medium text-sm">{event.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.start).toLocaleTimeString('pt-PT', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {event.end && (
                            <span>
                              {" - "}
                              {new Date(event.end).toLocaleTimeString('pt-PT', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Proximos Eventos</CardTitle>
              <CardDescription>Os proximos 5 eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      event.type === "training" && "bg-primary",
                      event.type === "certification_expiry" && "bg-warning",
                      event.type === "deadline" && "bg-destructive"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.start).toLocaleDateString('pt-PT', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Este Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">
                    {trainings.filter(t => {
                      const date = new Date(t.startDate)
                      return date.getMonth() === currentDate.getMonth() &&
                             date.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Formacoes</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-warning/10">
                  <div className="text-2xl font-bold text-warning">3</div>
                  <div className="text-xs text-muted-foreground">Expiracoes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
