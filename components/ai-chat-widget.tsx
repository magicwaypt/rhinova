"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Bot,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react"
import { trainingStatusLabels, useTrainingWorkspace } from "@/lib/training-platform"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Recommendation {
  id: string
  type: "upcoming" | "participants" | "coverage"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  href: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Ola! Sou o assistente de formacao da Rhinova. Posso ajudar-te a acompanhar sessoes agendadas, participantes, estados das formacoes e necessidades por departamento.",
    timestamp: new Date(),
  },
]

export function AIChatWidget() {
  const { state, pendingTasks } = useTrainingWorkspace()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "recommendations">("recommendations")

  const recommendations = useMemo<Recommendation[]>(() => {
    if (state.trainings.length === 0) {
      return [
        {
          id: "setup-trainings",
          type: "upcoming",
          title: "Criar a primeira formacao",
          description: "Ainda nao existem acoes registadas. Cria a primeira sessao para ativar calendario, participantes e reporting.",
          priority: "medium",
          href: "/dashboard/trainings/new",
        },
        {
          id: "setup-employees",
          type: "participants",
          title: "Preparar os participantes",
          description: "Importa ou cria colaboradores para poderes associar pessoas reais as proximas formacoes.",
          priority: "low",
          href: "/dashboard/trainings#colaboradores",
        },
      ]
    }

    const sortedTrainings = [...state.trainings].sort((left, right) => left.startDate.getTime() - right.startDate.getTime())
    const nextTraining = sortedTrainings.find((training) => training.status === "scheduled" || training.status === "in_progress")
    const totalParticipants = Object.values(state.participantsByTraining).reduce((sum, participants) => sum + participants.length, 0)
    const trainingWithMostPending = state.trainings
      .map((training) => {
        const participants = state.participantsByTraining[training.id] || []
        const pendingCount = participants.filter((participant) => participant.status !== "completed").length
        return { training, pendingCount }
      })
      .sort((left, right) => right.pendingCount - left.pendingCount)[0]

    const departmentsWithPlan = new Set(
      state.trainings.flatMap((training) =>
        training.targetDepartments?.length ? training.targetDepartments : training.department ? [training.department] : [],
      ),
    )
    const departmentsWithoutPlan = Array.from(
      new Set(
        state.employees
          .map((employee) => employee.department)
          .filter((department) => department && !departmentsWithPlan.has(department)),
      ),
    ).sort((left, right) => left.localeCompare(right, "pt"))

    const items: Recommendation[] = []

    if (nextTraining) {
      items.push({
        id: "next-training",
        type: "upcoming",
        title: `Proxima sessao: ${nextTraining.title}`,
        description: `${trainingStatusLabels[nextTraining.status]} entre ${nextTraining.startDate.toLocaleDateString("pt-PT")} e ${nextTraining.endDate.toLocaleDateString("pt-PT")} com ${nextTraining.currentParticipants}/${nextTraining.maxParticipants} participantes.`,
        priority: nextTraining.status === "in_progress" ? "high" : "medium",
        href: `/dashboard/trainings/${nextTraining.id}`,
      })
    }

    if (trainingWithMostPending && trainingWithMostPending.pendingCount > 0) {
      items.push({
        id: "participants-follow-up",
        type: "participants",
        title: "Participantes por fechar",
        description: `${trainingWithMostPending.training.title} tem ${trainingWithMostPending.pendingCount} participante(s) ainda por concluir ou validar.`,
        priority: "high",
        href: `/dashboard/trainings/${trainingWithMostPending.training.id}`,
      })
    } else {
      items.push({
        id: "participants-summary",
        type: "participants",
        title: "Cobertura de participantes",
        description: `${totalParticipants} participacao(oes) registadas em ${state.trainings.length} formacao(oes).`,
        priority: "low",
        href: "/dashboard/trainings/all",
      })
    }

    if (departmentsWithoutPlan.length > 0) {
      items.push({
        id: "department-gap",
        type: "coverage",
        title: "Departamentos sem plano",
        description: `${departmentsWithoutPlan.length} departamento(s) ainda sem formacao associada: ${departmentsWithoutPlan.slice(0, 3).join(", ")}${departmentsWithoutPlan.length > 3 ? "..." : ""}.`,
        priority: "medium",
        href: "/dashboard/trainings/all",
      })
    } else if (pendingTasks.length > 0) {
      items.push({
        id: "pending-task",
        type: "coverage",
        title: "Tarefas operacionais em aberto",
        description: `${pendingTasks.length} tarefa(s) pendente(s) no modulo de formacao. A mais proxima vence em ${pendingTasks[0].dueDate.toLocaleDateString("pt-PT")}.`,
        priority: "medium",
        href: "/dashboard/trainings",
      })
    }

    return items.slice(0, 3)
  }, [pendingTasks, state.employees, state.participantsByTraining, state.trainings])

  const handleSend = () => {
    if (!input.trim()) return

    const userInput = input
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userInput, state.trainings, state.participantsByTraining, pendingTasks),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 700)
  }

  const recommendationCount = recommendations.length

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <div className="relative">
          <Sparkles className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-accent" />
        </div>
        <span className="font-medium">IA Formacao</span>
        <Badge variant="secondary" className="bg-primary-foreground/20 text-xs text-primary-foreground">
          {recommendationCount}
        </Badge>
      </button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300",
        isExpanded ? "h-[600px] w-[500px]" : "h-[500px] w-[380px]",
      )}
    >
      <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Assistente de Formacao</h3>
            <p className="text-xs text-muted-foreground">Focado no modulo de formacao</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("recommendations")}
          className={cn(
            "relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "recommendations" ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Recomendacoes
          <Badge variant="secondary" className="ml-2 text-xs">
            {recommendationCount}
          </Badge>
          {activeTab === "recommendations" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "chat" ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Chat IA
          {activeTab === "chat" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "recommendations" ? (
          <ScrollArea className="h-full">
            <div className="space-y-3 p-4">
              {recommendations.map((rec) => {
                const Icon = getRecommendationIcon(rec.type)
                return (
                  <Link
                    key={rec.id}
                    href={rec.href}
                    className="group block rounded-xl border border-border p-3 transition-colors hover:border-primary/30 hover:bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", getRecommendationColor(rec.priority))}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 truncate text-sm font-medium">{rec.title}</h4>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                  </Link>
                )
              })}

              <div className="pt-2">
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/dashboard/trainings/all">Ver todas as formacoes</Link>
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}>
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "assistant" ? "bg-primary/10" : "bg-muted",
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5",
                        message.role === "assistant"
                          ? "rounded-tl-sm bg-muted text-foreground"
                          : "rounded-tr-sm bg-primary text-primary-foreground",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Pergunta sobre formacoes, participantes ou estados..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInput("Que formacoes estao agendadas?")}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-muted/80"
                >
                  Formacoes agendadas
                </button>
                <button
                  onClick={() => setInput("Que participantes estao por concluir?")}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-muted/80"
                >
                  Participantes por concluir
                </button>
                <button
                  onClick={() => setInput("Que departamentos ainda precisam de plano?")}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-muted/80"
                >
                  Cobertura por departamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getAIResponse(
  query: string,
  trainings: ReturnType<typeof useTrainingWorkspace>["state"]["trainings"],
  participantsByTraining: ReturnType<typeof useTrainingWorkspace>["state"]["participantsByTraining"],
  pendingTasks: ReturnType<typeof useTrainingWorkspace>["pendingTasks"],
) {
  const lowerQuery = query.toLowerCase()

  if (trainings.length === 0) {
    return "Ainda nao existem formacoes registadas. O melhor proximo passo e criar a primeira sessao e depois associar participantes e departamentos-alvo."
  }

  if (lowerQuery.includes("agendada") || lowerQuery.includes("calend") || lowerQuery.includes("proxima")) {
    const upcoming = [...trainings]
      .filter((training) => training.status === "scheduled" || training.status === "in_progress")
      .sort((left, right) => left.startDate.getTime() - right.startDate.getTime())
      .slice(0, 3)

    if (upcoming.length === 0) {
      return "Neste momento nao existem formacoes agendadas ou em curso. Posso ajudar-te a identificar o melhor momento para criar a proxima."
    }

    return `As proximas formacoes sao: ${upcoming
      .map((training) => `${training.title} (${trainingStatusLabels[training.status]}, ${training.startDate.toLocaleDateString("pt-PT")})`)
      .join("; ")}.`
  }

  if (lowerQuery.includes("particip") || lowerQuery.includes("colaborador") || lowerQuery.includes("concluir")) {
    const pendingByTraining = trainings
      .map((training) => {
        const participants = participantsByTraining[training.id] || []
        const pendingCount = participants.filter((participant) => participant.status !== "completed").length
        return { title: training.title, pendingCount }
      })
      .filter((item) => item.pendingCount > 0)
      .sort((left, right) => right.pendingCount - left.pendingCount)

    if (pendingByTraining.length === 0) {
      return "Todos os participantes registados estao marcados como concluidos ou nao existem participacoes pendentes neste momento."
    }

    return `As formacoes com mais participantes por fechar sao: ${pendingByTraining
      .slice(0, 3)
      .map((item) => `${item.title} (${item.pendingCount})`)
      .join(", ")}.`
  }

  if (lowerQuery.includes("depart") || lowerQuery.includes("plano") || lowerQuery.includes("gap")) {
    const departmentsWithPlan = new Set(
      trainings.flatMap((training) =>
        training.targetDepartments?.length ? training.targetDepartments : training.department ? [training.department] : [],
      ),
    )
    const uncovered = Array.from(
      new Set(
        Object.values(participantsByTraining)
          .flat()
          .map((participant) => participant.department)
          .filter((department) => department && !departmentsWithPlan.has(department)),
      ),
    )

    if (uncovered.length === 0) {
      return "Os departamentos com participantes registados ja estao cobertos por pelo menos uma formacao associada."
    }

    return `Ainda vejo departamentos com participacoes sem plano explicito associado: ${uncovered.join(", ")}. Podemos criar novas acoes dirigidas a essas equipas.`
  }

  if (lowerQuery.includes("estado") || lowerQuery.includes("concluida") || lowerQuery.includes("criadas")) {
    const scheduled = trainings.filter((training) => training.status === "scheduled").length
    const inProgress = trainings.filter((training) => training.status === "in_progress").length
    const completed = trainings.filter((training) => training.status === "completed").length
    const cancelled = trainings.filter((training) => training.status === "cancelled").length
    return `Temos ${trainings.length} formacao(oes): ${scheduled} agendada(s), ${inProgress} em curso, ${completed} concluida(s) e ${cancelled} cancelada(s).`
  }

  if (lowerQuery.includes("tarefa") || lowerQuery.includes("pendente")) {
    if (pendingTasks.length === 0) {
      return "Nao existem tarefas operacionais pendentes no modulo de formacao neste momento."
    }

    return `Existem ${pendingTasks.length} tarefa(s) pendente(s). A mais urgente e "${pendingTasks[0].title}", com prazo em ${pendingTasks[0].dueDate.toLocaleDateString("pt-PT")}.`
  }

  return "Posso ajudar-te com formacoes agendadas, estados, participantes por concluir, cobertura por departamento e tarefas operacionais do modulo de formacao."
}

function getRecommendationIcon(type: Recommendation["type"]) {
  switch (type) {
    case "upcoming":
      return CalendarDays
    case "participants":
      return Users
    case "coverage":
      return ClipboardList
  }
}

function getRecommendationColor(priority: Recommendation["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-500"
    case "medium":
      return "bg-amber-50 text-amber-500"
    case "low":
      return "bg-emerald-50 text-emerald-500"
  }
}
