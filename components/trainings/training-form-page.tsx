"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft, CalendarDays, Plus, UserPlus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { TrainingActionRecord, TrainingFormat, TrainingParticipantPayload, TrainingParticipantStatus, TrainingStatus, TrainingType } from "@/lib/training-platform"
import {
  getEmployeeRuMissingFields,
  getRuLabel,
  isEmployeeRuReady,
  ruCodeTables,
  trainingStatusLabels,
  useTrainingWorkspace,
} from "@/lib/training-platform"

interface TrainingFormPageProps {
  mode: "create" | "edit"
  trainingId?: string
}

interface FormState {
  title: string
  description: string
  type: TrainingType
  format: TrainingFormat
  instructor: string
  durationHours: string
  maxParticipants: string
  location: string
  mandatory: boolean
  targetDepartments: string[]
  status: TrainingStatus
  startDate: string
  endDate: string
  skills: string[]
  educationAreaCode: string
  trainingModalityCode: string
  trainingInitiativeCode: string
  trainingScheduleCode: string
  trainingEntityCode: string
  trainingQualificationLevelCode: string
  trainingProviderId: string
  trainingProviderName: string
}

interface ParticipantDraft extends TrainingParticipantPayload {
  name: string
  email: string
  department: string
}

const skillSuggestions = [
  "Seguranca",
  "Compliance",
  "RGPD",
  "Lideranca",
  "Excel",
  "Analise de Dados",
  "Agile",
  "Scrum",
  "Power BI",
  "Comunicacao",
]

const emptyFormState: FormState = {
  title: "",
  description: "",
  type: "internal",
  format: "presencial",
  instructor: "",
  durationHours: "8",
  maxParticipants: "20",
  location: "",
  mandatory: false,
  targetDepartments: [],
  status: "scheduled",
  startDate: "",
  endDate: "",
  skills: [],
  educationAreaCode: "345",
  trainingModalityCode: "01",
  trainingInitiativeCode: "01",
  trainingScheduleCode: "01",
  trainingEntityCode: "01",
  trainingQualificationLevelCode: "03",
  trainingProviderId: "",
  trainingProviderName: "",
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function createFormState(training?: TrainingActionRecord): FormState {
  if (!training) return emptyFormState

  return {
    title: training.title,
    description: training.description,
    type: training.type,
    format: training.format,
    instructor: training.instructor,
    durationHours: String(training.durationHours),
    maxParticipants: String(training.maxParticipants),
    location: training.location || "",
    mandatory: training.mandatory,
    targetDepartments: training.targetDepartments?.length
      ? training.targetDepartments
      : training.department
        ? [training.department]
        : [],
    status: training.status,
    startDate: toDateInputValue(new Date(training.startDate)),
    endDate: toDateInputValue(new Date(training.endDate)),
    skills: training.skills,
    educationAreaCode: training.educationAreaCode,
    trainingModalityCode: training.trainingModalityCode,
    trainingInitiativeCode: training.trainingInitiativeCode,
    trainingScheduleCode: training.trainingScheduleCode,
    trainingEntityCode: training.trainingEntityCode,
    trainingQualificationLevelCode: training.trainingQualificationLevelCode,
    trainingProviderId: training.trainingProviderId || "",
    trainingProviderName: training.trainingProviderName || "",
  }
}

function createCreateModeFormState(): FormState {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7)
  const endDate = new Date(startDate)

  return {
    ...emptyFormState,
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(endDate),
  }
}

function deriveInternal(type: TrainingType) {
  return type === "internal"
}

export function TrainingFormPage({ mode, trainingId }: TrainingFormPageProps) {
  const router = useRouter()
  const { state, isReady, departmentOptions, createTraining, updateTraining, createEmployee } = useTrainingWorkspace()
  const training = useMemo(
    () => state.trainings.find((item) => item.id === trainingId),
    [state.trainings, trainingId],
  )

  const [form, setForm] = useState<FormState>(emptyFormState)
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([])
  const [participantDrafts, setParticipantDrafts] = useState<ParticipantDraft[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [departmentInput, setDepartmentInput] = useState("")
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const initializedTrainingIdRef = useRef<string | null>(null)
  const createDefaultsAppliedRef = useRef(false)
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    department: "Recursos Humanos",
    employeeNumber: "",
    jobTitle: "",
    location: "Lisboa",
  })

  useEffect(() => {
    if (!isReady) return
    if (mode !== "create") return
    if (createDefaultsAppliedRef.current) return

    createDefaultsAppliedRef.current = true
    initializedTrainingIdRef.current = "__create__"
    setForm(createCreateModeFormState())
    setSelectedEmployeeIds([])
    setParticipantDrafts([])
  }, [isReady, mode])

  useEffect(() => {
    if (!isReady) return
    if (mode !== "edit") return
    if (!training) return
    if (initializedTrainingIdRef.current === training.id) return

    initializedTrainingIdRef.current = training.id
    createDefaultsAppliedRef.current = true
    const participants = state.participantsByTraining[training.id] || []

    setForm(createFormState(training))
    setSelectedEmployeeIds(participants.map((participant) => participant.employeeId))
    setParticipantDrafts(
      participants.map((participant) => ({
        employeeId: participant.employeeId,
        name: participant.name,
        email: participant.email,
        department: participant.department,
        status: participant.status,
        attendedHours: participant.attendedHours,
        trainingFrequencySituationCode: participant.trainingFrequencySituationCode,
        trainingReferencePeriodCode: participant.trainingReferencePeriodCode,
        certificateTypeCode: participant.certificateTypeCode,
      })),
    )
  }, [isReady, mode, state.participantsByTraining, training])

  const filteredEmployees = useMemo(() => {
    return state.employees.filter((employee) => {
      const normalizedSearch = userSearch.toLowerCase()
      return (
        employee.name.toLowerCase().includes(normalizedSearch) ||
        employee.email.toLowerCase().includes(normalizedSearch) ||
        employee.department.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [state.employees, userSearch])

  const availableDepartments = useMemo(
    () =>
      Array.from(new Set([...departmentOptions, ...form.targetDepartments].filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, "pt"),
      ),
    [departmentOptions, form.targetDepartments],
  )

  const syncParticipantDraft = (employeeId: string, selected: boolean) => {
    const employee = state.employees.find((item) => item.id === employeeId)
    if (!employee) return

    if (!selected) {
      setParticipantDrafts((current) => current.filter((draft) => draft.employeeId !== employeeId))
      return
    }

    setParticipantDrafts((current) => {
      if (current.some((draft) => draft.employeeId === employeeId)) return current
      return [
        ...current,
        {
          employeeId: employee.id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          status: "pending",
          attendedHours: Number(form.durationHours) || 0,
          trainingFrequencySituationCode: "01",
          trainingReferencePeriodCode: "01",
          certificateTypeCode: "01",
        },
      ]
    })
  }

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployeeIds((current) => {
      const isSelected = current.includes(employeeId)
      syncParticipantDraft(employeeId, !isSelected)
      return isSelected ? current.filter((id) => id !== employeeId) : [...current, employeeId]
    })
  }

  const updateParticipantDraft = (
    employeeId: string,
    patch: Partial<ParticipantDraft>,
  ) => {
    setParticipantDrafts((current) =>
      current.map((draft) => draft.employeeId === employeeId ? { ...draft, ...patch } : draft),
    )
  }

  const updateFormField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => {
      if (Object.is(current[field], value)) return current
      return { ...current, [field]: value }
    })
  }

  const updateEmployeeFormField = <K extends keyof typeof employeeForm>(field: K, value: (typeof employeeForm)[K]) => {
    setEmployeeForm((current) => {
      if (Object.is(current[field], value)) return current
      return { ...current, [field]: value }
    })
  }

  const addSkill = (skill: string) => {
    const normalized = skill.trim()
    if (!normalized || form.skills.includes(normalized)) return
    setForm((current) => ({ ...current, skills: [...current.skills, normalized] }))
    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setForm((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }))
  }

  const toggleTargetDepartment = (department: string) => {
    setForm((current) => {
      const exists = current.targetDepartments.includes(department)
      return {
        ...current,
        targetDepartments: exists
          ? current.targetDepartments.filter((item) => item !== department)
          : [...current.targetDepartments, department].sort((a, b) => a.localeCompare(b, "pt")),
      }
    })
  }

  const addCustomDepartment = () => {
    const normalized = departmentInput.trim()
    if (!normalized) return

    setForm((current) => {
      if (current.targetDepartments.includes(normalized)) return current
      return {
        ...current,
        targetDepartments: [...current.targetDepartments, normalized].sort((a, b) => a.localeCompare(b, "pt")),
      }
    })
    setDepartmentInput("")
  }

  const addEmployeesByDepartments = (departments: string[]) => {
    if (departments.length === 0) {
      toast.error("Selecione pelo menos um departamento-alvo primeiro.")
      return
    }

    const departmentSet = new Set(departments)
    const employeesToAdd = state.employees.filter((employee) => departmentSet.has(employee.department))

    if (employeesToAdd.length === 0) {
      toast.error("Ainda não existem colaboradores nesses departamentos.")
      return
    }

    setSelectedEmployeeIds((current) =>
      Array.from(new Set([...current, ...employeesToAdd.map((employee) => employee.id)])),
    )

    let addedCount = 0
    setParticipantDrafts((current) => {
      const existingIds = new Set(current.map((draft) => draft.employeeId))
      const draftsToAdd = employeesToAdd
        .filter((employee) => !existingIds.has(employee.id))
        .map((employee) => ({
          employeeId: employee.id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          status: "pending" as TrainingParticipantStatus,
          attendedHours: Number(form.durationHours) || 0,
          trainingFrequencySituationCode: "01",
          trainingReferencePeriodCode: "01",
          certificateTypeCode: "01",
        }))

      addedCount = draftsToAdd.length
      return [...current, ...draftsToAdd]
    })

    toast.success(
      addedCount === 0
        ? "Todos os colaboradores desses departamentos já estavam associados."
        : `${addedCount} colaborador(es) do(s) departamento(s) selecionado(s) foram associados.`,
    )
  }

  const handleCreateEmployee = () => {
    if (!employeeForm.name || !employeeForm.email) {
      toast.error("Preencha pelo menos nome e email.")
      return
    }

    const employee = createEmployee(employeeForm)
    setSelectedEmployeeIds((current) => [...current, employee.id])
    setParticipantDrafts((current) => [
      ...current,
      {
        employeeId: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        status: "pending",
        attendedHours: Number(form.durationHours) || 0,
        trainingFrequencySituationCode: "01",
        trainingReferencePeriodCode: "01",
        certificateTypeCode: "01",
      },
    ])
    setEmployeeDialogOpen(false)
    setEmployeeForm({
      name: "",
      email: "",
      department: "Recursos Humanos",
      employeeNumber: "",
      jobTitle: "",
      location: "Lisboa",
    })
    toast.success("Colaborador criado com ficha RH demo valida e associado a esta formacao.")
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.title || !form.instructor || !form.startDate || !form.endDate) {
      toast.error("Preencha os campos base da formacao.")
      return
    }

    const hasIncompleteParticipants = participantDrafts.some((participant) =>
      !(participant.attendedHours > 0) ||
      !participant.trainingFrequencySituationCode ||
      !participant.trainingReferencePeriodCode ||
      !participant.certificateTypeCode,
    )

    if (hasIncompleteParticipants) {
      toast.error("Todos os participantes precisam de horas frequentadas e codigos T28, T29 e T35.")
      return
    }

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      format: form.format,
      instructor: form.instructor,
      duration: Number(form.durationHours),
      durationHours: Number(form.durationHours),
      maxParticipants: Number(form.maxParticipants),
      location: form.location,
      mandatory: form.mandatory,
      department: form.targetDepartments.length === 1 ? form.targetDepartments[0] : undefined,
      targetDepartments: form.targetDepartments,
      status: form.status,
      startDate: new Date(`${form.startDate}T09:00:00`),
      endDate: new Date(`${form.endDate}T17:00:00`),
      skills: form.skills,
      isInternal: deriveInternal(form.type),
      educationAreaCode: form.educationAreaCode,
      trainingModalityCode: form.trainingModalityCode,
      trainingInitiativeCode: form.trainingInitiativeCode,
      trainingScheduleCode: form.trainingScheduleCode,
      trainingEntityCode: form.trainingEntityCode,
      trainingQualificationLevelCode: form.trainingQualificationLevelCode,
      trainingProviderId: form.trainingProviderId || undefined,
      trainingProviderName: form.trainingProviderName || undefined,
      participants: participantDrafts,
    }

    if (mode === "edit" && trainingId) {
      updateTraining(trainingId, payload)
      toast.success("Formacao atualizada com sucesso.")
      router.push(`/dashboard/trainings/${trainingId}`)
      return
    }

    const createdTraining = createTraining(payload)
    toast.success("Formacao criada com sucesso.")
    router.push(`/dashboard/trainings/${createdTraining.id}`)
  }

  if (!isReady) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[520px] rounded-2xl bg-muted animate-pulse" />
          <div className="h-[520px] rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (mode === "edit" && !training) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <p className="text-lg font-semibold">Formacao nao encontrada.</p>
          <p className="mt-2 text-muted-foreground">A formacao pode ter sido removida ou ainda nao existir neste ambiente de teste.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/trainings">Voltar ao catalogo</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={mode === "edit" && trainingId ? `/dashboard/trainings/${trainingId}` : "/dashboard/trainings"}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {mode === "edit" ? "Editar formacao" : "Nova formacao"}
            </h1>
            <p className="text-muted-foreground">
              Configure a ação com os dados principais. Os códigos de reporting continuam disponíveis mais abaixo.
            </p>
          </div>
        </div>

        <Button variant="outline" asChild>
          <Link href="/dashboard/trainings/playbook">Ver guia de testes</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da formacao</CardTitle>
              <CardDescription>Titulo, agenda e identificacao geral da ação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Ex: RGPD para equipas comerciais"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Contexto, objetivos e evidencias esperadas."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Interna / Externa</Label>
                  <Select value={form.type} onValueChange={(value: TrainingType) => updateFormField("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Interna</SelectItem>
                      <SelectItem value="external">Externa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formato visual</Label>
                  <Select value={form.format} onValueChange={(value: TrainingFormat) => updateFormField("format", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hibrido">Hibrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={form.status} onValueChange={(value: TrainingStatus) => updateFormField("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(trainingStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Departamentos-alvo</Label>
                  <div className="rounded-xl border p-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={form.targetDepartments.length === 0 ? "default" : "outline"}
                        onClick={() => updateFormField("targetDepartments", [])}
                      >
                        Todos os departamentos
                      </Button>
                      {availableDepartments.map((department) => (
                        <Button
                          key={department}
                          type="button"
                          size="sm"
                          variant={form.targetDepartments.includes(department) ? "default" : "outline"}
                          onClick={() => toggleTargetDepartment(department)}
                        >
                          {department}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={departmentInput}
                        onChange={(event) => setDepartmentInput(event.target.value)}
                        placeholder="Adicionar departamento manualmente"
                      />
                      <Button type="button" variant="outline" onClick={addCustomDepartment}>
                        Adicionar
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {form.targetDepartments.length === 0
                        ? "Sem filtro por departamento. A formação fica aberta a toda a estrutura."
                        : `Departamentos selecionados: ${form.targetDepartments.join(", ")}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de inicio</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      className="pl-10"
                      value={form.startDate}
                      onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de fim</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      className="pl-10"
                      value={form.endDate}
                      onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="durationHours">Duracao (horas)</Label>
                  <Input
                    id="durationHours"
                    type="number"
                    min="1"
                    value={form.durationHours}
                    onChange={(event) => setForm((current) => ({ ...current, durationHours: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Lotacao</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={form.maxParticipants}
                    onChange={(event) => setForm((current) => ({ ...current, maxParticipants: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Sala / link</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    placeholder="Sala Atlas ou Teams"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Formador</Label>
                <Input
                  id="instructor"
                  value={form.instructor}
                  onChange={(event) => setForm((current) => ({ ...current, instructor: event.target.value }))}
                  placeholder="Nome da pessoa ou entidade"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Entidade formadora registada</Label>
                <Select
                  value={form.trainingProviderId || "none"}
                  onValueChange={(value) => {
                    setForm((current) => {
                      if (value === "none") {
                        return {
                          ...current,
                          trainingProviderId: "",
                          trainingProviderName: "",
                        }
                      }

                      const provider = state.trainingProviders.find((item) => item.id === value)
                      return {
                        ...current,
                        trainingProviderId: value,
                        trainingProviderName: provider?.name || "",
                        trainingEntityCode: provider?.typeCode || current.trainingEntityCode,
                      }
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sem entidade associada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem entidade associada</SelectItem>
                    {state.trainingProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {state.trainingProviders.length === 0
                    ? "Ainda não existem entidades formadoras registadas. Pode criá-las na página principal do módulo."
                    : "Ao escolher uma entidade, o tipo de entidade formadora é ajustado automaticamente."}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-secondary/30 p-4">
                <div>
                  <p className="font-medium">Formacao obrigatoria</p>
                  <p className="text-sm text-muted-foreground">Ideal para simular o reporte anual e obrigacoes legais.</p>
                </div>
                <Switch
                  checked={form.mandatory}
                  onCheckedChange={(checked) => updateFormField("mandatory", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Códigos RU da ação</CardTitle>
              <CardDescription>Todos os códigos são guardados como string, preservando zeros à esquerda.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <RuSelect
                label="T30 Área de educação/formação"
                table="T30"
                value={form.educationAreaCode}
                onValueChange={(value) => updateFormField("educationAreaCode", value)}
              />
              <RuSelect
                label="T31 Modalidade"
                table="T31"
                value={form.trainingModalityCode}
                onValueChange={(value) => updateFormField("trainingModalityCode", value)}
              />
              <RuSelect
                label="T32 Iniciativa"
                table="T32"
                value={form.trainingInitiativeCode}
                onValueChange={(value) => updateFormField("trainingInitiativeCode", value)}
              />
              <RuSelect
                label="T33 Horario"
                table="T33"
                value={form.trainingScheduleCode}
                onValueChange={(value) => updateFormField("trainingScheduleCode", value)}
              />
              <RuSelect
                label="T34 Entidade formadora"
                table="T34"
                value={form.trainingEntityCode}
                onValueChange={(value) => updateFormField("trainingEntityCode", value)}
              />
              <RuSelect
                label="T36 Nivel de qualificacao"
                table="T36"
                value={form.trainingQualificationLevelCode}
                onValueChange={(value) => updateFormField("trainingQualificationLevelCode", value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competencias e foco</CardTitle>
              <CardDescription>Tags livres para pesquisa interna no catalogo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-2">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {form.skills.length === 0 && <p className="text-sm text-muted-foreground">Ainda sem tags associadas.</p>}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  placeholder="Adicionar skill ou keyword"
                />
                <Button type="button" variant="outline" onClick={() => addSkill(skillInput)}>
                  Adicionar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillSuggestions.map((skill) => (
                  <Button key={skill} type="button" variant="outline" size="sm" onClick={() => addSkill(skill)}>
                    {skill}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Participantes</CardTitle>
                  <CardDescription>Selecione trabalhadores e complete T28, T29, T35 e horas frequentadas.</CardDescription>
                </div>
                <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Novo user
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar colaborador de teste</DialogTitle>
                      <DialogDescription>A ficha RH obrigatória para RU é criada automaticamente com códigos demo válidos.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input value={employeeForm.name} onChange={(event) => updateEmployeeFormField("name", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={employeeForm.email} onChange={(event) => updateEmployeeFormField("email", event.target.value)} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Departamento</Label>
                          <Input value={employeeForm.department} onChange={(event) => updateEmployeeFormField("department", event.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Numero colaborador</Label>
                          <Input value={employeeForm.employeeNumber} onChange={(event) => updateEmployeeFormField("employeeNumber", event.target.value)} />
                        </div>
                      </div>
                    </div>
                    <Button type="button" onClick={handleCreateEmployee}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar e associar
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="directory" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="directory">Diretorio</TabsTrigger>
                  <TabsTrigger value="selected">Participantes RU ({participantDrafts.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="directory" className="space-y-4 pt-4">
                  <div className="rounded-xl border bg-secondary/20 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">Adicionar participantes em bulk</p>
                        <p className="text-sm text-muted-foreground">
                          Use os departamentos-alvo para associar rapidamente todos os colaboradores relevantes.
                        </p>
                      </div>
                      <Button type="button" variant="outline" onClick={() => addEmployeesByDepartments(form.targetDepartments)}>
                        Adicionar departamentos-alvo
                      </Button>
                    </div>
                    {form.targetDepartments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.targetDepartments.map((department) => (
                          <Badge key={department} variant="secondary">
                            {department}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Pesquisar nome, email ou departamento"
                  />
                  <ScrollArea className="h-[340px] rounded-xl border">
                    <div className="space-y-2 p-3">
                      {filteredEmployees.map((employee) => {
                        const employeeRuReady = isEmployeeRuReady(employee)
                        const isSelected = selectedEmployeeIds.includes(employee.id)
                        return (
                          <div
                            key={employee.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleEmployee(employee.id)}
                            onKeyDown={(event) => {
                              if (event.target !== event.currentTarget) return
                              if (event.key !== "Enter" && event.key !== " ") return
                              event.preventDefault()
                              toggleEmployee(employee.id)
                            }}
                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/40 hover:bg-secondary/40"
                            }`}
                            aria-pressed={isSelected}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleEmployee(employee.id)}
                              onClick={(event) => event.stopPropagation()}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{employee.name}</p>
                                <Badge variant={employeeRuReady ? "secondary" : "destructive"}>
                                  {employeeRuReady ? "Ficha RH valida" : "Ficha RH incompleta"}
                                </Badge>
                              </div>
                              <p className="truncate text-sm text-muted-foreground">{employee.email}</p>
                              <p className="text-xs text-muted-foreground">{employee.department}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="selected" className="space-y-4 pt-4">
                  <div className="space-y-3">
                    {participantDrafts.length === 0 && (
                      <div className="rounded-xl border bg-secondary/20 p-4 text-sm text-muted-foreground">
                        Ainda nao selecionou participantes para esta ação de formação.
                      </div>
                    )}
                    {participantDrafts.map((participant) => {
                      const employee = state.employees.find((item) => item.id === participant.employeeId)
                      const missingEmployeeFields = employee ? getEmployeeRuMissingFields(employee) : ["Ficha RH em falta"]
                      return (
                        <div key={participant.employeeId} className="rounded-xl border p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium">{participant.name}</p>
                                  <Badge variant={employee && isEmployeeRuReady(employee) ? "secondary" : "destructive"}>
                                    {employee && isEmployeeRuReady(employee) ? "Ficha RH valida" : "Validar ficha RH"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{participant.email} · {participant.department}</p>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => toggleEmployee(participant.employeeId)}>
                                Remover
                              </Button>
                            </div>

                            {employee && !isEmployeeRuReady(employee) && (
                              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                Faltam campos RH: {missingEmployeeFields.join(", ")}
                              </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Horas frequentadas</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={participant.attendedHours}
                                  onChange={(event) => updateParticipantDraft(participant.employeeId, { attendedHours: Number(event.target.value) })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Estado interno</Label>
                                <Select
                                  value={participant.status}
                                  onValueChange={(value: TrainingParticipantStatus) => updateParticipantDraft(participant.employeeId, { status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="confirmed">Confirmado</SelectItem>
                                    <SelectItem value="completed">Concluido</SelectItem>
                                    <SelectItem value="absent">Ausente</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <RuSelect
                                label="T28 Situação face à frequência"
                                table="T28"
                                value={participant.trainingFrequencySituationCode}
                                onValueChange={(value) => updateParticipantDraft(participant.employeeId, { trainingFrequencySituationCode: value })}
                              />
                              <RuSelect
                                label="T29 Período de referência"
                                table="T29"
                                value={participant.trainingReferencePeriodCode}
                                onValueChange={(value) => updateParticipantDraft(participant.employeeId, { trainingReferencePeriodCode: value })}
                              />
                              <div className="sm:col-span-2">
                                <RuSelect
                                  label="T35 Tipo de certificado / diploma"
                                  table="T35"
                                  value={participant.certificateTypeCode}
                                  onValueChange={(value) => updateParticipantDraft(participant.employeeId, { certificateTypeCode: value })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist RU</CardTitle>
              <CardDescription>Critérios para a ação ficar elegível para exportação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border p-3">
                <p className="font-medium">1. Acao completa</p>
                <p className="text-muted-foreground">Título, datas, horas e códigos T30, T31, T32, T33, T34 e T36.</p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="font-medium">2. Participantes completos</p>
                <p className="text-muted-foreground">Cada trabalhador precisa de horas frequentadas e códigos T28, T29 e T35.</p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="font-medium">3. Ficha RH validada</p>
                <p className="text-muted-foreground">NISS, NIF e restantes códigos da ficha do trabalhador são obrigatórios antes da exportação.</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-900">
                <p className="font-medium">Exemplo guardado</p>
                <p className="mt-1 text-sm">T33 = {form.trainingScheduleCode} · {getRuLabel("T33", form.trainingScheduleCode)}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <p>Os códigos RU são guardados como string. Exemplo correto: <span className="font-mono">"01"</span>.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" size="lg">
              {mode === "edit" ? "Guardar alteracoes" : "Criar formacao"}
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href={mode === "edit" && trainingId ? `/dashboard/trainings/${trainingId}` : "/dashboard/trainings"}>
                Cancelar
              </Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function RuSelect({
  label,
  table,
  value,
  onValueChange,
}: {
  label: string
  table: keyof typeof ruCodeTables
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
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
    </div>
  )
}
