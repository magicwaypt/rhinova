"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { 
  Target,
  Plus,
  Eye,
  MoreHorizontal,
  Search,
  FileEdit,
  TrendingUp,
  CheckCircle2,
  Building,
  ArrowRight
} from "lucide-react"

// Mock data for PDI
const pdiStats = {
  pdisAtivos: 3,
  emRascunho: 1,
  progressoMedio: 50,
  concluidosAno: 8
}

const pdis = [
  {
    id: 1,
    name: "Joao Silva",
    initials: "JS",
    status: "ativo",
    currentRole: "Software Engineer",
    targetRole: "Senior Software Engineer",
    department: "Engenharia",
    period: "15/01/2025 - 31/12/2025",
    progress: 45,
    competencies: [
      { name: "Arquitetura de Software", level: 4, maxLevel: 5 },
      { name: "Lideranca Tecnica", level: 3, maxLevel: 5 },
      { name: "Comunicacao", level: 4, maxLevel: 5 }
    ],
    moreCompetencies: 1,
    objectives: [
      { name: "Dominar arquitetura de microservicos", progress: 60, color: "bg-blue-500" },
      { name: "Desenvolver skills de mentoria", progress: 40, color: "bg-amber-500" },
      { name: "Melhorar comunicacao tecnica", progress: 0, color: "bg-amber-500" }
    ]
  },
  {
    id: 2,
    name: "Ana Costa",
    initials: "AC",
    status: "ativo",
    currentRole: "Marketing Specialist",
    targetRole: "Marketing Manager",
    department: "Marketing",
    period: "01/02/2025 - 31/01/2026",
    progress: 30,
    competencies: [
      { name: "Gestao de Equipas", level: 4, maxLevel: 5 },
      { name: "Analytics", level: 3, maxLevel: 5 },
      { name: "Estrategia de Marketing", level: 5, maxLevel: 5 }
    ],
    moreCompetencies: 0,
    objectives: [
      { name: "Gestao de equipas de marketing", progress: 35, color: "bg-blue-500" },
      { name: "Analytics e data-driven marketing", progress: 0, color: "bg-slate-400" }
    ]
  },
  {
    id: 3,
    name: "Pedro Ferreira",
    initials: "PF",
    status: "ativo",
    currentRole: "IT Support Specialist",
    targetRole: "IT Team Lead",
    department: "IT",
    period: "01/09/2024 - 31/08/2025",
    progress: 75,
    competencies: [
      { name: "Cloud Computing", level: 4, maxLevel: 5 },
      { name: "Ciberseguranca", level: 4, maxLevel: 5 },
      { name: "Gestao de Projetos", level: 4, maxLevel: 5 }
    ],
    moreCompetencies: 0,
    objectives: [
      { name: "Certificacoes tecnicas", progress: 100, color: "bg-blue-500" },
      { name: "Gestao de projetos IT", progress: 60, color: "bg-blue-500" }
    ]
  },
  {
    id: 4,
    name: "Sofia Oliveira",
    initials: "SO",
    status: "rascunho",
    currentRole: "Sales Representative",
    targetRole: "Account Manager",
    department: "Vendas",
    period: "01/05/2025 - 30/04/2026",
    progress: 0,
    competencies: [],
    moreCompetencies: 0,
    objectives: []
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ativo":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Ativo</Badge>
    case "rascunho":
      return <Badge variant="secondary">Rascunho</Badge>
    case "concluido":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Concluido</Badge>
    default:
      return null
  }
}

const CompetencyBar = ({ level, maxLevel }: { level: number; maxLevel: number }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxLevel }).map((_, i) => (
        <div 
          key={i} 
          className={`w-3 h-3 rounded-sm ${i < level ? "bg-blue-500" : "bg-slate-200"}`} 
        />
      ))}
    </div>
  )
}

export default function PDIPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredPdis = pdis.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Planos de Desenvolvimento Individual</h1>
          <p className="text-muted-foreground">
            Acompanhe a evolucao de carreira e desenvolvimento de competencias
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo PDI
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PDIs Ativos</p>
                <p className="text-3xl font-bold">{pdiStats.pdisAtivos}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Rascunho</p>
                <p className="text-3xl font-bold">{pdiStats.emRascunho}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <FileEdit className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progresso Medio</p>
                <p className="text-3xl font-bold text-amber-600">{pdiStats.progressoMedio}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluidos (ano)</p>
                <p className="text-3xl font-bold text-emerald-600">{pdiStats.concluidosAno}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por nome ou funcao..." 
            className="pl-9"
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
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="concluido">Concluidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PDI cards */}
      <div className="space-y-4">
        {filteredPdis.map((pdi) => (
          <Card key={pdi.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row gap-6">
                {/* Person info */}
                <div className="flex items-start gap-4 min-w-[280px]">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {pdi.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{pdi.name}</h3>
                      {getStatusBadge(pdi.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>{pdi.currentRole}</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">{pdi.targetRole}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pdi.department} · {pdi.period}
                    </p>
                  </div>
                </div>

                {/* Progress and competencies */}
                {pdi.status !== "rascunho" && (
                  <>
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progresso Geral</span>
                        <span className="text-sm font-semibold">{pdi.progress}%</span>
                      </div>
                      <Progress value={pdi.progress} className="h-2 mb-4" />
                      
                      {/* Competencies */}
                      <div className="space-y-2">
                        {pdi.competencies.map((comp, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{comp.name}</span>
                            <CompetencyBar level={comp.level} maxLevel={comp.maxLevel} />
                          </div>
                        ))}
                        {pdi.moreCompetencies > 0 && (
                          <span className="text-xs text-muted-foreground">+{pdi.moreCompetencies} mais</span>
                        )}
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="min-w-[280px]">
                      <p className="text-sm font-medium mb-2">Objetivos ({pdi.objectives.length})</p>
                      <div className="space-y-2">
                        {pdi.objectives.map((obj, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${obj.color}`} />
                              <span className="text-muted-foreground">{obj.name}</span>
                            </div>
                            <span className="font-medium">{obj.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex items-start gap-2 ml-auto">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver PDI
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
                      <DropdownMenuItem>Arquivar</DropdownMenuItem>
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
