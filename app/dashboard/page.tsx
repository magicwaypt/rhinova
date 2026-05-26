"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Award,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Target,
  Wallet,
  UserX,
  FileWarning,
  AlertCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  dashboardStats, 
  trainings, 
  complianceMetrics, 
  notifications,
  complianceByDepartment,
  trainingTrendData,
  hrComplianceMetrics
} from "@/lib/mock-data"
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

export default function DashboardPage() {
  // Cards simples e diretos ao ponto
  const statCards = [
    {
      title: "Formacoes Ativas",
      value: String(dashboardStats.activeTrainings),
      subtitle: "A decorrer este mes",
      icon: GraduationCap,
      color: "bg-blue-500",
      lightBg: "bg-blue-50"
    },
    {
      title: "Colaboradores",
      value: String(hrComplianceMetrics.totalEmployees),
      subtitle: `${hrComplianceMetrics.employeesWithAllMandatory} com formacoes em dia`,
      icon: Users,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50"
    },
    {
      title: "Certificacoes",
      value: String(hrComplianceMetrics.totalActiveCertifications),
      subtitle: `${hrComplianceMetrics.expiringSoon} a renovar em breve`,
      icon: Award,
      color: "bg-amber-500",
      lightBg: "bg-amber-50"
    },
    {
      title: "Horas de Formacao",
      value: String(hrComplianceMetrics.hoursCompletedThisYear),
      subtitle: `Media ${hrComplianceMetrics.avgHoursPerEmployee}h por colaborador`,
      icon: Clock,
      color: "bg-violet-500",
      lightBg: "bg-violet-50"
    }
  ]
  const upcomingTrainings = trainings
    .filter(t => t.status === "scheduled" || t.status === "in_progress")
    .slice(0, 4)

  const recentNotifications = notifications.filter(n => !n.read).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vinda de volta, Maria. Aqui esta o resumo da sua organizacao.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/reports">
              Ver Relatorios
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Plus className="w-4 h-4 mr-2" />
              Nova Formacao
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.lightBg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Training trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Evolucao Mensal</CardTitle>
              <CardDescription>Formacoes realizadas nos ultimos 6 meses</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Concluidas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Planeadas</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trainingTrendData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
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
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                    strokeWidth={2.5}
                    name="Concluidas"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="scheduled" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorScheduled)" 
                    strokeWidth={2.5}
                    name="Planeadas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compliance by department */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance por Departamento</CardTitle>
            <CardDescription>Taxa de conformidade e detalhes por equipa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hrComplianceMetrics.departmentMetrics.map((dept, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dept.department}</span>
                      {dept.trend === 'up' && <TrendingUp className="w-3 h-3 text-accent" />}
                      {dept.trend === 'down' && <TrendingDown className="w-3 h-3 text-destructive" />}
                    </div>
                    <span className={`font-medium ${
                      dept.complianceRate >= 95 ? "text-accent" :
                      dept.complianceRate >= 85 ? "text-warning" :
                      "text-destructive"
                    }`}>
                      {dept.complianceRate}%
                    </span>
                  </div>
                  <Progress 
                    value={dept.complianceRate} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{dept.compliantEmployees}/{dept.totalEmployees} colaboradores</span>
                    <div className="flex items-center gap-3">
                      {dept.pendingMandatory > 0 && (
                        <span className="text-warning">{dept.pendingMandatory} pendentes</span>
                      )}
                      {dept.expiringCerts > 0 && (
                        <span className="text-destructive">{dept.expiringCerts} a expirar</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts Section */}
      <Card className="border-warning/30 bg-warning/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-lg">Alertas de Compliance</CardTitle>
              <CardDescription>Acoes que requerem atencao imediata</CardDescription>
            </div>
          </div>
          <Badge variant="destructive">{hrComplianceMetrics.criticalAlerts.filter(a => a.severity === 'critical').length} criticos</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hrComplianceMetrics.criticalAlerts.slice(0, 6).map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border bg-card ${
                  alert.severity === 'critical' ? 'border-destructive/50' :
                  alert.severity === 'warning' ? 'border-warning/50' :
                  'border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'critical' ? 'bg-destructive/20' :
                    alert.severity === 'warning' ? 'bg-warning/20' :
                    'bg-primary/20'
                  }`}>
                    {alert.type === 'expired_cert' && <FileWarning className={`w-4 h-4 ${alert.severity === 'critical' ? 'text-destructive' : 'text-warning'}`} />}
                    {alert.type === 'low_compliance' && <TrendingDown className="w-4 h-4 text-warning" />}
                    {alert.type === 'deadline_approaching' && <Clock className="w-4 h-4 text-warning" />}
                    {alert.type === 'missing_mandatory' && <UserX className="w-4 h-4 text-warning" />}
                    {alert.type === 'budget_exceeded' && <Wallet className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                    {alert.affectedCount > 0 && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {alert.affectedCount} {alert.affectedCount === 1 ? 'afetado' : 'afetados'}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-xs"
                  asChild
                >
                  <Link href={alert.actionUrl || '#'}>
                    Resolver
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Second row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming trainings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Proximas Formacoes</CardTitle>
              <CardDescription>Sessoes agendadas para os proximos dias</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/trainings">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrainings.map((training) => (
                <div 
                  key={training.id} 
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    training.status === "in_progress" 
                      ? "bg-accent/20" 
                      : "bg-primary/20"
                  }`}>
                    <GraduationCap className={`w-6 h-6 ${
                      training.status === "in_progress" 
                        ? "text-accent" 
                        : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{training.title}</h4>
                      {training.mandatory && (
                        <Badge variant="destructive" className="text-xs">
                          Obrigatoria
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(training.startDate).toLocaleDateString('pt-PT', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {training.duration}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {training.currentParticipants}/{training.maxParticipants}
                      </span>
                    </div>
                  </div>
                  <Badge variant={
                    training.status === "in_progress" ? "default" : "secondary"
                  }>
                    {training.status === "in_progress" ? "Em curso" : "Agendada"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Gerir participantes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Alertas</CardTitle>
              <CardDescription>Acoes que requerem atencao</CardDescription>
            </div>
            <Badge variant="destructive">{recentNotifications.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "certification_expiring" 
                        ? "bg-warning" 
                        : notification.type === "compliance_alert"
                        ? "bg-destructive"
                        : "bg-primary"
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="px-0 h-auto mt-2 text-xs"
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todas as notificacoes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acoes Rapidas</CardTitle>
          <CardDescription>Tarefas comuns para agilizar o seu trabalho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/trainings/new">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Nova Formacao</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/reports/export">
                <ArrowRight className="w-5 h-5" />
                <span className="text-sm">Exportar Relatorio</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/employees">
                <Users className="w-5 h-5" />
                <span className="text-sm">Gerir Equipa</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/calendar">
                <CalendarDays className="w-5 h-5" />
                <span className="text-sm">Ver Calendario</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
