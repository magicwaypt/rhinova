"use client"

import { useState } from "react"
import {
  BookOpen,
  Clock,
  PlayCircle,
  CheckCircle2,
  Filter,
  Search,
  Calendar,
  Award,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const trainings = [
  {
    id: 1,
    title: "Segurança no Trabalho - Módulo Avançado",
    description: "Formação avançada sobre práticas de segurança e prevenção de acidentes no local de trabalho.",
    category: "Obrigatória",
    progress: 75,
    deadline: "15 Abr 2026",
    totalHours: 8,
    completedHours: 6,
    modules: 12,
    completedModules: 9,
    status: "in-progress",
    instructor: "Dr. Manuel Costa",
  },
  {
    id: 2,
    title: "Excel Avançado para Análise de Dados",
    description: "Domine fórmulas avançadas, tabelas dinâmicas e visualização de dados no Excel.",
    category: "Desenvolvimento",
    progress: 45,
    deadline: "30 Abr 2026",
    totalHours: 16,
    completedHours: 7,
    modules: 20,
    completedModules: 9,
    status: "in-progress",
    instructor: "Eng. Ana Rodrigues",
  },
  {
    id: 3,
    title: "Comunicação Eficaz",
    description: "Desenvolva competências de comunicação verbal e escrita para o ambiente profissional.",
    category: "Soft Skills",
    progress: 20,
    deadline: "20 Mai 2026",
    totalHours: 6,
    completedHours: 1,
    modules: 8,
    completedModules: 2,
    status: "in-progress",
    instructor: "Dra. Sofia Mendes",
  },
  {
    id: 4,
    title: "RGPD e Proteção de Dados",
    description: "Compreenda as normas de proteção de dados e como aplicá-las no dia-a-dia.",
    category: "Obrigatória",
    progress: 100,
    deadline: "15 Fev 2026",
    totalHours: 4,
    completedHours: 4,
    modules: 6,
    completedModules: 6,
    status: "completed",
    instructor: "Dr. Pedro Almeida",
    certificate: true,
  },
  {
    id: 5,
    title: "Segurança no Trabalho - Básico",
    description: "Fundamentos essenciais de segurança no trabalho para todos os colaboradores.",
    category: "Obrigatória",
    progress: 100,
    deadline: "20 Mar 2026",
    totalHours: 6,
    completedHours: 6,
    modules: 8,
    completedModules: 8,
    status: "completed",
    instructor: "Dr. Manuel Costa",
    certificate: true,
  },
]

const availableTrainings = [
  {
    id: 101,
    title: "Liderança e Gestão de Equipas",
    description: "Desenvolva competências de liderança para gerir equipas de alto desempenho.",
    category: "Desenvolvimento",
    totalHours: 12,
    modules: 15,
    instructor: "Dr. Ricardo Ferreira",
    rating: 4.8,
    enrolled: 234,
  },
  {
    id: 102,
    title: "Primeiros Socorros",
    description: "Aprenda técnicas essenciais de primeiros socorros para emergências.",
    category: "Obrigatória",
    totalHours: 4,
    modules: 5,
    instructor: "Dra. Carla Santos",
    rating: 4.9,
    enrolled: 567,
  },
  {
    id: 103,
    title: "Gestão do Tempo e Produtividade",
    description: "Técnicas e ferramentas para maximizar a sua produtividade diária.",
    category: "Soft Skills",
    totalHours: 3,
    modules: 4,
    instructor: "Dra. Sofia Mendes",
    rating: 4.7,
    enrolled: 189,
  },
]

export default function PortalTrainingsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const inProgressTrainings = trainings.filter((t) => t.status === "in-progress")
  const completedTrainings = trainings.filter((t) => t.status === "completed")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minhas Formações</h1>
        <p className="mt-1 text-muted-foreground">
          Acompanha o teu progresso e continua a aprender
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar formações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="in-progress" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Em Progresso ({inProgressTrainings.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Concluídas ({completedTrainings.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Disponíveis ({availableTrainings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTrainings.map((training) => (
            <Card
              key={training.id}
              className="border-border/50 bg-card/50 transition-all hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {training.title}
                        </h3>
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
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {training.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {training.completedHours}h / {training.totalHours}h
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {training.completedModules} / {training.modules} módulos
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Prazo: {training.deadline}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold text-foreground">
                          {training.progress}%
                        </span>
                      </div>
                      <Progress value={training.progress} className="h-2" />
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 lg:flex-col">
                    <Button className="flex-1 lg:flex-none">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Continuar
                    </Button>
                    <Button variant="outline" className="flex-1 lg:flex-none">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTrainings.map((training) => (
            <Card
              key={training.id}
              className="border-border/50 bg-card/50 transition-all hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <h3 className="text-lg font-semibold text-foreground">
                        {training.title}
                      </h3>
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
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {training.totalHours}h concluídas
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {training.modules} módulos
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Concluída em {training.deadline}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {training.certificate && (
                      <Button variant="outline">
                        <Award className="mr-2 h-4 w-4" />
                        Ver Certificado
                      </Button>
                    )}
                    <Button variant="ghost">Rever Conteúdo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTrainings.map((training) => (
              <Card
                key={training.id}
                className="border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div>
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
                      <h3 className="mt-3 font-semibold text-foreground">
                        {training.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {training.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {training.totalHours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {training.modules} módulos
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(training.rating)
                                  ? "text-amber-400"
                                  : "text-muted"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs">{training.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {training.enrolled} inscritos
                      </span>
                    </div>

                    <Button className="w-full">Inscrever-me</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
