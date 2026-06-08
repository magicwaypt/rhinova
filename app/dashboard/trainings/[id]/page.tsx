"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Edit,
  FileJson,
  MoreHorizontal,
  Plus,
  Send,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { RuTableKey } from "@/lib/training-platform"
import {
  getEmployeeRuMissingFields,
  getRuLabel,
  isEmployeeRuReady,
  participantStatusLabels,
  ruCodeTables,
  taskPriorityLabels,
  taskStatusLabels,
  trainingStatusLabels,
  trainingTestingGuide,
  useTrainingWorkspace,
} from "@/lib/training-platform"

const participantStatusStyles = {
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  absent: "bg-rose-100 text-rose-700",
  completed: "bg-emerald-100 text-emerald-700",
}

const taskStatusStyles = {
  pending: "bg-rose-100 text-rose-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
}

export default function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const {
    state,
    isReady,
    addParticipant,
    addTask,
    buildRuExportForTraining,
    buildRuValidationForTraining,
    deleteTask,
    deleteTraining,
    duplicateTraining,
    removeParticipant,
    updateParticipantRuData,
    updateParticipantStatus,
    updateTaskStatus,
  } = useTrainingWorkspace()
  const [participantSearch, setParticipantSearch] = useState("")
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [taskForm, setTaskForm] = useState({
    title: "",
    owner: "Equipa RH",
    dueDate: "",
    status: "pending",
    priority: "medium",
    notes: "",
  })

  const training = useMemo(
    () => state.trainings.find((item) => item.id === resolvedParams.id),
    [resolvedParams.id, state.trainings],
  )
  const participants = training ? state.participantsByTraining[training.id] || [] : []
  const validation = training ? buildRuValidationForTraining(training.id) : null
  const trainingTasks = useMemo(
    () =>
      state.tasks
        .filter((task) => task.trainingId === resolvedParams.id)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [resolvedParams.id, state.tasks],
  )
  const filteredParticipants = participants.filter((participant) => {
    const normalizedSearch = participantSearch.toLowerCase()
    return (
      participant.name.toLowerCase().includes(normalizedSearch) ||
      participant.email.toLowerCase().includes(normalizedSearch) ||
      participant.department.toLowerCase().includes(normalizedSearch)
    )
  })
  const availableEmployees = state.employees.filter(
    (employee) => !participants.some((participant) => participant.employeeId === employee.id),
  )

  const confirmedCount = participants.filter((participant) => participant.status === "confirmed" || participant.status === "completed").length
  const pendingCount = participants.filter((participant) => participant.status === "pending").length
  const completedCount = participants.filter((participant) => participant.status === "completed").length
  const hoursForReport = participants.reduce((sum, participant) => sum + participant.attendedHours, 0)
  const pendingChecklist = trainingTasks.filter((task) => task.status !== "completed").length

  const handleDuplicate = () => {
    if (!training) return
    const duplicatedTraining = duplicateTraining(training.id)
    if (!duplicatedTraining) {
      toast.error("Nao foi possivel duplicar a formacao.")
      return
    }
    toast.success("Nova copia criada com sucesso.")
    router.push(`/dashboard/trainings/${duplicatedTraining.id}/edit`)
  }

  const handleDelete = () => {
    if (!training) return
    const shouldDelete = window.confirm("Eliminar esta formacao remove tambem participantes e tarefas relacionadas. Continuar?")
    if (!shouldDelete) return
    deleteTraining(training.id)
    toast.success("Formacao eliminada.")
    router.push("/dashboard/trainings")
  }

  const handleAddParticipant = () => {
    if (!selectedEmployeeId || !training) {
      toast.error("Escolha um colaborador para associar.")
      return
    }
    addParticipant(training.id, selectedEmployeeId)
    setSelectedEmployeeId("")
    setParticipantDialogOpen(false)
    toast.success("Colaborador associado a esta formacao.")
  }

  const handleAddTask = () => {
    if (!training || !taskForm.title || !taskForm.dueDate) {
      toast.error("Preencha titulo e prazo da tarefa.")
      return
    }

    addTask({
      trainingId: training.id,
      title: taskForm.title,
      owner: taskForm.owner,
      dueDate: new Date(`${taskForm.dueDate}T09:00:00`),
      status: taskForm.status as "pending" | "in_progress" | "completed",
      priority: taskForm.priority as "high" | "medium" | "low",
      notes: taskForm.notes,
    })

    setTaskForm({
      title: "",
      owner: "Equipa RH",
      dueDate: "",
      status: "pending",
      priority: "medium",
      notes: "",
    })
    setTaskDialogOpen(false)
    toast.success("Tarefa adicionada com sucesso.")
  }

  const handleExportRu = () => {
    if (!training || !validation?.eligible) {
      toast.error("A formação ainda não está elegível para exportação RU.")
      return
    }

    const payload = buildRuExportForTraining(training.id)
    if (!payload) return

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const href = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = href
    link.download = `ru-training-${training.id}.json`
    link.click()
    URL.revokeObjectURL(href)
    toast.success("Payload RU exportado com sucesso.")
  }

  if (!isReady) {
    return <div className="h-[720px] rounded-3xl bg-muted animate-pulse" />
  }

  if (!training) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-lg font-semibold">Formacao nao encontrada.</p>
          <p className="mt-2 text-muted-foreground">A sessao pode ter sido removida do ambiente local.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/trainings">Voltar ao catalogo</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="rounded-full" asChild>
        <Link href="/dashboard/trainings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao catálogo
        </Link>
      </Button>

      <Card className="relative overflow-hidden border-none bg-mesh-brand text-white shadow-soft-lg">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.18]" />
        <CardContent className="relative flex flex-col gap-6 p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border border-white/25 bg-white/15 text-white hover:bg-white/20">
                  {trainingStatusLabels[training.status]}
                </Badge>
                <Badge
                  className={
                    validation?.eligible
                      ? "border border-white/25 bg-white/90 text-primary hover:bg-white"
                      : "border border-white/25 bg-white/15 text-white hover:bg-white/20"
                  }
                >
                  {validation?.eligible ? "Elegível RU" : "Por validar RU"}
                </Badge>
                {training.mandatory && (
                  <Badge className="border border-white/25 bg-accent text-accent-foreground hover:bg-accent">Obrigatória</Badge>
                )}
              </div>
              <div>
                <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{training.title}</h1>
                <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
                  {training.description || "Vista operacional da sessão com validação RU em tempo real."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                <Link href={`/dashboard/trainings/${training.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </Button>
              <Button className="rounded-full bg-white text-primary shadow-soft hover:bg-white/90" onClick={handleExportRu} disabled={!validation?.eligible}>
                <FileJson className="mr-2 h-4 w-4" />
                Exportar RU
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/calendar">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Ver no calendario
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HeroStat label="Data" value={new Date(training.startDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })} />
            <HeroStat label="Duração" value={`${training.durationHours}h`} />
            <HeroStat label="Formador" value={training.instructor} />
            <HeroStat label="Participantes" value={`${participants.length}/${training.maxParticipants}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-soft">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {training.targetDepartments?.length
                ? training.targetDepartments.map((department) => (
                    <Badge key={department} variant="secondary">{department}</Badge>
                  ))
                : training.department && <Badge variant="secondary">{training.department}</Badge>}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Classificação RU</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Códigos oficiais aplicados a esta ação de formação.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="T30" value={`${training.educationAreaCode} · ${getRuLabel("T30", training.educationAreaCode)}`} />
              <MetricTile label="T31" value={`${training.trainingModalityCode} · ${getRuLabel("T31", training.trainingModalityCode)}`} />
              <MetricTile label="T32" value={`${training.trainingInitiativeCode} · ${getRuLabel("T32", training.trainingInitiativeCode)}`} />
              <MetricTile label="T33" value={`${training.trainingScheduleCode} · ${getRuLabel("T33", training.trainingScheduleCode)}`} />
              <MetricTile label="T34" value={`${training.trainingEntityCode} · ${getRuLabel("T34", training.trainingEntityCode)}`} />
              <MetricTile label="T36" value={`${training.trainingQualificationLevelCode} · ${getRuLabel("T36", training.trainingQualificationLevelCode)}`} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile label="Tipo" value={training.isInternal ? "Interna" : "Externa"} />
            <MetricTile label="Local" value={training.location || "A definir"} />
            <MetricTile label="Data de início" value={new Date(training.startDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })} />
            <MetricTile label="Duração" value={`${training.durationHours}h`} />
            <MetricTile label="Formador" value={training.instructor} />
            <MetricTile label="Lotação" value={`${participants.length}/${training.maxParticipants}`} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricSummary title="Participantes" value={String(participants.length)} subtitle={`${confirmedCount} confirmados`} icon={Users} />
        <MetricSummary title="Pendentes" value={String(pendingCount)} subtitle="Aguardam resposta ou acao" icon={Clock} />
        <MetricSummary title="Horas para RU" value={`${hoursForReport}h`} subtitle="Soma real de horas frequentadas" icon={FileJson} />
        <MetricSummary title="Checklist aberta" value={String(pendingChecklist)} subtitle="Tarefas por fechar" icon={CheckCircle2} />
      </div>

      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Participantes RU</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="guide">Guia de teste</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-4 p-4 md:flex-row">
              <Input
                value={participantSearch}
                onChange={(event) => setParticipantSearch(event.target.value)}
                placeholder="Pesquisar participante por nome, email ou departamento"
              />
              <Dialog open={participantDialogOpen} onOpenChange={setParticipantDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Associar user
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Associar colaborador</DialogTitle>
                    <DialogDescription>Escolha um colaborador existente para o inscrever nesta formacao.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Colaborador</Label>
                      <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar colaborador" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableEmployees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} · {employee.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddParticipant}>
                      <Plus className="mr-2 h-4 w-4" />
                      Associar a formacao
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trabalhador</TableHead>
                    <TableHead>Ficha RH</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>T28</TableHead>
                    <TableHead>T29</TableHead>
                    <TableHead>T35</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.map((participant) => {
                    const employee = state.employees.find((item) => item.id === participant.employeeId)
                    const hrReady = employee ? isEmployeeRuReady(employee) : false
                    const missingFields = employee ? getEmployeeRuMissingFields(employee) : ["Ficha RH em falta"]
                    return (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {participant.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-sm text-muted-foreground">{participant.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge variant={hrReady ? "secondary" : "destructive"}>
                              {hrReady ? "Valida" : "Incompleta"}
                            </Badge>
                            {!hrReady && (
                              <p className="max-w-[220px] text-xs text-muted-foreground">{missingFields.join(", ")}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            className="w-24"
                            value={participant.attendedHours}
                            onChange={(event) =>
                              updateParticipantRuData(training.id, participant.id, { attendedHours: Number(event.target.value) })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <RuInlineSelect
                            table="T28"
                            value={participant.trainingFrequencySituationCode}
                            onValueChange={(value) =>
                              updateParticipantRuData(training.id, participant.id, { trainingFrequencySituationCode: value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <RuInlineSelect
                            table="T29"
                            value={participant.trainingReferencePeriodCode}
                            onValueChange={(value) =>
                              updateParticipantRuData(training.id, participant.id, { trainingReferencePeriodCode: value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <RuInlineSelect
                            table="T35"
                            value={participant.certificateTypeCode}
                            onValueChange={(value) =>
                              updateParticipantRuData(training.id, participant.id, { certificateTypeCode: value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge className={participantStatusStyles[participant.status]}>{participantStatusLabels[participant.status]}</Badge>
                            <div className="flex flex-wrap gap-1">
                              <Button size="sm" variant="outline" onClick={() => updateParticipantStatus(training.id, participant.id, "confirmed")}>
                                Confirmar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateParticipantStatus(training.id, participant.id, "completed")}>
                                Concluir
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateParticipantStatus(training.id, participant.id, "absent")}>
                                Ausente
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeParticipant(training.id, participant.id)}>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tarefas pendentes</CardTitle>
                  <CardDescription>Checklist operacional para esta sessao.</CardDescription>
                </div>
                <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova tarefa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar tarefa</DialogTitle>
                      <DialogDescription>Crie um novo passo operacional para esta formacao.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label>Titulo</Label>
                        <Input value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Owner</Label>
                          <Input value={taskForm.owner} onChange={(event) => setTaskForm((current) => ({ ...current, owner: event.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Prazo</Label>
                          <Input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((current) => ({ ...current, dueDate: event.target.value }))} />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Estado</Label>
                          <Select value={taskForm.status} onValueChange={(value) => setTaskForm((current) => ({ ...current, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in_progress">Em progresso</SelectItem>
                              <SelectItem value="completed">Concluida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Prioridade</Label>
                          <Select value={taskForm.priority} onValueChange={(value) => setTaskForm((current) => ({ ...current, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">Alta</SelectItem>
                              <SelectItem value="medium">Media</SelectItem>
                              <SelectItem value="low">Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notas</Label>
                        <Textarea value={taskForm.notes} onChange={(event) => setTaskForm((current) => ({ ...current, notes: event.target.value }))} rows={4} />
                      </div>
                      <Button onClick={handleAddTask}>
                        <Plus className="mr-2 h-4 w-4" />
                        Guardar tarefa
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-3">
                {trainingTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={taskStatusStyles[task.status]}>{taskStatusLabels[task.status]}</Badge>
                          <Badge variant="outline">{taskPriorityLabels[task.priority]}</Badge>
                        </div>
                        <p className="mt-3 font-medium">{task.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{task.notes || "Sem notas adicionais."}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "in_progress")}>
                          Em curso
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "completed")}>
                          Fechar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Owner: {task.owner}</span>
                      <span>Prazo: {new Date(task.dueDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado da exportacao RU</CardTitle>
                <CardDescription>Critérios de elegibilidade e resumo do payload.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SummaryLine label="Ação elegível" value={validation?.eligible ? "Sim" : "Nao"} />
                <SummaryLine label="Participantes válidos" value={`${validation?.validParticipantCount ?? 0}/${validation?.participantCount ?? 0}`} />
                <SummaryLine label="Horas totais exportáveis" value={`${hoursForReport}h`} />
                <SummaryLine label="Sessao obrigatoria" value={training.mandatory ? "Sim" : "Nao"} />

                {validation && !validation.eligible && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                    <div className="mb-2 flex items-center gap-2 font-medium">
                      <ShieldAlert className="h-4 w-4" />
                      Bloqueios atuais
                    </div>
                    <div className="space-y-2">
                      {validation.issues.slice(0, 8).map((issue, index) => (
                        <div key={`${issue.field}-${index}`} className="rounded-xl border border-amber-200 bg-white/70 p-2">
                          {issue.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validation?.eligible && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    A ação já cumpre os critérios mínimos de exportação. O payload descarregado usa os códigos RU como string, incluindo zeros à esquerda.
                  </div>
                )}

                <div className="grid gap-3">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/calendar">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Confirmar no calendario
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Simular envio de convocatorias
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Guia rapido desta formacao</CardTitle>
              <CardDescription>Sequencia recomendada para validar o modulo ponta a ponta com esta sessao.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {trainingTestingGuide.map((step, index) => (
                <div key={step.id} className="rounded-2xl border p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid gap-3 pt-2 md:grid-cols-2">
                <Button asChild variant="outline">
                  <Link href="/dashboard/trainings/playbook">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Abrir playbook
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/calendar">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Validar calendario
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.16em] text-white/65">{label}</p>
      <p className="mt-1.5 truncate font-semibold text-white">{value}</p>
    </div>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-secondary/30 p-4 transition-colors hover:border-primary/30 hover:bg-secondary/50">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  )
}

function MetricSummary({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: typeof Users
}) {
  return (
    <Card className="overflow-hidden shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RuInlineSelect({
  table,
  value,
  onValueChange,
}: {
  table: RuTableKey
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ruCodeTables[table].map((entry) => (
          <SelectItem key={entry.code} value={entry.code}>
            {entry.code} · {entry.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
