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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UserPlus,
  Play,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Eye,
  MoreHorizontal,
  GraduationCap,
  Users,
  FileText,
  Settings,
  Video
} from "lucide-react"

// Mock data for onboarding
const onboardingStats = {
  emCurso: 2,
  porIniciar: 1,
  atrasados: 1,
  concluidos30d: 12
}

const onboardings = [
  {
    id: 1,
    name: "Ricardo Neves",
    initials: "RN",
    status: "em_curso",
    startDate: "01/04/2025",
    expectedDate: "15/05/2025",
    progress: 65,
    completedTasks: 4,
    totalTasks: 6,
    tasks: [
      { name: "Seguranca no Trab...", type: "training", completed: true },
      { name: "RGPD e Protecao d...", type: "training", completed: true },
      { name: "Metodologias Ageis", type: "training", completed: true },
      { name: "Configurar ambient...", type: "config", completed: false },
      { name: "Reuniao com Tech ...", type: "meeting", completed: false },
      { name: "Documentacao tec...", type: "document", completed: false }
    ]
  },
  {
    id: 2,
    name: "Beatriz Santos",
    initials: "BS",
    status: "em_curso",
    startDate: "15/04/2025",
    expectedDate: "15/05/2025",
    progress: 20,
    completedTasks: 1,
    totalTasks: 5,
    tasks: [
      { name: "Seguranca no Trab...", type: "training", completed: true },
      { name: "RGPD e Protecao d...", type: "training", completed: false },
      { name: "Produtos e Servicos", type: "training", completed: false },
      { name: "CRM Training", type: "training", completed: false },
      { name: "Reuniao com Diret...", type: "meeting", completed: false }
    ]
  },
  {
    id: 3,
    name: "Tomas Ferreira",
    initials: "TF",
    status: "atrasado",
    startDate: "15/03/2025",
    expectedDate: "15/04/2025",
    progress: 80,
    completedTasks: 4,
    totalTasks: 5,
    tasks: [
      { name: "Seguranca no Trab...", type: "training", completed: true },
      { name: "RGPD e Protecao d...", type: "training", completed: true },
      { name: "Reuniao com Mana...", type: "meeting", completed: true },
      { name: "Configurar acesso...", type: "config", completed: true },
      { name: "Ler Manual do Col...", type: "document", completed: false }
    ]
  },
  {
    id: 4,
    name: "Carolina Lopes",
    initials: "CL",
    status: "por_iniciar",
    startDate: "20/04/2025",
    expectedDate: "20/05/2025",
    progress: 0,
    completedTasks: 0,
    totalTasks: 5,
    tasks: [
      { name: "Seguranca no Trab...", type: "training", completed: false },
      { name: "RGPD e Protecao d...", type: "training", completed: false },
      { name: "Reuniao com Mana...", type: "meeting", completed: false },
      { name: "Configurar acesso...", type: "config", completed: false },
      { name: "Ler Manual do Col...", type: "document", completed: false }
    ]
  }
]

const getTaskIcon = (type: string) => {
  switch (type) {
    case "training":
      return GraduationCap
    case "meeting":
      return Users
    case "document":
      return FileText
    case "config":
      return Settings
    case "video":
      return Video
    default:
      return FileText
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "em_curso":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Play className="w-3 h-3 mr-1" /> Em Curso</Badge>
    case "por_iniciar":
      return <Badge variant="secondary" className="text-muted-foreground"><Clock className="w-3 h-3 mr-1" /> Por Iniciar</Badge>
    case "atrasado":
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Atrasado</Badge>
    case "concluido":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Concluido</Badge>
    default:
      return null
  }
}

export default function OnboardingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredOnboardings = onboardings.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Onboarding</h1>
          <p className="text-muted-foreground">
            Gestao automatizada de integracao de novos colaboradores
          </p>
        </div>
        <Button className="bg-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Onboarding
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Curso</p>
                <p className="text-3xl font-bold">{onboardingStats.emCurso}</p>
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
                <p className="text-sm text-muted-foreground">Por Iniciar</p>
                <p className="text-3xl font-bold">{onboardingStats.porIniciar}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atrasados</p>
                <p className="text-3xl font-bold text-amber-600">{onboardingStats.atrasados}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluidos (30d)</p>
                <p className="text-3xl font-bold text-emerald-600">{onboardingStats.concluidos30d}</p>
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
        <Tabs defaultValue="ativos" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="ativos">Onboardings Ativos</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
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
              <SelectItem value="por_iniciar">Por Iniciar</SelectItem>
              <SelectItem value="atrasado">Atrasados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onboarding cards */}
      <div className="space-y-4">
        {filteredOnboardings.map((onboarding) => (
          <Card key={onboarding.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Person info */}
                <div className="flex items-center gap-4 min-w-[220px]">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {onboarding.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{onboarding.name}</h3>
                      {getStatusBadge(onboarding.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inicio: {onboarding.startDate} · Previsao: {onboarding.expectedDate}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-semibold">{onboarding.progress}%</span>
                  </div>
                  <Progress value={onboarding.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {onboarding.completedTasks} de {onboarding.totalTasks} tarefas
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Enviar Lembrete</DropdownMenuItem>
                      <DropdownMenuItem>Arquivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {onboarding.tasks.map((task, index) => {
                  const TaskIcon = getTaskIcon(task.type)
                  return (
                    <Badge 
                      key={index}
                      variant={task.completed ? "default" : "outline"}
                      className={`gap-1.5 ${task.completed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`}
                    >
                      <TaskIcon className="w-3 h-3" />
                      {task.name}
                      {task.completed ? (
                        <CheckCircle2 className="w-3 h-3 ml-1" />
                      ) : (
                        <Clock className="w-3 h-3 ml-1 opacity-50" />
                      )}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
