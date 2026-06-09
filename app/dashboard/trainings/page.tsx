"use client"

import type { ChangeEvent } from "react"
import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import { toast } from "sonner"
import {
  buildCsv,
  collaboratorTemplatePath,
  getRuLabel,
  taskPriorityLabels,
  taskStatusLabels,
  trainingFormatLabels,
  trainingProviderTemplatePath,
  trainingStatusLabels,
  useTrainingWorkspace,
} from "@/lib/training-platform"

const setupSteps = [
  {
    id: "step-1",
    title: "Monte a base de colaboradores",
    description: "Importe o ficheiro preparado no Excel ou crie manualmente os primeiros colaboradores com departamento e objetivo anual de horas.",
    actionLabel: "Importar colaboradores",
    icon: Users,
  },
  {
    id: "step-2",
    title: "Registe as entidades formadoras",
    description: "Guarde parceiros, academias e centros externos para ter o catálogo operacional pronto antes das primeiras ações.",
    actionLabel: "Criar entidade",
    icon: Building2,
  },
  {
    id: "step-3",
    title: "Crie a primeira formação",
    description: "Basta começar com título, datas, duração e participantes. Os detalhes de reporting podem ser afinados depois.",
    actionLabel: "Nova formação",
    href: "/dashboard/trainings/new",
    icon: BookOpen,
  },
  {
    id: "step-4",
    title: "Exporte quando já houver dados",
    description: "Depois pode tirar o mapa de formações e o resumo por colaborador para apoiar o relatório único e reporting interno.",
    actionLabel: "Exportar dados",
    icon: Download,
  },
]

async function extractImportText(file: File) {
  if (/\.(xlsx|xls)$/i.test(file.name)) {
    const XLSX = await import("xlsx")
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      throw new Error("O ficheiro Excel não tem folhas para importar.")
    }

    return XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName], {
      blankrows: false,
    })
  }

  return file.text()
}

export default function TrainingsPage() {
  const {
    state,
    isReady,
    pendingTasks,
    createEmployee,
    importEmployeesFromText,
    createTrainingProvider,
    updateTrainingProvider,
    deleteTrainingProvider,
    importTrainingProvidersFromText,
    deleteTraining,
    departmentOptions,
    buildTrainingMapExport,
    buildEmployeeTrainingExport,
  } = useTrainingWorkspace()

  const employeeImportInputRef = useRef<HTMLInputElement | null>(null)
  const providerImportInputRef = useRef<HTMLInputElement | null>(null)

  const [search, setSearch] = useState("")
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [managerFilter, setManagerFilter] = useState("all")
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [providerDialogOpen, setProviderDialogOpen] = useState(false)
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null)
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    department: "",
    employeeNumber: "",
    jobTitle: "",
    location: "",
    manager: "",
    trainingHoursTarget: "40",
  })
  const [providerForm, setProviderForm] = useState({
    name: "",
    typeCode: "02",
    nif: "",
    contactEmail: "",
    location: "",
  })

  const filteredTrainings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return state.trainings

    return state.trainings.filter((training) =>
      training.title.toLowerCase().includes(normalizedSearch) ||
      training.instructor.toLowerCase().includes(normalizedSearch) ||
      training.skills.some((skill) => skill.toLowerCase().includes(normalizedSearch)),
    )
  }, [search, state.trainings])

  const employeeRows = useMemo(() => {
    return state.employees.map((employee) => {
      const participations = Object.entries(state.participantsByTraining).flatMap(([trainingId, participants]) =>
        participants
          .filter((participant) => participant.employeeId === employee.id)
          .map((participant) => ({
            participant,
            training: state.trainings.find((training) => training.id === trainingId) || null,
          })),
      )

      const attendedHours = participations.reduce((total, item) => total + item.participant.attendedHours, 0)
      const completedTrainings = participations.filter((item) => item.participant.status === "completed").length
      const hoursTarget = employee.trainingHoursTarget || 40
      const lastTrainingDate = participations
        .map((item) => item.training?.endDate)
        .filter((date): date is Date => Boolean(date))
        .sort((left, right) => right.getTime() - left.getTime())[0]

      return {
        ...employee,
        attendedHours,
        hoursTarget,
        progress: hoursTarget > 0 ? Math.min(100, Math.round((attendedHours / hoursTarget) * 100)) : 0,
        trainingsCount: participations.length,
        completedTrainings,
        lastTrainingDate,
      }
    })
  }, [state.employees, state.participantsByTraining, state.trainings])

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(employeeRows.map((employee) => employee.location).filter((value): value is string => Boolean(value)))).sort((a, b) =>
        a.localeCompare(b, "pt"),
      ),
    [employeeRows],
  )

  const managerOptions = useMemo(
    () =>
      Array.from(new Set(employeeRows.map((employee) => employee.manager).filter((value): value is string => Boolean(value)))).sort((a, b) =>
        a.localeCompare(b, "pt"),
      ),
    [employeeRows],
  )

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = employeeSearch.trim().toLowerCase()

    return employeeRows.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          employee.name,
          employee.email,
          employee.department,
          employee.jobTitle,
          employee.location,
          employee.manager,
          employee.employeeNumber,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))

      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
      const matchesLocation = locationFilter === "all" || employee.location === locationFilter
      const matchesManager = managerFilter === "all" || employee.manager === managerFilter

      return matchesSearch && matchesDepartment && matchesLocation && matchesManager
    })
  }, [departmentFilter, employeeRows, employeeSearch, locationFilter, managerFilter])

  const hasWorkspaceData =
    state.trainings.length > 0 || state.employees.length > 0 || state.trainingProviders.length > 0

  const totalParticipants = Object.values(state.participantsByTraining).reduce((sum, items) => sum + items.length, 0)

  const resetProviderForm = () => {
    setProviderForm({
      name: "",
      typeCode: "02",
      nif: "",
      contactEmail: "",
      location: "",
    })
    setEditingProviderId(null)
  }

  const openCreateProviderDialog = () => {
    resetProviderForm()
    setProviderDialogOpen(true)
  }

  const openEditProviderDialog = (providerId: string) => {
    const provider = state.trainingProviders.find((item) => item.id === providerId)
    if (!provider) return

    setEditingProviderId(provider.id)
    setProviderForm({
      name: provider.name,
      typeCode: provider.typeCode,
      nif: provider.nif || "",
      contactEmail: provider.contactEmail || "",
      location: provider.location || "",
    })
    setProviderDialogOpen(true)
  }

  const handleCreateEmployee = () => {
    if (!employeeForm.name || !employeeForm.email || !employeeForm.department) {
      toast.error("Preencha nome, email e departamento para criar o colaborador.")
      return
    }

    createEmployee({
      ...employeeForm,
      trainingHoursTarget: Number(employeeForm.trainingHoursTarget) || 40,
    })

    setEmployeeDialogOpen(false)
    setEmployeeForm({
      name: "",
      email: "",
      department: "",
      employeeNumber: "",
      jobTitle: "",
      location: "",
      manager: "",
      trainingHoursTarget: "40",
    })
    toast.success("Colaborador criado com sucesso.")
  }

  const handleSaveProvider = () => {
    if (!providerForm.name) {
      toast.error("Indique pelo menos o nome da entidade formadora.")
      return
    }

    if (editingProviderId) {
      updateTrainingProvider(editingProviderId, providerForm)
      toast.success("Entidade formadora atualizada.")
    } else {
      createTrainingProvider(providerForm)
      toast.success("Entidade formadora criada.")
    }

    setProviderDialogOpen(false)
    resetProviderForm()
  }

  const handleDeleteProvider = (providerId: string, providerName: string) => {
    const confirmed = window.confirm(`Eliminar a entidade formadora "${providerName}"?`)
    if (!confirmed) return

    deleteTrainingProvider(providerId)
    toast.success("Entidade formadora removida.")
  }

  const handleDeleteTraining = (trainingId: string) => {
    const confirmed = window.confirm("Eliminar esta formação e as tarefas associadas?")
    if (!confirmed) return

    deleteTraining(trainingId)
    toast.success("Formação eliminada.")
  }

  const downloadCsvFile = (filename: string, rows: Array<Record<string, string | number | undefined | null>>) => {
    if (rows.length === 0) {
      toast.error("Ainda não existem dados para exportar.")
      return
    }

    const csv = buildCsv(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleEmployeesImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!/\.(csv|txt|xlsx|xls)$/i.test(file.name)) {
      toast.error("Use um ficheiro Excel (.xls ou .xlsx) ou CSV.")
      return
    }

    try {
      const summary = importEmployeesFromText(await extractImportText(file))
      if (summary.created === 0 && summary.updated === 0) {
        toast.error(summary.errors[0] || "Não foi possível importar colaboradores.")
        return
      }

      toast.success(`${summary.created} criado(s) e ${summary.updated} atualizado(s).`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível ler o ficheiro.")
    }
  }

  const handleProvidersImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!/\.(csv|txt|xlsx|xls)$/i.test(file.name)) {
      toast.error("Use um ficheiro Excel (.xls ou .xlsx) ou CSV.")
      return
    }

    try {
      const summary = importTrainingProvidersFromText(await extractImportText(file))
      if (summary.created === 0 && summary.updated === 0) {
        toast.error(summary.errors[0] || "Não foi possível importar entidades formadoras.")
        return
      }

      toast.success(`${summary.created} criada(s) e ${summary.updated} atualizada(s).`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível ler o ficheiro.")
    }
  }

  if (!isReady) {
    return <div className="h-[620px] rounded-3xl bg-muted animate-pulse" />
  }

  return (
    <div className="space-y-6">
      <input
        ref={employeeImportInputRef}
        type="file"
        accept=".xls,.xlsx,.csv,.txt"
        className="hidden"
        onChange={handleEmployeesImport}
      />
      <input
        ref={providerImportInputRef}
        type="file"
        accept=".xls,.xlsx,.csv,.txt"
        className="hidden"
        onChange={handleProvidersImport}
      />

      <Card className="relative overflow-hidden border-none bg-mesh-brand text-white shadow-soft-lg">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.18]" />
        <CardContent className="relative grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="space-y-4">
            <Badge className="w-fit border border-white/25 bg-white/15 text-white hover:bg-white/20">Módulo de Formação</Badge>
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Crie a operação real da formação.</h1>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
                Importe colaboradores a partir do Excel, organize entidades formadoras, registe ações e exporte os
                mapas quando precisar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-white text-primary shadow-soft hover:bg-white/90">
                <Link href="/dashboard/trainings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova formação
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => employeeImportInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar colaboradores
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => providerImportInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar entidades
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/dashboard/calendar">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Abrir calendário
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/65">Resumo atual</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SummaryStat label="Formações" value={String(state.trainings.length)} />
                <SummaryStat label="Colaboradores" value={String(state.employees.length)} />
                <SummaryStat label="Entidades formadoras" value={String(state.trainingProviders.length)} />
                <SummaryStat label="Participações" value={String(totalParticipants)} />
              </div>
            </div>
            <div className="grid gap-3 2xl:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="h-auto min-h-11 w-full justify-start whitespace-normal border-white/20 bg-white/5 px-4 py-3 text-left leading-snug text-white hover:bg-white/10"
              >
                <Link href={collaboratorTemplatePath}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Modelo de colaboradores
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto min-h-11 w-full justify-start whitespace-normal border-white/20 bg-white/5 px-4 py-3 text-left leading-snug text-white hover:bg-white/10"
              >
                <Link href={trainingProviderTemplatePath}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Modelo de entidades
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar colaborador</DialogTitle>
            <DialogDescription>Adicione um colaborador real para o poder associar às próximas formações.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={employeeForm.name} onChange={(event) => setEmployeeForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={employeeForm.email} onChange={(event) => setEmployeeForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Input value={employeeForm.department} onChange={(event) => setEmployeeForm((current) => ({ ...current, department: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Função</Label>
                <Input value={employeeForm.jobTitle} onChange={(event) => setEmployeeForm((current) => ({ ...current, jobTitle: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Número interno</Label>
                <Input value={employeeForm.employeeNumber} onChange={(event) => setEmployeeForm((current) => ({ ...current, employeeNumber: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Horas objetivo por ano</Label>
                <Input
                  type="number"
                  min="1"
                  value={employeeForm.trainingHoursTarget}
                  onChange={(event) => setEmployeeForm((current) => ({ ...current, trainingHoursTarget: event.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Localização</Label>
                <Input value={employeeForm.location} onChange={(event) => setEmployeeForm((current) => ({ ...current, location: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Manager</Label>
                <Input value={employeeForm.manager} onChange={(event) => setEmployeeForm((current) => ({ ...current, manager: event.target.value }))} />
              </div>
            </div>
          </div>
          <Button onClick={handleCreateEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            Guardar colaborador
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={providerDialogOpen}
        onOpenChange={(open) => {
          setProviderDialogOpen(open)
          if (!open) resetProviderForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProviderId ? "Editar entidade formadora" : "Nova entidade formadora"}</DialogTitle>
            <DialogDescription>Guarde parceiros externos ou entidades internas para reutilizar nas próximas formações.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={providerForm.name} onChange={(event) => setProviderForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de entidade</Label>
                <Select value={providerForm.typeCode} onValueChange={(value) => setProviderForm((current) => ({ ...current, typeCode: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">Entidade empregadora</SelectItem>
                    <SelectItem value="02">Centro de formação externo</SelectItem>
                    <SelectItem value="03">Instituição de ensino</SelectItem>
                    <SelectItem value="04">Associação setorial / profissional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>NIF</Label>
                <Input value={providerForm.nif} onChange={(event) => setProviderForm((current) => ({ ...current, nif: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email de contacto</Label>
                <Input value={providerForm.contactEmail} onChange={(event) => setProviderForm((current) => ({ ...current, contactEmail: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Localização</Label>
                <Input value={providerForm.location} onChange={(event) => setProviderForm((current) => ({ ...current, location: event.target.value }))} />
              </div>
            </div>
          </div>
          <Button onClick={handleSaveProvider}>
            <Plus className="mr-2 h-4 w-4" />
            {editingProviderId ? "Guardar alterações" : "Criar entidade"}
          </Button>
        </DialogContent>
      </Dialog>

      {!hasWorkspaceData ? (
        <Card>
          <CardContent className="p-6 lg:p-8">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookOpen />
                </EmptyMedia>
                <EmptyTitle>A área de formação está pronta a configurar</EmptyTitle>
                <EmptyDescription>
                  Comece pelos colaboradores e pelas entidades formadoras. Depois crie a primeira ação para ativar
                  catálogo, calendário, progresso e exportações.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="w-full max-w-4xl">
                <div className="flex flex-wrap justify-center gap-3">
                  <Button className="rounded-full" onClick={() => employeeImportInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar colaboradores
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={() => providerImportInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar entidades formadoras
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={openCreateProviderDialog}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Criar entidade formadora
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/dashboard/trainings/new">Criar formação</Link>
                  </Button>
                </div>

                <div className="grid w-full gap-4 md:grid-cols-2">
                  {setupSteps.map((step, index) => {
                    const Icon = step.icon

                    const handleClick = () => {
                      if (step.id === "step-1") employeeImportInputRef.current?.click()
                      if (step.id === "step-2") openCreateProviderDialog()
                      if (step.id === "step-4") {
                        downloadCsvFile("mapa-formacoes.csv", buildTrainingMapExport())
                      }
                    }

                    return (
                      <div key={step.id} className="group rounded-3xl border bg-card p-6 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Passo {index + 1}</Badge>
                            <div>
                              <p className="text-lg font-semibold text-foreground">{step.title}</p>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft transition-transform group-hover:scale-105">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="mt-6">
                          {step.href ? (
                            <Button asChild variant="outline" className="rounded-full">
                              <Link href={step.href}>{step.actionLabel}</Link>
                            </Button>
                          ) : (
                            <Button variant="outline" className="rounded-full" onClick={handleClick}>
                              {step.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="overflow-hidden border-border shadow-soft transition-shadow hover:shadow-soft-lg">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle>Entidades formadoras</CardTitle>
                <CardDescription>Crie ou importe o diretório de parceiros e centros de formação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-secondary/40 p-4">
                  <p className="text-3xl font-bold tracking-tight">{state.trainingProviders.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {state.trainingProviders.length === 1 ? "entidade registada" : "entidades registadas"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={openCreateProviderDialog} className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova entidade
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={() => providerImportInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar lista
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border shadow-soft transition-shadow hover:shadow-soft-lg">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle>Colaboradores</CardTitle>
                <CardDescription>Importe a lista do Excel ou crie manualmente os primeiros registos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-secondary/40 p-4">
                  <p className="text-3xl font-bold tracking-tight">{state.employees.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {state.employees.length === 1 ? "colaborador disponível" : "colaboradores disponíveis"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DialogTriggerButton onClick={() => setEmployeeDialogOpen(true)} label="Novo colaborador" icon={UserPlus} />
                  <Button variant="outline" className="rounded-full" onClick={() => employeeImportInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar ficheiro
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border shadow-soft transition-shadow hover:shadow-soft-lg">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
                  <Download className="h-5 w-5" />
                </div>
                <CardTitle>Exportações</CardTitle>
                <CardDescription>Leve o mapa global e o resumo por colaborador para reporting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => downloadCsvFile("mapa-formacoes.csv", buildTrainingMapExport())}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar mapa de formações
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => downloadCsvFile("formacoes-por-colaborador.csv", buildEmployeeTrainingExport())}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar formações por colaborador
                </Button>
                <div className="rounded-2xl border border-dashed p-3 text-sm text-muted-foreground">
                  As exportações continuam em CSV, prontas para abrir no Excel ou anexar ao reporting interno.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Catálogo de formações</CardTitle>
                  <CardDescription>Lista viva das ações já registadas neste ambiente.</CardDescription>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Pesquisar por título, formador ou skill"
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredTrainings.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                    Ainda não existem formações com este filtro.
                  </div>
                )}
                {filteredTrainings.map((training) => (
                  <div key={training.id} className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                    <span className="absolute inset-y-0 left-0 w-1 bg-gradient-brand opacity-70 transition-opacity group-hover:opacity-100" />
                    <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{training.title}</p>
                          <Badge variant="outline">{trainingFormatLabels[training.format]}</Badge>
                          <Badge variant="secondary">{trainingStatusLabels[training.status]}</Badge>
                          {training.mandatory && <Badge className="bg-accent text-accent-foreground hover:bg-accent">Obrigatória</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{training.description || "Sem descrição."}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{training.currentParticipants}/{training.maxParticipants} participantes</span>
                          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{training.durationHours}h</span>
                          <span>{training.instructor}</span>
                          <span>
                            {training.targetDepartments?.length
                              ? training.targetDepartments.join(", ")
                              : training.department || "Sem departamento definido"}
                          </span>
                          <span>{training.trainingProviderName || getRuLabel("T34", training.trainingEntityCode)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                          <Link href={`/dashboard/trainings/${training.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Abrir
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => handleDeleteTraining(training.id)}>
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Apagar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tarefas em aberto</CardTitle>
                <CardDescription>Próximas ações para manter a execução em dia.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                    Ainda não existem tarefas pendentes. As tarefas aparecem quando cria formações.
                  </div>
                )}
                {pendingTasks.slice(0, 6).map((task) => (
                  <div key={task.id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{task.title}</p>
                      <Badge variant="outline">{taskPriorityLabels[task.priority]}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{task.owner}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{task.dueDate.toLocaleDateString("pt-PT")}</span>
                      <span>·</span>
                      <span>{taskStatusLabels[task.status]}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card id="colaboradores">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <CardTitle>Colaboradores e progresso</CardTitle>
                  <CardDescription>
                    Filtre por dados do ficheiro importado, acompanhe horas concluídas e veja rapidamente quem já tem histórico.
                  </CardDescription>
                </div>
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={employeeSearch}
                    onChange={(event) => setEmployeeSearch(event.target.value)}
                    placeholder="Pesquisar nome, email, função, manager..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os departamentos</SelectItem>
                    {departmentOptions.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as localizações</SelectItem>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={managerFilter} onValueChange={setManagerFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os managers</SelectItem>
                    {managerOptions.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEmployees.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
                  Ainda não existem colaboradores com estes filtros. Pode importar um ficheiro vindo do Excel ou criar um
                  colaborador manualmente.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Contexto</TableHead>
                      <TableHead>Horas de formação</TableHead>
                      <TableHead>Atividade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                            {employee.employeeNumber && (
                              <div className="text-xs text-muted-foreground">ID interno: {employee.employeeNumber}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <div>{employee.department}</div>
                            {employee.jobTitle && <div className="text-sm text-muted-foreground">{employee.jobTitle}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1 text-sm">
                            <div>{employee.location || "Sem localização"}</div>
                            <div className="text-muted-foreground">{employee.manager || "Sem manager"}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[260px] align-top">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{employee.attendedHours}h concluídas</span>
                              <span className="text-muted-foreground">/{employee.hoursTarget}h</span>
                            </div>
                            <Progress value={employee.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {employee.progress >= 100
                                ? "Objetivo anual atingido"
                                : `${employee.hoursTarget - employee.attendedHours}h em falta para o objetivo`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1 text-sm">
                            <div>{employee.trainingsCount} formação(ões)</div>
                            <div className="text-muted-foreground">{employee.completedTrainings} concluída(s)</div>
                            <div className="text-muted-foreground">
                              {employee.lastTrainingDate ? employee.lastTrainingDate.toLocaleDateString("pt-PT") : "Sem histórico"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Lista de entidades formadoras</CardTitle>
                <CardDescription>Catálogo simples para organizar quem entrega as formações.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => providerImportInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </Button>
                <Button onClick={openCreateProviderDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova entidade
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.trainingProviders.length === 0 && (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                  Ainda não existem entidades formadoras. Crie manualmente ou importe o modelo para começar.
                </div>
              )}
              {state.trainingProviders.map((provider) => (
                <div key={provider.id} className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{provider.name}</p>
                      <Badge variant="outline">{getRuLabel("T34", provider.typeCode)}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{provider.nif || "Sem NIF"}</span>
                      <span>{provider.contactEmail || "Sem email"}</span>
                      <span>{provider.location || "Sem localização"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditProviderDialog(provider.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteProvider(provider.id, provider.name)}>
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      Apagar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function DialogTriggerButton({
  onClick,
  label,
  icon: Icon,
}: {
  onClick: () => void
  label: string
  icon: typeof UserPlus
}) {
  return (
    <Button onClick={onClick}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
