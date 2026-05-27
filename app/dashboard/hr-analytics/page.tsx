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
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Shield,
  Eye,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  GraduationCap,
  UserMinus
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts"

// Mock data for HR Analytics
const hrStats = {
  riscoGlobal: 32,
  colaboradoresEmRisco: 18,
  colaboradoresCriticos: 4,
  previsaoTurnover: 8.5,
  saidasPrevistas: 20,
  saidasVoluntarias: 15,
  saidasInvoluntarias: 5
}

const riskByDepartment = [
  { name: "Engenharia", value: 35, color: "#10b981" },
  { name: "Vendas", value: 55, color: "#f97316" },
  { name: "Marketing", value: 40, color: "#10b981" },
  { name: "Financas", value: 25, color: "#10b981" },
  { name: "RH", value: 30, color: "#10b981" },
  { name: "IT", value: 45, color: "#f97316" }
]

const turnoverHistory = [
  { month: "Out", voluntarias: 2, involuntarias: 1 },
  { month: "Nov", voluntarias: 3, involuntarias: 1 },
  { month: "Dez", voluntarias: 2, involuntarias: 2 },
  { month: "Jan", voluntarias: 4, involuntarias: 1 },
  { month: "Fev", voluntarias: 3, involuntarias: 1 },
  { month: "Mar", voluntarias: 2, involuntarias: 0 }
]

const riskFactors = [
  { name: "Tempo sem promocao", percentage: 23, description: "Colaboradores sem promocao ha mais de 3 anos", color: "bg-red-500" },
  { name: "Salario abaixo do mercado", percentage: 18, description: "Salario 15%+ abaixo da media de mercado", color: "bg-orange-500" },
  { name: "Baixa participacao em formacoes", percentage: 15, description: "Menos de 8h de formacao no ultimo ano", color: "bg-amber-500" },
  { name: "Gestor com alta rotatividade", percentage: 12, description: "Equipa com turnover acima de 20%", color: "bg-rose-400" },
  { name: "Formacao continua", percentage: 67, description: "Participacao ativa em programas de desenvolvimento", color: "bg-emerald-500" }
]

const collaboratorsAtRisk = [
  {
    id: 1,
    name: "Ricardo Neves",
    role: "Sales Manager",
    initials: "RN",
    department: "Vendas",
    score: 78,
    level: "critico",
    trend: "up",
    factors: ["Tempo sem promocao", "Objetivos nao alcancados"],
    moreFactors: 1
  },
  {
    id: 2,
    name: "Carla Mendes",
    role: "Senior Developer",
    initials: "CM",
    department: "Engenharia",
    score: 72,
    level: "critico",
    trend: "stable",
    factors: ["Ofertas externas", "Salario abaixo mercado"],
    moreFactors: 1
  },
  {
    id: 3,
    name: "Bruno Costa",
    role: "IT Specialist",
    initials: "BC",
    department: "IT",
    score: 65,
    level: "alto",
    trend: "up",
    factors: ["Ausencias frequentes", "Baixo engagement"],
    moreFactors: 1
  },
  {
    id: 4,
    name: "Ana Ferreira",
    role: "Account Executive",
    initials: "AF",
    department: "Vendas",
    score: 58,
    level: "alto",
    trend: "down",
    factors: ["Performance em crescimento", "Sem promocao recente"],
    moreFactors: 0
  },
  {
    id: 5,
    name: "Miguel Santos",
    role: "Content Specialist",
    initials: "MS",
    department: "Marketing",
    score: 45,
    level: "medio",
    trend: "stable",
    factors: ["Engagement moderado", "Formacao em atraso"],
    moreFactors: 0
  },
  {
    id: 6,
    name: "Tiago Oliveira",
    role: "Tech Lead",
    initials: "TO",
    department: "Engenharia",
    score: 35,
    level: "medio",
    trend: "down",
    factors: ["Carga de trabalho elevada", "Lideranca reconhecida"],
    moreFactors: 0
  },
  {
    id: 7,
    name: "Sofia Almeida",
    role: "Financial Analyst",
    initials: "SA",
    department: "Financas",
    score: 22,
    level: "baixo",
    trend: "stable",
    factors: ["Alta satisfacao", "Progressao recente"],
    moreFactors: 1
  },
  {
    id: 8,
    name: "Ines Rodrigues",
    role: "HR Business Partner",
    initials: "IR",
    department: "RH",
    score: 18,
    level: "baixo",
    trend: "stable",
    factors: ["Alto engagement", "Desenvolvimento continuo"],
    moreFactors: 0
  }
]

const retentionAlerts = [
  { type: "critical", count: 4, description: "colaboradores em risco critico", detail: "Requerem atencao imediata - risco de saida nos proximos 3 meses." },
  { type: "warning", count: 12, description: "colaboradores sem promocao ha mais de 3 anos", detail: "Considerar revisao de carreiras e planos de desenvolvimento." },
  { type: "info", count: 8, description: "colaboradores com baixa participacao em formacoes", detail: "Menos de 8 horas de formacao no ultimo ano." }
]

const getLevelBadge = (level: string) => {
  switch (level) {
    case "critico":
      return <Badge variant="destructive">Critico</Badge>
    case "alto":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Alto</Badge>
    case "medio":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medio</Badge>
    case "baixo":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Baixo</Badge>
    default:
      return null
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <ArrowUpRight className="w-4 h-4 text-red-500" />
    case "down":
      return <ArrowDownRight className="w-4 h-4 text-emerald-500" />
    default:
      return <Minus className="w-4 h-4 text-slate-400" />
  }
}

export default function HRAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("todos")
  const [levelFilter, setLevelFilter] = useState("todos")

  const filteredCollaborators = collaboratorsAtRisk.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "todos" || c.department === departmentFilter
    const matchesLevel = levelFilter === "todos" || c.level === levelFilter
    return matchesSearch && matchesDepartment && matchesLevel
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics de RH</h1>
          <p className="text-muted-foreground">
            Analise preditiva de risco de turnover e indicadores de retencao
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risco Global</p>
                <p className="text-3xl font-bold text-emerald-600">{hrStats.riscoGlobal}%</p>
                <p className="text-xs text-muted-foreground">Score medio da organizacao</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Colaboradores em Risco</p>
                <p className="text-3xl font-bold text-amber-600">{hrStats.colaboradoresEmRisco}</p>
                <p className="text-xs text-destructive">{hrStats.colaboradoresCriticos} criticos</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Previsao Turnover</p>
                <p className="text-3xl font-bold">{hrStats.previsaoTurnover}%</p>
                <p className="text-xs text-muted-foreground">Proximos 6 meses</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saidas (6 meses)</p>
                <p className="text-3xl font-bold">{hrStats.saidasPrevistas}</p>
                <p className="text-xs text-muted-foreground">{hrStats.saidasVoluntarias} voluntarias · {hrStats.saidasInvoluntarias} involuntarias</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk by department */}
        <Card>
          <CardHeader>
            <CardTitle>Risco por Departamento</CardTitle>
            <CardDescription>Score medio de risco e colaboradores em risco por area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskByDepartment} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={80} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value}%`, 'Risco']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {riskByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk factors */}
        <Card>
          <CardHeader>
            <CardTitle>Principais Fatores de Risco</CardTitle>
            <CardDescription>Fatores com maior impacto no turnover</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${factor.color}`} />
                      <span className="text-sm font-medium">{factor.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{factor.percentage}%</span>
                  </div>
                  <Progress value={factor.percentage} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turnover history chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historico de Turnover</CardTitle>
          <CardDescription>Saidas voluntarias e involuntarias nos ultimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={turnoverHistory}>
                <defs>
                  <linearGradient id="colorVoluntarias" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorInvoluntarias" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="voluntarias" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorVoluntarias)" 
                  strokeWidth={2.5}
                  name="Voluntarias"
                />
                <Area 
                  type="monotone" 
                  dataKey="involuntarias" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorInvoluntarias)" 
                  strokeWidth={2.5}
                  name="Involuntarias"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Voluntarias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Involuntarias</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaborators at risk table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Colaboradores em Risco</CardTitle>
              <CardDescription>Lista ordenada por score de risco</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar..." 
                  className="pl-9 w-[180px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Engenharia">Engenharia</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Financas">Financas</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="critico">Critico</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Colaborador</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Departamento</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nivel</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tendencia</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fatores Principais</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollaborators.map((collab) => (
                  <tr key={collab.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {collab.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{collab.name}</p>
                          <p className="text-xs text-muted-foreground">{collab.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{collab.department}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-sm">{collab.score}</span>
                    </td>
                    <td className="py-3 px-4">{getLevelBadge(collab.level)}</td>
                    <td className="py-3 px-4">{getTrendIcon(collab.trend)}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {collab.factors.map((factor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                        {collab.moreFactors > 0 && (
                          <Badge variant="outline" className="text-xs">+{collab.moreFactors}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Retention alerts */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <CardTitle>Alertas de Retencao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retentionAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.type === "critical" ? "bg-red-100" :
                    alert.type === "warning" ? "bg-amber-100" :
                    "bg-blue-100"
                  }`}>
                    {alert.type === "critical" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    {alert.type === "warning" && <Clock className="w-4 h-4 text-amber-600" />}
                    {alert.type === "info" && <GraduationCap className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      <span className={`${
                        alert.type === "critical" ? "text-red-600" :
                        alert.type === "warning" ? "text-amber-600" :
                        "text-blue-600"
                      }`}>{alert.count}</span> {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver Lista</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
