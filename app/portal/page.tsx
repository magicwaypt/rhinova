"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  Target,
  Flame,
  Star,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const stats = [
  {
    title: "Formações Ativas",
    value: "3",
    icon: BookOpen,
    trend: "+1 este mês",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Certificados",
    value: "8",
    icon: Award,
    trend: "2 pendentes",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Horas Concluídas",
    value: "124",
    icon: Clock,
    trend: "+16h este mês",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Taxa de Conclusão",
    value: "94%",
    icon: TrendingUp,
    trend: "Excelente",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
]

const activeTrainings = [
  {
    id: 1,
    title: "Segurança no Trabalho - Módulo Avançado",
    category: "Obrigatória",
    progress: 75,
    deadline: "15 Abr 2026",
    totalHours: 8,
    completedHours: 6,
    status: "in-progress",
  },
  {
    id: 2,
    title: "Excel Avançado para Análise de Dados",
    category: "Desenvolvimento",
    progress: 45,
    deadline: "30 Abr 2026",
    totalHours: 16,
    completedHours: 7,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Comunicação Eficaz",
    category: "Soft Skills",
    progress: 20,
    deadline: "20 Mai 2026",
    totalHours: 6,
    completedHours: 1,
    status: "in-progress",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Workshop: Liderança Colaborativa",
    date: "8 Abr",
    time: "14:00 - 17:00",
    type: "Presencial",
    location: "Sala de Formação A",
  },
  {
    id: 2,
    title: "Webinar: Novas Normas RGPD",
    date: "12 Abr",
    time: "10:00 - 11:30",
    type: "Online",
    location: "Microsoft Teams",
  },
  {
    id: 3,
    title: "Formação: Primeiros Socorros",
    date: "22 Abr",
    time: "09:00 - 13:00",
    type: "Presencial",
    location: "Centro de Formação",
  },
]

const achievements = [
  { id: 1, title: "Primeiro Certificado", icon: Award, unlocked: true },
  { id: 2, title: "5 Formações Concluídas", icon: Target, unlocked: true },
  { id: 3, title: "100 Horas de Formação", icon: Clock, unlocked: true },
  { id: 4, title: "Sequência de 30 Dias", icon: Flame, unlocked: false },
  { id: 5, title: "Top Performer", icon: Star, unlocked: false },
]

const recentCertificates = [
  {
    id: 1,
    title: "Segurança no Trabalho - Básico",
    issueDate: "20 Mar 2026",
    expiryDate: "20 Mar 2027",
  },
  {
    id: 2,
    title: "RGPD e Proteção de Dados",
    issueDate: "15 Fev 2026",
    expiryDate: "15 Fev 2028",
  },
]

export default function PortalPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src="/avatars/employee.jpg" />
            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              JS
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Olá, João!
            </h1>
            <p className="text-muted-foreground">
              Continua o teu percurso de aprendizagem. Tens 3 formações em progresso.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2">
            <Flame className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-amber-500">12 dias</span>
            <span className="text-sm text-muted-foreground">em sequência</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
              <p className={`mt-2 text-xs ${stat.color}`}>{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Trainings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Formações em Progresso
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/trainings">
                Ver todas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {activeTrainings.map((training) => (
              <Card
                key={training.id}
                className="border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {training.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={
                                training.category === "Obrigatória"
                                  ? "bg-red-500/10 text-red-500"
                                  : training.category === "Desenvolvimento"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-purple-500/10 text-purple-500"
                              }
                            >
                              {training.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Prazo: {training.deadline}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" className="shrink-0">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continuar
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {training.completedHours}h de {training.totalHours}h
                            concluídas
                          </span>
                          <span className="font-medium text-foreground">
                            {training.progress}%
                          </span>
                        </div>
                        <Progress value={training.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Próximos Eventos</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/calendar">
                    <Calendar className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xs font-medium text-primary">
                      {event.date.split(" ")[1]}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {event.date.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground text-sm">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-xs ${
                        event.type === "Online"
                          ? "border-emerald-500/30 text-emerald-500"
                          : "border-primary/30 text-primary"
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Conquistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      achievement.unlocked
                        ? "bg-primary/10"
                        : "bg-muted opacity-40"
                    }`}
                    title={achievement.title}
                  >
                    <achievement.icon
                      className={`h-5 w-5 ${
                        achievement.unlocked ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                3 de 5 conquistas desbloqueadas
              </p>
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Certificados Recentes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/certificates">
                    <Award className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {cert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Válido até {cert.expiryDate}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
