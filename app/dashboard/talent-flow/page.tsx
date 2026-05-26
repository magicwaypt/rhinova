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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  RefreshCw,
  Download,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Target,
  Sparkles,
  Eye,
  Search,
  ArrowRight,
  UserPlus,
  ChevronRight
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts"

// Mock data for Talent Flow
const talentFlowStats = {
  prontoPromocao: 12,
  riscoSaida: 8,
  riscoBurnout: 5,
  gapsSucessao: 3,
  promocoes6M: 6,
  reformas12M: 7
}

const proactiveAlerts = [
  {
    id: 1,
    name: "Miguel Santos",
    title: "Risco Elevado de Saida",
    description: "Score de retencao critico (70%). Burnout elevado e...",
    recommendation: "Intervencao imediata necessaria",
    type: "critical",
    color: "bg-red-500"
  },
  {
    id: 2,
    name: "Fisica Secundario",
    title: "Sem Sucessor Pronto",
    description: "Pedro Ferreira reforma em 2 anos. Unico sucessor...",
    recommendation: "Iniciar recrutamento ou acelerar d...",
    type: "warning",
    color: "bg-amber-500"
  },
  {
    id: 3,
    name: "Ana Costa",
    title: "Sinais de Burnout",
    description: "Estagnacao de 3 anos, reducao de formacoes,...",
    recommendation: "Agendar conversa e considerar ro...",
    type: "warning",
    color: "bg-amber-500"
  },
  {
    id: 4,
    name: "Joao Silva",
    title: "Pronto para Promocao",
    description: "Todas as competencias para Coordenador. 4 formacoes,...",
    recommendation: "Avaliar oportunidade de promocao",
    type: "success",
    color: "bg-emerald-500"
  }
]

const movementForecast = [
  { month: "Mai", promocoes: 1, saidas: 1, reformas: 0 },
  { month: "Jun", promocoes: 2, saidas: 1, reformas: 0 },
  { month: "Jul", promocoes: 1, saidas: 1, reformas: 1 },
  { month: "Ago", promocoes: 1, saidas: 1, reformas: 0 },
  { month: "Set", promocoes: 1, saidas: 1, reformas: 1 },
  { month: "Out", promocoes: 0, saidas: 1, reformas: 0 }
]

const riskByDepartment = [
  { name: "1o Ciclo", employees: 15, ready: 3, percentage: 18, color: "bg-emerald-500" },
  { name: "2o Ciclo", employees: 18, ready: 4, percentage: 25, color: "bg-amber-500" },
  { name: "3o Ciclo", employees: 20, ready: 2, percentage: 52, color: "bg-red-500" },
  { name: "Secundario", employees: 20, ready: 3, percentage: 45, color: "bg-amber-500" }
]

const talents = [
  {
    id: 1,
    name: "Joao Silva",
    initials: "JS",
    role: "Professor de Matematica",
    department: "2o Ciclo",
    readiness: 92,
    exitRisk: 15,
    burnout: 20,
    status: "Pronto para coordenacao",
    recommendation: {
      type: "promotion",
      title: "Promocao: Coordenador Pedagogico",
      probability: 85,
      timeline: "6 meses"
    }
  },
  {
    id: 2,
    name: "Ana Costa",
    initials: "AC",
    role: "Professora de Portugues",
    department: "3o Ciclo",
    readiness: 75,
    exitRisk: 65,
    burnout: 45,
    status: "Sinais de fadiga profissional",
    statusDetail: "3 anos sem progressao",
    recommendation: {
      type: "risk",
      title: "Risco de saida elevado",
      probability: 65,
      timeline: "12 meses"
    }
  },
  {
    id: 3,
    name: "Pedro Ferreira",
    initials: "PF",
    role: "Professor de Fisica",
    department: "Secundario",
    readiness: 45,
    exitRisk: 85,
    burnout: 30,
    status: "Reforma prevista em 2 anos",
    statusDetail: "Sem sucessor identificado",
    recommendation: {
      type: "retirement",
      title: "Reforma prevista",
      probability: 95,
      timeline: "24 meses"
    }
  },
  {
    id: 4,
    name: "Sofia Oliveira",
    initials: "SO",
    role: "Professora de Ingles",
    department: "1o Ciclo",
    readiness: 78,
    exitRisk: 25,
    burnout: 15,
    status: "Alto potencial identificado",
    recommendation: {
      type: "promotion",
      title: "Promocao: Coordenadora de Linguas",
      probability: 60,
      timeline: "12 meses"
    }
  },
  {
    id: 5,
    name: "Miguel Santos",
    initials: "MS",
    role: "Professor de Historia",
    department: "3o Ciclo",
    readiness: 55,
    exitRisk: 70,
    burnout: 60,
    status: "Risco elevado de burnout",
    statusDetail: "Probabilidade alta de saida",
    recommendation: {
      type: "risk",
      title: "Risco de saida elevado",
      probability: 70,
      timeline: "6 meses"
    }
  },
  {
    id: 6,
    name: "Teresa Dias",
    initials: "TD",
    role: "Coordenadora 1o Ciclo",
    department: "1o Ciclo",
    readiness: 88,
    exitRisk: 10,
    burnout: 25,
    status: "Candidata a direcao",
    recommendation: {
      type: "promotion",
      title: "Promocao: Direcao Pedagogica",
      probability: 75,
      timeline: "24 meses"
    }
  }
]

const getRecommendationStyle = (type: string) => {
  switch (type) {
    case "promotion":
      return "bg-emerald-50 border-emerald-200 text-emerald-800"
    case "risk":
      return "bg-red-50 border-red-200 text-red-800"
    case "retirement":
      return "bg-amber-50 border-amber-200 text-amber-800"
    default:
      return "bg-slate-50 border-slate-200"
  }
}

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case "promotion":
      return <TrendingUp className="w-4 h-4" />
    case "risk":
      return <AlertTriangle className="w-4 h-4" />
    case "retirement":
      return <Calendar className="w-4 h-4" />
    default:
      return <Target className="w-4 h-4" />
  }
}

export default function TalentFlowPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredTalents = talents.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "todos" || t.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Talent Flow Analytics</h1>
            <p className="text-muted-foreground">
              Analise preditiva de talentos e planeamento de sucessao
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Previsoes
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatorio
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{talentFlowStats.prontoPromocao}</p>
                <p className="text-xs text-muted-foreground">Prontos p/ Promocao</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{talentFlowStats.riscoSaida}</p>
                <p className="text-xs text-muted-foreground">Risco de Saida</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{talentFlowStats.riscoBurnout}</p>
                <p className="text-xs text-muted-foreground">Risco Burnout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{talentFlowStats.gapsSucessao}</p>
                <p className="text-xs text-muted-foreground">Gaps Sucessao</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{talentFlowStats.promocoes6M}</p>
                <p className="text-xs text-muted-foreground">Promocoes 6M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{talentFlowStats.reformas12M}</p>
                <p className="text-xs text-muted-foreground">Reformas 12M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proactive Alerts */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Alertas Proativos</CardTitle>
              <CardDescription>Acoes recomendadas pela IA</CardDescription>
            </div>
          </div>
          <Badge variant="destructive">2 criticos</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {proactiveAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full ${alert.color} flex items-center justify-center flex-shrink-0`}>
                    {alert.type === "critical" && <AlertTriangle className="w-4 h-4 text-white" />}
                    {alert.type === "warning" && <Clock className="w-4 h-4 text-white" />}
                    {alert.type === "success" && <Sparkles className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{alert.name} - {alert.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{alert.description}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">{alert.recommendation}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm">
              Ver todos os alertas
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Movement forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Previsao de Movimentos (6 meses)</CardTitle>
            <CardDescription>Promocoes, saidas e reformas previstas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementForecast}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="promocoes" fill="#10b981" name="Promocoes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saidas" fill="#ef4444" name="Saidas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reformas" fill="#f59e0b" name="Reformas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Promocoes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Saidas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Reformas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk by department */}
        <Card>
          <CardHeader>
            <CardTitle>Risco por Departamento</CardTitle>
            <CardDescription>Analise comparativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {riskByDepartment.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary">{dept.ready} prontos</span>
                      <span className={`text-sm font-semibold ${
                        dept.percentage >= 50 ? "text-red-600" :
                        dept.percentage >= 30 ? "text-amber-600" :
                        "text-emerald-600"
                      }`}>{dept.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">{dept.employees} colaboradores</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Talent tabs and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="mapa" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="mapa">
              <Users className="w-4 h-4 mr-2" />
              Mapa de Talentos
            </TabsTrigger>
            <TabsTrigger value="planos">
              <Target className="w-4 h-4 mr-2" />
              Planos de Sucessao
            </TabsTrigger>
            <TabsTrigger value="ia">
              <Sparkles className="w-4 h-4 mr-2" />
              Recomendacoes IA
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="1o Ciclo">1o Ciclo</SelectItem>
            <SelectItem value="2o Ciclo">2o Ciclo</SelectItem>
            <SelectItem value="3o Ciclo">3o Ciclo</SelectItem>
            <SelectItem value="Secundario">Secundario</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="promocao">Prontos Promocao</SelectItem>
            <SelectItem value="risco">Em Risco</SelectItem>
            <SelectItem value="reforma">Reforma Proxima</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Talent cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTalents.map((talent) => (
          <Card key={talent.id} className="overflow-hidden">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {talent.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground">{talent.role}</p>
                  <p className="text-xs text-muted-foreground">{talent.department}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{talent.readiness}</p>
                  <p className="text-xs text-muted-foreground">Prontidao</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold ${
                    talent.exitRisk >= 60 ? "text-red-600" :
                    talent.exitRisk >= 40 ? "text-amber-600" :
                    "text-emerald-600"
                  }`}>{talent.exitRisk}%</p>
                  <p className="text-xs text-muted-foreground">Risco Saida</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold ${
                    talent.burnout >= 50 ? "text-red-600" :
                    talent.burnout >= 30 ? "text-amber-600" :
                    "text-emerald-600"
                  }`}>{talent.burnout}%</p>
                  <p className="text-xs text-muted-foreground">Burnout</p>
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <p className="text-sm font-medium">{talent.status}</p>
                {talent.statusDetail && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {talent.statusDetail}
                  </Badge>
                )}
              </div>

              {/* Recommendation */}
              <div className={`p-3 rounded-lg border ${getRecommendationStyle(talent.recommendation.type)}`}>
                <div className="flex items-center gap-2 mb-1">
                  {getRecommendationIcon(talent.recommendation.type)}
                  <span className="font-medium text-sm">{talent.recommendation.title}</span>
                </div>
                <p className="text-xs opacity-80">
                  {talent.recommendation.probability}% probabilidade em {talent.recommendation.timeline}
                </p>
              </div>

              {/* Action */}
              <Button variant="ghost" size="sm" className="w-full mt-4">
                <Eye className="w-4 h-4 mr-2" />
                Ver Perfil Completo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
