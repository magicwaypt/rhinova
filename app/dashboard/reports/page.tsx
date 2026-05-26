"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  Clock,
  ShieldCheck,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  File,
  Mail,
  RefreshCw,
  Filter,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Target,
  Wallet
} from "lucide-react"
import { 
  hrComplianceMetrics, 
  trainings, 
  users, 
  complianceByDepartment,
  trainingTrendData
} from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

// Dados para os relatorios
const reportTypes = [
  {
    id: 'compliance',
    name: 'Compliance Geral',
    description: 'Visao geral da taxa de compliance por departamento e colaborador',
    icon: ShieldCheck,
    color: 'primary',
    lastGenerated: '2025-04-01',
    frequency: 'Mensal'
  },
  {
    id: 'training-summary',
    name: 'Resumo de Formacoes',
    description: 'Estatisticas de formacoes realizadas, participacao e avaliacoes',
    icon: GraduationCap,
    color: 'accent',
    lastGenerated: '2025-04-01',
    frequency: 'Mensal'
  },
  {
    id: 'certifications',
    name: 'Estado de Certificacoes',
    description: 'Certificacoes ativas, expiradas e proximas de expirar',
    icon: Award,
    color: 'warning',
    lastGenerated: '2025-03-28',
    frequency: 'Semanal'
  },
  {
    id: 'hours',
    name: 'Horas de Formacao',
    description: 'Analise de horas de formacao por colaborador e departamento',
    icon: Clock,
    color: 'primary',
    lastGenerated: '2025-04-01',
    frequency: 'Mensal'
  },
  {
    id: 'budget',
    name: 'Orcamento e Custos',
    description: 'Utilizacao do orcamento de formacao e custos por area',
    icon: Wallet,
    color: 'accent',
    lastGenerated: '2025-03-31',
    frequency: 'Mensal'
  },
  {
    id: 'skills-gap',
    name: 'Analise de Competencias',
    description: 'Gaps de competencias identificados e planos de desenvolvimento',
    icon: Target,
    color: 'primary',
    lastGenerated: '2025-03-15',
    frequency: 'Trimestral'
  },
]

const scheduledReports = [
  { id: '1', name: 'Compliance Mensal', recipients: 'direcao@empresa.pt', nextRun: '2025-05-01', status: 'active' },
  { id: '2', name: 'Certificacoes a Expirar', recipients: 'hr@empresa.pt', nextRun: '2025-04-08', status: 'active' },
  { id: '3', name: 'Resumo Semanal Formacoes', recipients: 'gestores@empresa.pt', nextRun: '2025-04-07', status: 'active' },
  { id: '4', name: 'Orcamento Trimestral', recipients: 'financeiro@empresa.pt', nextRun: '2025-07-01', status: 'paused' },
]

const recentReports = [
  { id: '1', name: 'Compliance_Marco_2025.pdf', type: 'compliance', date: '2025-04-01', size: '2.4 MB', downloads: 12 },
  { id: '2', name: 'Formacoes_Q1_2025.xlsx', type: 'training-summary', date: '2025-04-01', size: '1.8 MB', downloads: 8 },
  { id: '3', name: 'Certificacoes_Semana13.pdf', type: 'certifications', date: '2025-03-28', size: '890 KB', downloads: 15 },
  { id: '4', name: 'Horas_Formacao_Marco.xlsx', type: 'hours', date: '2025-04-01', size: '1.2 MB', downloads: 6 },
  { id: '5', name: 'Orcamento_Q1_2025.pdf', type: 'budget', date: '2025-03-31', size: '3.1 MB', downloads: 4 },
]

// Dados para graficos do relatorio
const complianceByMonth = [
  { month: 'Out', rate: 87 },
  { month: 'Nov', rate: 89 },
  { month: 'Dez', rate: 88 },
  { month: 'Jan', rate: 90 },
  { month: 'Fev', rate: 91 },
  { month: 'Mar', rate: 93 },
]

const trainingsByType = [
  { name: 'Obrigatorias', value: 35, color: '#2563eb' },
  { name: 'Tecnicas', value: 28, color: '#0891b2' },
  { name: 'Soft Skills', value: 22, color: '#6366f1' },
  { name: 'Certificacoes', value: 15, color: '#8b5cf6' },
]

const hoursbyDepartment = [
  { dept: 'Engenharia', hours: 684, target: 720, employees: 18 },
  { dept: 'Marketing', hours: 384, target: 480, employees: 12 },
  { dept: 'Vendas', hours: 420, target: 600, employees: 15 },
  { dept: 'RH', hours: 210, target: 200, employees: 5 },
  { dept: 'Financas', hours: 350, target: 400, employees: 10 },
  { dept: 'IT', hours: 585, target: 520, employees: 13 },
]

const budgetAllocation = [
  { category: 'Formadores Externos', allocated: 35000, used: 22500 },
  { category: 'Plataformas Online', allocated: 15000, used: 12000 },
  { category: 'Certificacoes', allocated: 20000, used: 11800 },
  { category: 'Materiais', allocated: 8000, used: 4200 },
  { category: 'Deslocacoes', allocated: 7000, used: 1800 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [activeReport, setActiveReport] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatorios</h1>
          <p className="text-muted-foreground">
            Gere e exporte relatorios detalhados sobre formacao e compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Novo Relatorio
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Relatorios Gerados</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-muted-foreground mt-1">este mes</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agendados Ativos</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground mt-1">1 pausado</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-accent mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +23% vs anterior
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ultima Atualizacao</p>
                <p className="text-2xl font-bold">Hoje</p>
                <p className="text-xs text-muted-foreground mt-1">09:30</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Gerar Relatorios</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="history">Historico</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Generate Reports Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <Card 
                key={report.id} 
                className={`cursor-pointer transition-all hover:border-primary/50 ${activeReport === report.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                onClick={() => setActiveReport(activeReport === report.id ? null : report.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      report.color === 'primary' ? 'bg-primary/10' :
                      report.color === 'accent' ? 'bg-accent/10' :
                      'bg-warning/10'
                    }`}>
                      <report.icon className={`w-5 h-5 ${
                        report.color === 'primary' ? 'text-primary' :
                        report.color === 'accent' ? 'text-accent' :
                        'text-warning'
                      }`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {report.frequency}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Ultima geracao: {report.lastGenerated}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Gerar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Options when selected */}
          {activeReport && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opcoes de Exportacao</CardTitle>
                <CardDescription>Configure o relatorio antes de gerar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Formato</label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
<SelectItem value="pdf">
                                          <div className="flex items-center gap-2">
                                            <File className="w-4 h-4 text-destructive" />
                                            PDF
                                          </div>
                                        </SelectItem>
                        <SelectItem value="excel">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-accent" />
                            Excel
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Periodo</label>
                    <Select defaultValue="month">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Ultima Semana</SelectItem>
                        <SelectItem value="month">Ultimo Mes</SelectItem>
                        <SelectItem value="quarter">Ultimo Trimestre</SelectItem>
                        <SelectItem value="year">Ultimo Ano</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departamento</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="engenharia">Engenharia</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="rh">RH</SelectItem>
                        <SelectItem value="financas">Financas</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enviar por Email</label>
                    <div className="flex gap-2">
                      <Input placeholder="email@empresa.pt" className="flex-1" />
                      <Button size="icon" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setActiveReport(null)}>
                    Cancelar
                  </Button>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Gerar Relatorio
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Relatorios Agendados</CardTitle>
                <CardDescription>Relatorios gerados e enviados automaticamente</CardDescription>
              </div>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Novo
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Relatorio</TableHead>
                    <TableHead>Destinatarios</TableHead>
                    <TableHead>Proxima Execucao</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell className="text-muted-foreground">{report.recipients}</TableCell>
                      <TableCell>{report.nextRun}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                          {report.status === 'active' ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">
                            {report.status === 'active' ? 'Pausar' : 'Ativar'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Historico de Relatorios</CardTitle>
                <CardDescription>Relatorios gerados recentemente</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Pesquisar..." className="pl-9 w-[200px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ficheiro</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.name.endsWith('.pdf') ? (
                            <File className="w-4 h-4 text-destructive" />
                          ) : (
                            <FileSpreadsheet className="w-4 h-4 text-accent" />
                          )}
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {reportTypes.find(r => r.id === report.type)?.name || report.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{report.date}</TableCell>
                      <TableCell className="text-muted-foreground">{report.size}</TableCell>
                      <TableCell>{report.downloads}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Compliance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolucao da Taxa de Compliance</CardTitle>
                <CardDescription>Ultimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value}%`, 'Compliance']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Trainings by Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Formacoes por Tipo</CardTitle>
                <CardDescription>Distribuicao anual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={trainingsByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {trainingsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value} formacoes`, '']}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hours by Department */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Horas de Formacao por Departamento</CardTitle>
                <CardDescription>Realizado vs Target anual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hoursbyDepartment} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="dept" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [
                          `${value}h`, 
                          name === 'hours' ? 'Realizado' : 'Target'
                        ]}
                      />
                      <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="target" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Budget Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Utilizacao do Orcamento</CardTitle>
                <CardDescription>Por categoria de despesa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetAllocation.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="text-muted-foreground">
                          {(item.used / 1000).toFixed(1)}k / {(item.allocated / 1000).toFixed(1)}k EUR
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(item.used / item.allocated) * 100} 
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round((item.used / item.allocated) * 100)}% utilizado</span>
                        <span>{((item.allocated - item.used) / 1000).toFixed(1)}k restante</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo por Departamento</CardTitle>
              <CardDescription>Metricas consolidadas de formacao e compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departamento</TableHead>
                    <TableHead className="text-center">Colaboradores</TableHead>
                    <TableHead className="text-center">Compliance</TableHead>
                    <TableHead className="text-center">Horas Media</TableHead>
                    <TableHead className="text-center">Pendentes</TableHead>
                    <TableHead className="text-center">Expirar</TableHead>
                    <TableHead className="text-center">Tendencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hrComplianceMetrics.departmentMetrics.map((dept, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {dept.department}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{dept.totalEmployees}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={dept.complianceRate >= 95 ? 'default' : dept.complianceRate >= 85 ? 'secondary' : 'destructive'}
                          className={dept.complianceRate >= 95 ? 'bg-accent/20 text-accent' : ''}
                        >
                          {dept.complianceRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{dept.avgTrainingHours}h</TableCell>
                      <TableCell className="text-center">
                        {dept.pendingMandatory > 0 ? (
                          <Badge variant="secondary" className="bg-warning/20 text-warning">
                            {dept.pendingMandatory}
                          </Badge>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-accent mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {dept.expiringCerts > 0 ? (
                          <Badge variant="destructive">
                            {dept.expiringCerts}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {dept.trend === 'up' && <TrendingUp className="w-4 h-4 text-accent mx-auto" />}
                        {dept.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive mx-auto" />}
                        {dept.trend === 'stable' && <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
