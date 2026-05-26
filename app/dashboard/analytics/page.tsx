"use client"

import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

const kpis = [
  {
    title: "Taxa de Conclusão",
    value: "87%",
    change: "+5.2%",
    trend: "up",
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Horas de Formação",
    value: "12,450",
    change: "+892h",
    trend: "up",
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Certificados Emitidos",
    value: "1,234",
    change: "+156",
    trend: "up",
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Colaboradores Ativos",
    value: "89%",
    change: "-2.1%",
    trend: "down",
    icon: Users,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
]

const completionData = [
  { month: "Jan", completadas: 145, inscritas: 180 },
  { month: "Fev", completadas: 178, inscritas: 210 },
  { month: "Mar", completadas: 165, inscritas: 195 },
  { month: "Abr", completadas: 192, inscritas: 220 },
  { month: "Mai", completadas: 210, inscritas: 245 },
  { month: "Jun", completadas: 198, inscritas: 230 },
]

const categoryData = [
  { name: "Obrigatórias", value: 45, color: "#EF4444" },
  { name: "Técnicas", value: 30, color: "#0066FF" },
  { name: "Soft Skills", value: 15, color: "#8B5CF6" },
  { name: "Liderança", value: 10, color: "#10B981" },
]

const departmentData = [
  { department: "Tecnologia", horas: 450, taxa: 92 },
  { department: "Marketing", horas: 280, taxa: 88 },
  { department: "Vendas", horas: 320, taxa: 85 },
  { department: "RH", horas: 180, taxa: 94 },
  { department: "Finanças", horas: 220, taxa: 90 },
  { department: "Operações", horas: 380, taxa: 82 },
]

const topTrainings = [
  { name: "Segurança no Trabalho", completions: 234, rating: 4.8 },
  { name: "RGPD e Proteção de Dados", completions: 198, rating: 4.7 },
  { name: "Excel Avançado", completions: 156, rating: 4.9 },
  { name: "Comunicação Eficaz", completions: 145, rating: 4.6 },
  { name: "Gestão de Tempo", completions: 132, rating: 4.5 },
]

const chartConfig = {
  completadas: {
    label: "Completadas",
    color: "hsl(var(--primary))",
  },
  inscritas: {
    label: "Inscritas",
    color: "hsl(var(--muted-foreground))",
  },
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Métricas e insights sobre formação na sua organização
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
              <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
              <SelectItem value="last-year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2.5 ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <Badge
                  variant="secondary"
                  className={
                    kpi.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Completion Trend */}
        <Card className="border-border/50 bg-card/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Evolução de Formações
            </CardTitle>
            <CardDescription>
              Formações inscritas vs completadas nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="inscritas"
                    stackId="1"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted))"
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="completadas"
                    stackId="2"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição de formações por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance & Top Trainings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Performance */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Desempenho por Departamento
            </CardTitle>
            <CardDescription>
              Horas de formação e taxa de conclusão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="department"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="horas"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Trainings */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Formações Mais Populares
            </CardTitle>
            <CardDescription>
              Top 5 formações com mais conclusões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTrainings.map((training, index) => (
              <div
                key={training.name}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{training.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {training.completions} conclusões
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium text-foreground">
                    {training.rating}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Overview */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Compliance Overview
          </CardTitle>
          <CardDescription>
            Estado de conformidade das formações obrigatórias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Segurança no Trabalho
                </span>
                <span className="text-sm text-emerald-500">98%</span>
              </div>
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground">
                5 colaboradores pendentes
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  RGPD
                </span>
                <span className="text-sm text-emerald-500">95%</span>
              </div>
              <Progress value={95} className="h-2" />
              <p className="text-xs text-muted-foreground">
                12 colaboradores pendentes
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Higiene Alimentar
                </span>
                <span className="text-sm text-amber-500">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">
                28 colaboradores pendentes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
