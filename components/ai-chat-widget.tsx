"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Minimize2,
  Maximize2
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Recommendation {
  id: string
  type: "promotion" | "risk" | "training"
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "risk",
    title: "Miguel Santos - Risco Elevado",
    description: "Score de retencao critico (70%). Burnout elevado e 3 anos sem promocao.",
    priority: "high"
  },
  {
    id: "2",
    type: "promotion",
    title: "Joao Silva - Pronto para Promocao",
    description: "Todas as competencias para Coordenador. 4 formacoes concluidas.",
    priority: "medium"
  },
  {
    id: "3",
    type: "training",
    title: "Gap de Competencias - Equipa IT",
    description: "5 colaboradores necessitam certificacao em Cloud Computing.",
    priority: "medium"
  }
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Ola! Sou o assistente IA da Rhinova. Posso ajudar-te a analisar dados de colaboradores, identificar riscos de retencao, ou sugerir candidatos para posicoes. Como posso ajudar?",
    timestamp: new Date()
  }
]

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "recommendations">("recommendations")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("risco") || lowerQuery.includes("retencao")) {
      return "Identifiquei 4 colaboradores em risco critico de saida nos proximos 6 meses. O principal fator e a falta de promocao (3+ anos). Recomendo agendar conversas de carreira com: Miguel Santos, Ana Costa, Pedro Ferreira e Bruno Costa."
    }
    if (lowerQuery.includes("candidato") || lowerQuery.includes("vaga")) {
      return "Para a vaga de Senior Developer, encontrei 3 candidatos com match superior a 85%: Ricardo Neves (92%), Sofia Oliveira (88%) e Tomas Ferreira (85%). Queres que prepare um resumo comparativo?"
    }
    if (lowerQuery.includes("formacao") || lowerQuery.includes("training")) {
      return "A analise de gaps de competencias mostra que 12 colaboradores necessitam de formacao em metodologias ageis e 8 em lideranca. Posso criar um plano de formacao automatico?"
    }
    return "Posso ajudar-te com analise de risco de retencao, matching de candidatos, planos de sucessao, ou recomendacoes de formacao. O que gostarias de explorar?"
  }

  const getRecommendationIcon = (type: Recommendation["type"]) => {
    switch (type) {
      case "risk": return AlertTriangle
      case "promotion": return TrendingUp
      case "training": return UserCheck
    }
  }

  const getRecommendationColor = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-50"
      case "medium": return "text-amber-500 bg-amber-50"
      case "low": return "text-emerald-500 bg-emerald-50"
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="font-medium">IA Ativa</span>
        <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs">
          3
        </Badge>
      </button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 bg-background border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300",
        isExpanded ? "w-[500px] h-[600px]" : "w-[380px] h-[500px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistente IA</h3>
            <p className="text-xs text-muted-foreground">Sempre disponivel</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("recommendations")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "recommendations"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Recomendacoes
          <Badge variant="secondary" className="ml-2 text-xs">3</Badge>
          {activeTab === "recommendations" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "chat"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Chat IA
          {activeTab === "chat" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "recommendations" ? (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {mockRecommendations.map((rec) => {
                const Icon = getRecommendationIcon(rec.type)
                return (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        getRecommendationColor(rec.priority)
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{rec.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {rec.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                )
              })}

              <div className="pt-2">
                <Button variant="outline" className="w-full" size="sm">
                  Ver todas as recomendacoes
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      message.role === "assistant" 
                        ? "bg-primary/10" 
                        : "bg-muted"
                    )}>
                      {message.role === "assistant" ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === "assistant"
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    )}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Faz uma pergunta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setInput("Quais colaboradores estao em risco de saida?")}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  Risco de saida
                </button>
                <button
                  onClick={() => setInput("Encontra candidatos para a vaga aberta")}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  Match candidatos
                </button>
                <button
                  onClick={() => setInput("Analisa gaps de formacao")}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  Gaps formacao
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
