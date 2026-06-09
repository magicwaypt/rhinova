"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Hash,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { TrainingActionRecord, TrainingFormat, TrainingParticipantPayload, TrainingParticipantStatus, TrainingStatus, TrainingTask, TrainingType } from "@/lib/training-platform"
import {
  getEmployeeRuMissingFields,
  isEmployeeRuReady,
  ruCodeTables,
  taskPriorityLabels,
  taskStatusLabels,
  trainingFormatLabels,
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

const wizardSteps = [
  {
    id: "detalhes",
    title: "Detalhes",
    description: "Identificação e agenda",
    icon: BookOpen,
  },
  {
    id: "codigos",
    title: "Códigos RU",
    description: "Classificação oficial",
    icon: Hash,
  },
  {
    id: "participantes",
    title: "Participantes",
    description: "Quem vai frequentar",
    icon: Users,
  },
  {
    id: "revisao",
    title: "Revisão",
    description: "Confirmar e criar",
    icon: CheckCircle2,
  },
] as const

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatDisplayDate(value: string) {
  if (!value) return "—"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })
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
  const { state, isReady, departmentOptions, createTraining, updateTraining, createEmployee, addTask, updateTaskStatus, deleteTask } = useTrainingWorkspace()
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
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [step, setStep] = useState(0)
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
  const [taskForm, setTaskForm] = useState({
    title: "",
    owner: "Equipa RH",
    dueDate: "",
    status: "pending",
    priority: "medium",
    notes: "",
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

  const trainingTasks = useMemo(
    () =>
      trainingId
        ? state.tasks
            .filter((task) => task.trainingId === trainingId)
            .sort((left, right) => left.dueDate.getTime() - right.dueDate.getTime())
        : [],
    [state.tasks, trainingId],
  )

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

  const handleAddTask = () => {
    if (mode !== "edit" || !trainingId || !taskForm.title || !taskForm.dueDate) {
      toast.error("Preencha titulo e prazo da tarefa.")
      return
    }

    addTask({
      trainingId,
      title: taskForm.title,
      owner: taskForm.owner,
      dueDate: new Date(`${taskForm.dueDate}T09:00:00`),
      status: taskForm.status as "pending" | "in_progress" | "completed",
      priority: taskForm.priority as "high" | "medium" | "low",
      notes: taskForm.notes,
      source: "manual",
    })

    setTaskForm({
      title: "",
      owner: "Equipa RH",
      dueDate: form.startDate || "",
      status: "pending",
      priority: "medium",
      notes: "",
    })
    setTaskDialogOpen(false)
    toast.success("Tarefa associada a esta formacao.")
  }

  const incompleteParticipants = useMemo(
    () =>
      participantDrafts.filter((participant) =>
        !(participant.attendedHours > 0) ||
        !participant.trainingFrequencySituationCode ||
        !participant.trainingReferencePeriodCode ||
        !participant.certificateTypeCode,
      ),
    [participantDrafts],
  )

  const stepValidation = useMemo(() => {
    const detailsComplete = Boolean(form.title && form.instructor && form.startDate && form.endDate)
    const participantsComplete = incompleteParticipants.length === 0
    return {
      0: detailsComplete,
      1: true,
      2: participantsComplete,
      3: detailsComplete && participantsComplete,
    } as Record<number, boolean>
  }, [form.title, form.instructor, form.startDate, form.endDate, incompleteParticipants.length])

  const goToStep = (target: number) => {
    setStep(Math.max(0, Math.min(wizardSteps.length - 1, target)))
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNext = () => {
    if (step === 0 && !stepValidation[0]) {
      toast.error("Preencha título, formador e datas para avançar.")
      return
    }
    if (step === 2 && !stepValidation[2]) {
      toast.error("Complete horas e códigos T28, T29 e T35 dos participantes.")
      return
    }
    goToStep(step + 1)
  }

  const submitTraining = () => {
    if (!form.title || !form.instructor || !form.startDate || !form.endDate) {
      toast.error("Preencha os campos base da formacao.")
      goToStep(0)
      return
    }

    if (incompleteParticipants.length > 0) {
      toast.error("Todos os participantes precisam de horas frequentadas e codigos T28, T29 e T35.")
      goToStep(2)
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
        <div className="h-28 w-full rounded-3xl bg-muted animate-pulse" />
        <div className="h-[520px] w-full rounded-3xl bg-muted animate-pulse" />
      </div>
    )
  }

  if (mode === "edit" && !training) {
    return (
      <Card className="border-none shadow-soft">
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

  const backHref = mode === "edit" && trainingId ? `/dashboard/trainings/${trainingId}` : "/dashboard/trainings"
  const isLastStep = step === wizardSteps.length - 1

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-mesh-brand p-6 text-white shadow-soft-lg sm:p-8">
        <div className="absolute inset-0 bg-grid-faint opacity-[0.15]" aria-hidden />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 shrink-0 rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Link href={backHref} aria-label="Voltar">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Badge className="rounded-full border-white/25 bg-white/15 text-white hover:bg-white/15">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Módulo de Formação
            </Badge>
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">
              {mode === "edit" ? "Editar formação" : "Criar nova formação"}
            </h1>
            <p className="text-balance text-sm text-white/80 sm:text-base">
              Um percurso guiado em quatro passos: comece pelos detalhes, classifique com os códigos RU, associe
              participantes e reveja antes de submeter.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <Stepper
        currentStep={step}
        validation={stepValidation}
        onStepClick={(target) => {
          if (target <= step || stepValidation[Math.max(0, target - 1)]) {
            goToStep(target)
          }
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          {step === 0 && (
            <DetailsStep
              form={form}
              setForm={setForm}
              updateFormField={updateFormField}
              availableDepartments={availableDepartments}
              toggleTargetDepartment={toggleTargetDepartment}
              departmentInput={departmentInput}
              setDepartmentInput={setDepartmentInput}
              addCustomDepartment={addCustomDepartment}
              skillInput={skillInput}
              setSkillInput={setSkillInput}
              addSkill={addSkill}
              removeSkill={removeSkill}
              providers={state.trainingProviders}
            />
          )}

          {step === 1 && <CodesStep form={form} updateFormField={updateFormField} />}

          {step === 2 && (
            <ParticipantsStep
              form={form}
              employees={state.employees}
              filteredEmployees={filteredEmployees}
              selectedEmployeeIds={selectedEmployeeIds}
              participantDrafts={participantDrafts}
              incompleteCount={incompleteParticipants.length}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              toggleEmployee={toggleEmployee}
              updateParticipantDraft={updateParticipantDraft}
              addEmployeesByDepartments={addEmployeesByDepartments}
              employeeDialogOpen={employeeDialogOpen}
              setEmployeeDialogOpen={setEmployeeDialogOpen}
              employeeForm={employeeForm}
              updateEmployeeFormField={updateEmployeeFormField}
              handleCreateEmployee={handleCreateEmployee}
            />
          )}

          {step === 3 && (
            <ReviewStep
              form={form}
              participantDrafts={participantDrafts}
              incompleteCount={incompleteParticipants.length}
              onEditStep={goToStep}
            />
          )}

          {mode === "edit" && trainingId && (
            <TrainingTasksEditorSection
              trainingTasks={trainingTasks}
              suggestedDate={form.startDate}
              taskDialogOpen={taskDialogOpen}
              setTaskDialogOpen={setTaskDialogOpen}
              taskForm={taskForm}
              setTaskForm={setTaskForm}
              handleAddTask={handleAddTask}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
            />
          )}

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => (step === 0 ? router.push(backHref) : goToStep(step - 1))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step === 0 ? "Cancelar" : "Anterior"}
            </Button>

            {isLastStep ? (
              <Button type="button" size="lg" className="rounded-full shadow-soft" onClick={submitTraining}>
                <Check className="mr-2 h-4 w-4" />
                {mode === "edit" ? "Guardar alterações" : "Criar formação"}
              </Button>
            ) : (
              <Button type="button" size="lg" className="rounded-full shadow-soft" onClick={handleNext}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Live summary sidebar */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SummarySidebar
            form={form}
            participantCount={participantDrafts.length}
            incompleteCount={incompleteParticipants.length}
            currentStep={step}
          />
        </div>
      </div>
    </div>
  )
}

function Stepper({
  currentStep,
  validation,
  onStepClick,
}: {
  currentStep: number
  validation: Record<number, boolean>
  onStepClick: (step: number) => void
}) {
  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-3 sm:p-4">
        <ol className="flex items-center gap-2 overflow-x-auto">
          {wizardSteps.map((stepItem, index) => {
            const StepIcon = stepItem.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep && validation[index]
            const isClickable = index <= currentStep || validation[Math.max(0, index - 1)]

            return (
              <li key={stepItem.id} className="flex min-w-0 flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                    isActive
                      ? "border-primary/30 bg-primary/5 ring-glow"
                      : isComplete
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-card hover:border-primary/30",
                    !isClickable && "cursor-not-allowed opacity-50",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                          ? "bg-success text-success-foreground"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Passo {index + 1}
                    </span>
                    <span className="block truncate text-sm font-semibold text-foreground">{stepItem.title}</span>
                  </span>
                </button>
                {index < wizardSteps.length - 1 && (
                  <span
                    className={cn(
                      "hidden h-px w-4 shrink-0 sm:block",
                      index < currentStep ? "bg-primary" : "bg-border",
                    )}
                    aria-hidden
                  />
                )}
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}

function StepShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof BookOpen
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="animate-slide-up border-none shadow-soft">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</p>
  )
}

function DetailsStep({
  form,
  setForm,
  updateFormField,
  availableDepartments,
  toggleTargetDepartment,
  departmentInput,
  setDepartmentInput,
  addCustomDepartment,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  providers,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  updateFormField: <K extends keyof FormState>(field: K, value: FormState[K]) => void
  availableDepartments: string[]
  toggleTargetDepartment: (department: string) => void
  departmentInput: string
  setDepartmentInput: (value: string) => void
  addCustomDepartment: () => void
  skillInput: string
  setSkillInput: (value: string) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  providers: { id: string; name: string; typeCode: string }[]
}) {
  return (
    <StepShell icon={BookOpen} title="Detalhes da formação" description="A informação essencial que identifica a ação.">
      <div className="space-y-4">
        <SectionLabel>Identificação</SectionLabel>
        <div className="space-y-2">
          <Label htmlFor="title">Título da formação</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Ex: RGPD para equipas comerciais"
            className="h-11 text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Contexto, objetivos e evidências esperadas."
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["internal", "external"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateFormField("type", value)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                    form.type === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30",
                  )}
                >
                  {value === "internal" ? "Interna" : "Externa"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={form.format} onValueChange={(value: TrainingFormat) => updateFormField("format", value)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <SectionLabel>Agenda e logística</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de início</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="startDate"
                type="date"
                className="h-11 pl-10"
                value={form.startDate}
                onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data de fim</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="endDate"
                type="date"
                className="h-11 pl-10"
                value={form.endDate}
                onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="durationHours">Duração (horas)</Label>
            <Input
              id="durationHours"
              type="number"
              min="1"
              className="h-11"
              value={form.durationHours}
              onChange={(event) => setForm((current) => ({ ...current, durationHours: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Lotação</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              className="h-11"
              value={form.maxParticipants}
              onChange={(event) => setForm((current) => ({ ...current, maxParticipants: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Sala / link</Label>
            <Input
              id="location"
              className="h-11"
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              placeholder="Sala Atlas ou Teams"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="instructor">Formador</Label>
            <Input
              id="instructor"
              className="h-11"
              value={form.instructor}
              onChange={(event) => setForm((current) => ({ ...current, instructor: event.target.value }))}
              placeholder="Nome da pessoa ou entidade"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={(value: TrainingStatus) => updateFormField("status", value)}>
              <SelectTrigger className="h-11">
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
        </div>

        <div className="space-y-2">
          <Label>Entidade formadora registada</Label>
          <Select
            value={form.trainingProviderId || "none"}
            onValueChange={(value) => {
              setForm((current) => {
                if (value === "none") {
                  return { ...current, trainingProviderId: "", trainingProviderName: "" }
                }
                const provider = providers.find((item) => item.id === value)
                return {
                  ...current,
                  trainingProviderId: value,
                  trainingProviderName: provider?.name || "",
                  trainingEntityCode: provider?.typeCode || current.trainingEntityCode,
                }
              })
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sem entidade associada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem entidade associada</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {providers.length === 0
              ? "Ainda não existem entidades formadoras registadas. Pode criá-las na página principal do módulo."
              : "Ao escolher uma entidade, o tipo de entidade formadora é ajustado automaticamente."}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border bg-secondary/30 p-4">
          <div>
            <p className="font-medium">Formação obrigatória</p>
            <p className="text-sm text-muted-foreground">Ideal para simular o reporte anual e obrigações legais.</p>
          </div>
          <Switch checked={form.mandatory} onCheckedChange={(checked) => updateFormField("mandatory", checked)} />
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <SectionLabel>Departamentos-alvo</SectionLabel>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={form.targetDepartments.length === 0 ? "default" : "outline"}
            className="rounded-full"
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
              className="rounded-full"
              onClick={() => toggleTargetDepartment(department)}
            >
              {department}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={departmentInput}
            onChange={(event) => setDepartmentInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                addCustomDepartment()
              }
            }}
            placeholder="Adicionar departamento manualmente"
            className="h-11"
          />
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={addCustomDepartment}>
            Adicionar
          </Button>
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <SectionLabel>Competências e foco</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {form.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1.5 rounded-full py-1 pl-3 pr-1.5">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remover ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {form.skills.length === 0 && <p className="text-sm text-muted-foreground">Ainda sem tags associadas.</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={skillInput}
            onChange={(event) => setSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                addSkill(skillInput)
              }
            }}
            placeholder="Adicionar skill ou keyword"
            className="h-11"
          />
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => addSkill(skillInput)}>
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillSuggestions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>
    </StepShell>
  )
}

function CodesStep({
  form,
  updateFormField,
}: {
  form: FormState
  updateFormField: <K extends keyof FormState>(field: K, value: FormState[K]) => void
}) {
  return (
    <StepShell
      icon={Hash}
      title="Códigos RU da ação"
      description="Classificação oficial para o Relatório Único. Todos os códigos são guardados como string."
    >
      <div className="grid gap-4 sm:grid-cols-2">
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
          label="T33 Horário"
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
          label="T36 Nível de qualificação"
          table="T36"
          value={form.trainingQualificationLevelCode}
          onValueChange={(value) => updateFormField("trainingQualificationLevelCode", value)}
        />
      </div>

    </StepShell>
  )
}

interface ParticipantsStepProps {
  form: FormState
  employees: { id: string; name: string; email: string; department: string }[]
  filteredEmployees: { id: string; name: string; email: string; department: string }[]
  selectedEmployeeIds: string[]
  participantDrafts: ParticipantDraft[]
  incompleteCount: number
  userSearch: string
  setUserSearch: (value: string) => void
  toggleEmployee: (employeeId: string) => void
  updateParticipantDraft: (employeeId: string, patch: Partial<ParticipantDraft>) => void
  addEmployeesByDepartments: (departments: string[]) => void
  employeeDialogOpen: boolean
  setEmployeeDialogOpen: (open: boolean) => void
  employeeForm: { name: string; email: string; department: string; employeeNumber: string; jobTitle: string; location: string }
  updateEmployeeFormField: (field: "name" | "email" | "department" | "employeeNumber" | "jobTitle" | "location", value: string) => void
  handleCreateEmployee: () => void
}

function ParticipantsStep(props: ParticipantsStepProps) {
  const {
    form,
    employees,
    filteredEmployees,
    selectedEmployeeIds,
    participantDrafts,
    incompleteCount,
    userSearch,
    setUserSearch,
    toggleEmployee,
    updateParticipantDraft,
    addEmployeesByDepartments,
    employeeDialogOpen,
    setEmployeeDialogOpen,
    employeeForm,
    updateEmployeeFormField,
    handleCreateEmployee,
  } = props

  const departmentSummaries = useMemo(() => {
    const selectedIds = new Set(selectedEmployeeIds)
    const targetDepartments = new Set(form.targetDepartments)
    const summaries = new Map<string, { name: string; total: number; selected: number; isTarget: boolean }>()

    for (const employee of employees) {
      const departmentName = employee.department || "Sem departamento"
      const current = summaries.get(departmentName) ?? {
        name: departmentName,
        total: 0,
        selected: 0,
        isTarget: targetDepartments.has(departmentName),
      }

      current.total += 1
      if (selectedIds.has(employee.id)) current.selected += 1
      summaries.set(departmentName, current)
    }

    return Array.from(summaries.values()).sort((left, right) => {
      if (left.isTarget !== right.isTarget) return left.isTarget ? -1 : 1
      return left.name.localeCompare(right.name, "pt")
    })
  }, [employees, form.targetDepartments, selectedEmployeeIds])

  return (
    <StepShell
      icon={Users}
      title="Participantes"
      description="Selecione colaboradores e complete os códigos T28, T29, T35 e horas frequentadas."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Directory */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>Diretório ({filteredEmployees.length})</SectionLabel>
            <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-primary">
                  <UserPlus className="h-3.5 w-3.5" />
                  Novo
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
                      <Label>Número colaborador</Label>
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
          <Input
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            placeholder="Pesquisar nome, email ou departamento"
            className="h-11"
          />
          <div className="rounded-2xl border bg-secondary/20 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-medium">Seleção em bulk por departamento</p>
                <p className="text-sm text-muted-foreground">Associe equipas inteiras com um clique.</p>
              </div>
              {form.targetDepartments.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => addEmployeesByDepartments(form.targetDepartments)}
                >
                  Associar departamentos-alvo
                </Button>
              )}
            </div>
            {departmentSummaries.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {departmentSummaries.map((department) => {
                  const fullySelected = department.selected === department.total
                  return (
                    <Button
                      key={department.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={fullySelected}
                      className={cn(
                        "h-auto rounded-full px-3 py-2 text-left",
                        fullySelected && "border-primary/30 bg-primary/5 text-primary opacity-100",
                      )}
                      onClick={() => addEmployeesByDepartments([department.name])}
                    >
                      <span className="flex items-center gap-2">
                        <span>{department.name}</span>
                        <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                          {department.selected}/{department.total}
                        </span>
                        {department.isTarget && (
                          <span className="text-[10px] uppercase tracking-[0.16em] text-primary">Alvo</span>
                        )}
                      </span>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
          <ScrollArea className="h-[360px] rounded-2xl border">
            <div className="space-y-2 p-3">
              {filteredEmployees.length === 0 && (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">Sem colaboradores para mostrar.</p>
              )}
              {filteredEmployees.map((employee) => {
                const employeeRuReady = isEmployeeRuReady(employee as never)
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
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "hover:border-primary/40 hover:bg-secondary/40",
                    )}
                    aria-pressed={isSelected}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleEmployee(employee.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{employee.name}</p>
                        <Badge variant={employeeRuReady ? "secondary" : "destructive"} className="rounded-full text-[10px]">
                          {employeeRuReady ? "Ficha RH válida" : "Ficha RH incompleta"}
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
        </div>

        {/* Selected participants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>Associados ({participantDrafts.length})</SectionLabel>
            {incompleteCount > 0 && (
              <Badge variant="destructive" className="rounded-full text-[10px]">
                {incompleteCount} por completar
              </Badge>
            )}
          </div>
          <ScrollArea className="h-[420px] rounded-2xl border">
            <div className="divide-y">
              {participantDrafts.length === 0 && (
                <div className="flex h-[360px] flex-col items-center justify-center gap-2 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <Users className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-medium">Sem participantes</p>
                  <p className="max-w-[220px] text-xs text-muted-foreground">
                    Selecione colaboradores no diretório à esquerda para os configurar aqui.
                  </p>
                </div>
              )}
              {participantDrafts.map((participant) => {
                const employee = employees.find((item) => item.id === participant.employeeId)
                const ruReady = employee ? isEmployeeRuReady(employee as never) : false
                const missingEmployeeFields = employee ? getEmployeeRuMissingFields(employee as never) : ["Ficha RH em falta"]
                return (
                  <div key={participant.employeeId} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">{participant.name}</p>
                          <span className="text-xs text-muted-foreground">{participant.department}</span>
                          <Badge variant={ruReady ? "secondary" : "destructive"} className="rounded-full text-[10px]">
                            {ruReady ? "Ficha OK" : "Validar ficha"}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{participant.email}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => toggleEmployee(participant.employeeId)}
                        aria-label="Remover participante"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {employee && !ruReady && (
                      <div className="mt-3 rounded-lg border border-amber-300/60 bg-amber-50 p-2 text-xs text-amber-800">
                        Faltam campos RH: {missingEmployeeFields.join(", ")}
                      </div>
                    )}

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="min-w-0 space-y-1.5">
                        <Label className="text-xs">Horas frequentadas</Label>
                        <Input
                          type="number"
                          min="0"
                          value={participant.attendedHours}
                          onChange={(event) => updateParticipantDraft(participant.employeeId, { attendedHours: Number(event.target.value) })}
                        />
                      </div>
                      <div className="min-w-0 space-y-1.5">
                        <Label className="text-xs">Estado</Label>
                        <Select
                          value={participant.status}
                          onValueChange={(value: TrainingParticipantStatus) => updateParticipantDraft(participant.employeeId, { status: value })}
                        >
                          <SelectTrigger className="w-full min-w-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                            <SelectItem value="absent">Ausente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-0">
                        <RuSelect
                          compact
                          label="T28 Frequência"
                          table="T28"
                          value={participant.trainingFrequencySituationCode}
                          onValueChange={(value) => updateParticipantDraft(participant.employeeId, { trainingFrequencySituationCode: value })}
                        />
                      </div>
                      <div className="min-w-0">
                        <RuSelect
                          compact
                          label="T29 Período"
                          table="T29"
                          value={participant.trainingReferencePeriodCode}
                          onValueChange={(value) => updateParticipantDraft(participant.employeeId, { trainingReferencePeriodCode: value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <RuSelect
                          compact
                          label="T35 Tipo de certificado / diploma"
                          table="T35"
                          value={participant.certificateTypeCode}
                          onValueChange={(value) => updateParticipantDraft(participant.employeeId, { certificateTypeCode: value })}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </StepShell>
  )
}

function TrainingTasksEditorSection({
  trainingTasks,
  suggestedDate,
  taskDialogOpen,
  setTaskDialogOpen,
  taskForm,
  setTaskForm,
  handleAddTask,
  updateTaskStatus,
  deleteTask,
}: {
  trainingTasks: TrainingTask[]
  suggestedDate: string
  taskDialogOpen: boolean
  setTaskDialogOpen: (open: boolean) => void
  taskForm: {
    title: string
    owner: string
    dueDate: string
    status: string
    priority: string
    notes: string
  }
  setTaskForm: (
    value:
      | {
          title: string
          owner: string
          dueDate: string
          status: string
          priority: string
          notes: string
        }
      | ((current: {
          title: string
          owner: string
          dueDate: string
          status: string
          priority: string
          notes: string
        }) => {
          title: string
          owner: string
          dueDate: string
          status: string
          priority: string
          notes: string
        }),
  ) => void
  handleAddTask: () => void
  updateTaskStatus: (taskId: string, status: "pending" | "in_progress" | "completed") => void
  deleteTask: (taskId: string) => void
}) {
  const automaticTasks = trainingTasks.filter((task) => task.source === "automatic" || task.templateKey)
  const manualTasks = trainingTasks.filter((task) => task.source === "manual" || (!task.source && !task.templateKey))

  return (
    <Card className="border-none shadow-soft">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Gestao de tarefas da formacao</CardTitle>
            <CardDescription>
              As tarefas automaticas ajustam-se com as datas da formacao. O gestor RH pode adicionar tarefas manuais, atribuir owners e marcar conclusao aqui.
            </CardDescription>
          </div>
          <Dialog
            open={taskDialogOpen}
            onOpenChange={(open) => {
              setTaskDialogOpen(open)
              if (open) {
                setTaskForm((current) => ({
                  ...current,
                  dueDate: current.dueDate || suggestedDate,
                }))
              }
            }}
          >
            <DialogTrigger asChild>
              <Button type="button" className="rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Nova tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar tarefa</DialogTitle>
                <DialogDescription>Crie uma tarefa operacional associada diretamente a esta formacao.</DialogDescription>
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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                <Button type="button" onClick={handleAddTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Guardar tarefa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{automaticTasks.length} automatica(s)</Badge>
          <Badge variant="outline">{manualTasks.length} manual(is)</Badge>
          <Badge variant="secondary">{trainingTasks.filter((task) => task.status !== "completed").length} por concluir</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trainingTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            Ainda nao existem tarefas associadas a esta formacao.
          </div>
        )}
        {trainingTasks.map((task) => (
          <div key={task.id} className="rounded-2xl border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className={task.status === "completed" ? "bg-emerald-100 text-emerald-700" : task.status === "in_progress" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}>
                    {taskStatusLabels[task.status]}
                  </Badge>
                  <Badge variant="outline">{taskPriorityLabels[task.priority]}</Badge>
                  <Badge variant={task.source === "manual" ? "secondary" : "outline"}>
                    {task.source === "manual" ? "Manual" : "Automatica"}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{task.notes || "Sem notas adicionais."}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Owner: {task.owner}</span>
                  <span>Prazo: {new Date(task.dueDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.status !== "pending" && (
                  <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "pending")}>
                    Reabrir
                  </Button>
                )}
                {task.status !== "in_progress" && (
                  <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "in_progress")}>
                    Em curso
                  </Button>
                )}
                {task.status !== "completed" && (
                  <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "completed")}>
                    Concluir
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ReviewStep({
  form,
  participantDrafts,
  incompleteCount,
  onEditStep,
}: {
  form: FormState
  participantDrafts: ParticipantDraft[]
  incompleteCount: number
  onEditStep: (step: number) => void
}) {
  const ready = Boolean(form.title && form.instructor && form.startDate && form.endDate) && incompleteCount === 0

  return (
    <StepShell icon={CheckCircle2} title="Revisão final" description="Confirme os dados antes de submeter a formação.">
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border p-4",
          ready ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5",
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            ready ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground",
          )}
        >
          {ready ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
        </span>
        <div>
          <p className="font-semibold">{ready ? "Tudo pronto para submeter" : "Faltam campos obrigatórios"}</p>
          <p className="text-sm text-muted-foreground">
            {ready
              ? "Os dados principais e os participantes estão completos."
              : "Reveja os passos assinalados antes de criar a formação."}
          </p>
        </div>
      </div>

      <ReviewSection title="Detalhes" onEdit={() => onEditStep(0)}>
        <ReviewRow icon={BookOpen} label="Título" value={form.title || "—"} />
        <ReviewRow icon={Users} label="Formador" value={form.instructor || "—"} />
        <ReviewRow
          icon={CalendarDays}
          label="Datas"
          value={`${formatDisplayDate(form.startDate)} → ${formatDisplayDate(form.endDate)}`}
        />
        <ReviewRow icon={Clock} label="Duração" value={`${form.durationHours}h · lotação ${form.maxParticipants}`} />
        <ReviewRow
          icon={ClipboardList}
          label="Formato"
          value={`${trainingFormatLabels[form.format]} · ${form.type === "internal" ? "Interna" : "Externa"}${form.mandatory ? " · Obrigatória" : ""}`}
        />
        {form.location && <ReviewRow icon={MapPin} label="Local" value={form.location} />}
      </ReviewSection>

      <ReviewSection title="Códigos RU" onEdit={() => onEditStep(1)}>
        <div className="flex flex-wrap gap-2">
          <CodeChip code="T30" value={form.educationAreaCode} />
          <CodeChip code="T31" value={form.trainingModalityCode} />
          <CodeChip code="T32" value={form.trainingInitiativeCode} />
          <CodeChip code="T33" value={form.trainingScheduleCode} />
          <CodeChip code="T34" value={form.trainingEntityCode} />
          <CodeChip code="T36" value={form.trainingQualificationLevelCode} />
        </div>
      </ReviewSection>

      <ReviewSection title={`Participantes (${participantDrafts.length})`} onEdit={() => onEditStep(2)}>
        {participantDrafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum participante associado.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {participantDrafts.slice(0, 10).map((participant) => (
              <Badge key={participant.employeeId} variant="secondary" className="rounded-full">
                {participant.name}
              </Badge>
            ))}
            {participantDrafts.length > 10 && (
              <Badge variant="outline" className="rounded-full">
                +{participantDrafts.length - 10}
              </Badge>
            )}
          </div>
        )}
        {incompleteCount > 0 && (
          <p className="mt-2 text-sm text-destructive">{incompleteCount} participante(s) com dados em falta.</p>
        )}
      </ReviewSection>
    </StepShell>
  )
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h3>
        <Button type="button" variant="ghost" size="sm" className="h-7 text-primary" onClick={onEdit}>
          Editar
        </Button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ReviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate font-medium">{value}</span>
    </div>
  )
}

function CodeChip({ code, value }: { code: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border bg-secondary/50 py-1 pl-2 pr-3 text-xs">
      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-mono font-semibold text-primary">{code}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}

function SummarySidebar({
  form,
  participantCount,
  incompleteCount,
  currentStep,
}: {
  form: FormState
  participantCount: number
  incompleteCount: number
  currentStep: number
}) {
  return (
    <Card className="overflow-hidden border-none shadow-soft">
      <div className="bg-mesh-brand p-5 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">Pré-visualização</p>
        <h2 className="mt-1 text-balance text-lg font-bold leading-snug">
          {form.title || "Nova formação"}
        </h2>
        <p className="mt-1 text-sm text-white/80">{form.instructor || "Formador por definir"}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className="rounded-full border-white/25 bg-white/15 text-white hover:bg-white/15">
            {trainingFormatLabels[form.format]}
          </Badge>
          <Badge className="rounded-full border-white/25 bg-white/15 text-white hover:bg-white/15">
            {form.type === "internal" ? "Interna" : "Externa"}
          </Badge>
          {form.mandatory && (
            <Badge className="rounded-full border-white/25 bg-accent/90 text-accent-foreground hover:bg-accent/90">
              Obrigatória
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <SummaryStat icon={Clock} value={`${form.durationHours}h`} label="Duração" />
          <SummaryStat icon={Users} value={String(participantCount)} label="Pessoas" />
          <SummaryStat icon={CalendarDays} value={formatDisplayDate(form.startDate).split(" ").slice(0, 2).join(" ")} label="Início" />
        </div>

        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t pt-4">
            {form.skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="secondary" className="rounded-full text-[10px]">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2 border-t pt-4">
          <ChecklistRow done={Boolean(form.title && form.instructor && form.startDate && form.endDate)} active={currentStep === 0}>
            Detalhes principais
          </ChecklistRow>
          <ChecklistRow done active={currentStep === 1}>
            Códigos RU classificados
          </ChecklistRow>
          <ChecklistRow done={participantCount > 0 && incompleteCount === 0} active={currentStep === 2}>
            {participantCount > 0 ? `${participantCount} participante(s)` : "Participantes"}
          </ChecklistRow>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryStat({ icon: Icon, value, label }: { icon: typeof Clock; value: string; label: string }) {
  return (
    <div className="rounded-xl border bg-secondary/30 p-2.5">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  )
}

function ChecklistRow({ done, active, children }: { done: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2.5 text-sm", active && "font-medium")}>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          done ? "border-success bg-success text-success-foreground" : "border-border text-transparent",
        )}
      >
        <Check className="h-3 w-3" />
      </span>
      <span className={cn(done ? "text-foreground" : "text-muted-foreground")}>{children}</span>
    </div>
  )
}

function RuSelect({
  label,
  table,
  value,
  onValueChange,
  compact,
}: {
  label: string
  table: keyof typeof ruCodeTables
  value: string
  onValueChange: (value: string) => void
  compact?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label className={compact ? "text-xs" : undefined}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("w-full min-w-0", compact ? undefined : "h-11")}>
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
