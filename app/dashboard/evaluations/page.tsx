"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus,
  Play,
  Eye,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Search,
  Send,
  FileText
} from "lucide-react"

// Mock data for evaluations
const evaluationStats = {
  ciclosAtivos: 1,
  emRevisao: 1,
  avaliacoesPendentes: 61,
  ciclosConcluidos: 1
}

const evaluationCycles = [
  {
    id: 1,
    name: "Avaliacao Anual 2025",
    status: "em_curso",
    type: "360",
    period: "01/03/2025 - 15/04/2025",
    reviewDate: "30/04/2025",
    progress: 59,
    completed: 89,
    total: 150,
    canSendReminder: true
  },
  {
    id: 2,
    name: "Avaliacao Q1 Engenharia",
    status: "em_revisao",
    type: "Performance",
    period: "15/03/2025 - 01/04/2025",
    reviewDate: "10/04/2025",
    progress: 100,
    completed: 45,
    total: 45,
    canSendReminder: false
  },
  {
    id: 3,
    name: "Feedback Semestral 2024",
    status: "concluido",
    type: "360",
    period: "01/10/2024 - 15/11/2024",
    reviewDate: "30/11/2024",
    progress: 100,
    completed: 142,
    total: 142,
    canSendReminder: false
  },
  {
    id: 4,
    name: "Avaliacao Probatorio - Novos",
    status: "rascunho",
    type: "Gestor",
    period: "01/05/2025 - 15/05/2025",
    reviewDate: "20/05/2025",
    progress: 0,
    completed: 0,
    total: 8,
    canSendReminder: false
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "em_curso":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Play className="w-3 h-3 mr-1" /> Em Curso</Badge>
    case "em_revisao":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><Eye className="w-3 h-3 mr-1" /> Em Revisao</Badge>
    case "concluido":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Concluido</Badge>
    case "rascunho":
      return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" /> Rascunho</Badge>
    default:
      return null
  }
}

const getTypeBadge = (type: string) => {
  return <Badge variant="outline">{type}</Badge>
}

export default function EvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredCycles = evaluationCycles.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Avaliacoes 360</h1>
          <p className="text-muted-foreground">
            Ciclos de avaliacao e feedback continuo
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ciclo
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ciclos Ativos</p>
                <p className="text-3xl font-bold">{evaluationStats.ciclosAtivos}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Revisao</p>
                <p className="text-3xl font-bold">{evaluationStats.emRevisao}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Eye className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avaliacoes Pendentes</p>
                <p className="text-3xl font-bold text-amber-600">{evaluationStats.avaliacoesPendentes}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ciclos Concluidos</p>
                <p className="text-3xl font-bold text-emerald-600">{evaluationStats.ciclosConcluidos}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="ciclos" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="ciclos">Ciclos de Avaliacao</TabsTrigger>
            <TabsTrigger value="resultados">Resultados Individuais</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar..." 
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="em_curso">Em Curso</SelectItem>
              <SelectItem value="em_revisao">Em Revisao</SelectItem>
              <SelectItem value="concluido">Concluidos</SelectItem>
              <SelectItem value="rascunho">Rascunhos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Evaluation cycles */}
      <div className="space-y-4">
        {filteredCycles.map((cycle) => (
          <Card key={cycle.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Cycle info */}
                <div className="min-w-[300px]">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{cycle.name}</h3>
                    {getStatusBadge(cycle.status)}
                    {getTypeBadge(cycle.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cycle.period} · Revisao ate {cycle.reviewDate}
                  </p>
                </div>

                {/* Progress */}
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-semibold">{cycle.completed}/{cycle.total}</span>
                  </div>
                  <Progress value={cycle.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {cycle.progress}% concluido
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {cycle.canSendReminder && (
                    <Button variant="outline" size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Lembrete
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    {cycle.status === "concluido" ? "Ver Resultados" : "Ver Detalhes"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Exportar Relatorio</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar Ciclo</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
