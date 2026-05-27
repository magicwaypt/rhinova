"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Bot, 
  Search, 
  Send, 
  Sparkles, 
  Target, 
  Mail, 
  Calendar,
  Users,
  Zap,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  TrendingUp,
  Settings,
  RefreshCw,
  ChevronRight,
  Linkedin,
  Database,
  Brain,
  Wand2
} from "lucide-react"

const agents = [
  {
    id: "sourcing",
    name: "Sourcing Agent",
    description: "Pesquisa proativa de candidatos na base de dados e fontes externas",
    icon: Search,
    status: "active",
    color: "bg-blue-500",
    stats: {
      candidatesFound: 45,
      matchRate: "78%",
      lastRun: "há 2h"
    }
  },
  {
    id: "matching",
    name: "Matching Agent",
    description: "Análise e scoring de candidatos com base nos requisitos da vaga",
    icon: Target,
    status: "active",
    color: "bg-purple-500",
    stats: {
      analyzed: 132,
      avgScore: "82%",
      lastRun: "há 30min"
    }
  },
  {
    id: "outreach",
    name: "Outreach Agent",
    description: "Geração de mensagens personalizadas para abordagem de candidatos",
    icon: Mail,
    status: "active",
    color: "bg-green-500",
    stats: {
      messagesSent: 28,
      responseRate: "45%",
      lastRun: "há 1h"
    }
  },
  {
    id: "scheduling",
    name: "Scheduling Agent",
    description: "Coordenação automática de agendamento de entrevistas",
    icon: Calendar,
    status: "paused",
    color: "bg-amber-500",
    stats: {
      scheduled: 12,
      pending: 3,
      lastRun: "há 4h"
    }
  },
  {
    id: "research",
    name: "Research Agent",
    description: "Enriquecimento de perfis e análise de mercado",
    icon: Brain,
    status: "active",
    color: "bg-indigo-500",
    stats: {
      profilesEnriched: 89,
      dataPoints: "1.2k",
      lastRun: "há 45min"
    }
  },
]

const recentActivities = [
  {
    id: 1,
    agent: "Sourcing Agent",
    action: "Encontrou 5 candidatos para Senior Software Engineer",
    time: "há 15min",
    type: "success"
  },
  {
    id: 2,
    agent: "Outreach Agent",
    action: "Enviou mensagem personalizada para Ricardo Neves",
    time: "há 32min",
    type: "success"
  },
  {
    id: 3,
    agent: "Matching Agent",
    action: "Analisou 12 novos candidatos - 3 com score >85%",
    time: "há 1h",
    type: "info"
  },
  {
    id: 4,
    agent: "Research Agent",
    action: "Enriqueceu perfil de Bruno Costa com dados do LinkedIn",
    time: "há 1h 20min",
    type: "success"
  },
  {
    id: 5,
    agent: "Outreach Agent",
    action: "Carla Mendes respondeu à mensagem - Interessada",
    time: "há 2h",
    type: "highlight"
  },
]

const chatMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Olá! Sou o assistente de recrutamento da RHINOVA. Posso ajudar-te a encontrar candidatos, analisar perfis, ou gerar mensagens de outreach. O que precisas?",
  },
  {
    id: 2,
    role: "user", 
    content: "Preciso de encontrar candidatos para a vaga de CFO com experiência em IPO",
  },
  {
    id: 3,
    role: "assistant",
    content: "Encontrei 3 candidatos na base de dados com experiência relevante em IPO:\n\n1. **Bruno Costa** - CFO na Startup ABC, liderou IPO em 2023, 15 anos de experiência. AI Score: 95%\n\n2. **Maria Santos** - VP Finance na Tech Corp, participou em 2 IPOs, 12 anos de experiência. AI Score: 88%\n\n3. **João Ferreira** - CFO na Fintech XYZ, experiência em preparação para IPO. AI Score: 82%\n\nQueres que gere uma mensagem de outreach para algum deles?",
  },
]

export default function AIAgentsPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState(chatMessages)

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    setMessages([
      ...messages,
      { id: messages.length + 1, role: "user", content: chatInput },
      { 
        id: messages.length + 2, 
        role: "assistant", 
        content: "A processar o teu pedido... Vou analisar a base de dados e encontrar os melhores candidatos." 
      },
    ])
    setChatInput("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-7 h-7" />
            AI Agents
          </h1>
          <p className="text-muted-foreground">Agentes de IA para potenciar o seu recrutamento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configurar
          </Button>
          <Button className="gap-2">
            <Play className="w-4 h-4" />
            Executar Todos
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="chat">Chat AI</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center`}>
                        <agent.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={agent.status === "active" 
                            ? "border-green-300 text-green-600 mt-1" 
                            : "border-amber-300 text-amber-600 mt-1"
                          }
                        >
                          {agent.status === "active" ? "Ativo" : "Pausado"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {agent.status === "active" ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {Object.entries(agent.stats).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-lg font-semibold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2" size="sm">
                    <RefreshCw className="w-4 h-4" />
                    Executar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Atividade Recente dos Agentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "success" ? "bg-green-500" :
                      activity.type === "highlight" ? "bg-blue-500" : "bg-gray-400"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.agent}</span>
                        <span className="text-muted-foreground"> - {activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.type === "highlight" && (
                      <Badge className="bg-blue-100 text-blue-700">Resposta</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Candidatos Encontrados</p>
                    <p className="text-2xl font-bold text-foreground">156</p>
                    <p className="text-xs text-green-600">+23 esta semana</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                    <p className="text-2xl font-bold text-foreground">89</p>
                    <p className="text-xs text-green-600">45% taxa resposta</p>
                  </div>
                  <Mail className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Entrevistas Agendadas</p>
                    <p className="text-2xl font-bold text-foreground">34</p>
                    <p className="text-xs text-muted-foreground">8 esta semana</p>
                  </div>
                  <Calendar className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Poupado</p>
                    <p className="text-2xl font-bold text-foreground">48h</p>
                    <p className="text-xs text-muted-foreground">este mês</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat com AI de Recrutamento
              </CardTitle>
              <CardDescription>
                Converse com o assistente de IA para encontrar candidatos, gerar mensagens de outreach ou analisar perfis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-muted/30 rounded-lg">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background border"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-muted">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <Search className="w-3 h-3" />
                  Encontrar candidatos
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Wand2 className="w-3 h-3" />
                  Gerar outreach
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Target className="w-3 h-3" />
                  Analisar perfil
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Market mapping
                </Button>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Escreve a tua pergunta ou pedido..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-12 max-h-32"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} className="gap-2">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          <div className="grid gap-6">
            {/* Workflow Templates */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Workflows Automatizados</CardTitle>
                <CardDescription>
                  Configure sequências de ações automáticas dos agentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Linkedin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Executive Search Pipeline</h4>
                          <p className="text-sm text-muted-foreground">Sourcing + Research + Outreach automático</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Search className="w-4 h-4" />
                      <span>Sourcing</span>
                      <ChevronRight className="w-4 h-4" />
                      <Brain className="w-4 h-4" />
                      <span>Research</span>
                      <ChevronRight className="w-4 h-4" />
                      <Target className="w-4 h-4" />
                      <span>Matching</span>
                      <ChevronRight className="w-4 h-4" />
                      <Mail className="w-4 h-4" />
                      <span>Outreach</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">23 candidatos processados de 35 identificados</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Talent Pool Enrichment</h4>
                          <p className="text-sm text-muted-foreground">Enriquecimento automático de perfis na base de dados</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Database className="w-4 h-4" />
                      <span>Base dados</span>
                      <ChevronRight className="w-4 h-4" />
                      <Brain className="w-4 h-4" />
                      <span>Research</span>
                      <ChevronRight className="w-4 h-4" />
                      <Target className="w-4 h-4" />
                      <span>Score Update</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">178 perfis enriquecidos de 200 pendentes</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Interview Coordination</h4>
                          <p className="text-sm text-muted-foreground">Agendamento automático com candidatos e hiring managers</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">Pausado</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      Ativar Workflow
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Create New Workflow */}
            <Card className="border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-2">Criar Novo Workflow</h4>
                <p className="text-sm text-muted-foreground">
                  Configure uma nova sequência de agentes para automatizar o seu processo de recrutamento
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
