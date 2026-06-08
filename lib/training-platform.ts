import { useEffect, useMemo, useState } from "react"
import { departments, trainingParticipants, trainings as mockTrainings, users as mockUsers } from "@/lib/mock-data"
import type { CalendarEvent, Document, User } from "@/lib/types"

export type TrainingStatus = "scheduled" | "in_progress" | "completed" | "cancelled"
export type TrainingFormat = "presencial" | "online" | "hibrido"
export type TrainingType = "internal" | "external"

export interface RuTableEntry {
  code: string
  label: string
}

export type RuTableKey =
  | "T28"
  | "T29"
  | "T30"
  | "T31"
  | "T32"
  | "T33"
  | "T34"
  | "T35"
  | "T36"

export interface TrainingEmployee extends User {
  employeeNumber?: string
  jobTitle?: string
  location?: string
  manager?: string
  admissionDate?: string
  trainingHoursTarget?: number
  niss: string
  nif: string
  sexCode: string
  contractTypeCode: string
  educationLevelCode: string
  professionSituationCode: string
  cppCode: string
  irctCode?: string
  nonIrctCode?: string
  irctApplicabilityCode: string
  professionalCategoryCode: string
  employeeQualificationLevelCode: string
  workDurationRegimeCode: string
  workingTimeDurationCode: string
  workingTimeOrganizationCode: string
}

export type TrainingParticipantStatus = "confirmed" | "pending" | "absent" | "completed"

export interface TrainingParticipantRecord {
  id: string
  trainingActionId: string
  employeeId: string
  name: string
  email: string
  department: string
  status: TrainingParticipantStatus
  attendedHours: number
  trainingFrequencySituationCode: string
  trainingReferencePeriodCode: string
  certificateTypeCode: string
  signedAt?: Date
  score?: number
  certificateId?: string
}

export interface TrainingParticipantPayload {
  employeeId: string
  status: TrainingParticipantStatus
  attendedHours: number
  trainingFrequencySituationCode: string
  trainingReferencePeriodCode: string
  certificateTypeCode: string
}

export interface TrainingActionRecord {
  id: string
  title: string
  description: string
  type: TrainingType
  format: TrainingFormat
  instructor: string
  duration: number
  durationHours: number
  isInternal: boolean
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  endDate: Date
  location?: string
  status: TrainingStatus
  mandatory: boolean
  department?: string
  targetDepartments?: string[]
  skills: string[]
  materials: Document[]
  createdAt: Date
  updatedAt: Date
  educationAreaCode: string
  trainingModalityCode: string
  trainingInitiativeCode: string
  trainingScheduleCode: string
  trainingEntityCode: string
  trainingQualificationLevelCode: string
  trainingProviderId?: string
  trainingProviderName?: string
}

export interface TrainingProvider {
  id: string
  name: string
  typeCode: string
  nif?: string
  contactEmail?: string
  location?: string
  createdAt: Date
}

export type TrainingTaskStatus = "pending" | "in_progress" | "completed"
export type TrainingTaskPriority = "high" | "medium" | "low"

export interface TrainingTask {
  id: string
  trainingId: string
  title: string
  owner: string
  dueDate: Date
  status: TrainingTaskStatus
  priority: TrainingTaskPriority
  notes?: string
  createdAt: Date
}

export interface TrainingWorkspaceState {
  trainings: TrainingActionRecord[]
  participantsByTraining: Record<string, TrainingParticipantRecord[]>
  tasks: TrainingTask[]
  employees: TrainingEmployee[]
  trainingProviders: TrainingProvider[]
}

const emptyWorkspaceState: TrainingWorkspaceState = {
  trainings: [],
  participantsByTraining: {},
  tasks: [],
  employees: [],
  trainingProviders: [],
}

export interface TrainingFormPayload {
  title: string
  description: string
  type: TrainingType
  format: TrainingFormat
  instructor: string
  duration: number
  durationHours: number
  maxParticipants: number
  location?: string
  mandatory: boolean
  department?: string
  targetDepartments?: string[]
  status: TrainingStatus
  startDate: Date
  endDate: Date
  skills: string[]
  isInternal: boolean
  educationAreaCode: string
  trainingModalityCode: string
  trainingInitiativeCode: string
  trainingScheduleCode: string
  trainingEntityCode: string
  trainingQualificationLevelCode: string
  trainingProviderId?: string
  trainingProviderName?: string
  participants: TrainingParticipantPayload[]
}

export interface CreateEmployeePayload {
  name: string
  email: string
  department: string
  employeeNumber?: string
  jobTitle?: string
  location?: string
  manager?: string
  admissionDate?: string
  trainingHoursTarget?: number
}

export interface CreateTrainingProviderPayload {
  name: string
  typeCode: string
  nif?: string
  contactEmail?: string
  location?: string
}

export interface ImportSummary {
  created: number
  updated: number
  skipped: number
  errors: string[]
}

export interface TrainingTestingGuideStep {
  id: string
  title: string
  description: string
  href?: string
  actionLabel?: string
}

export interface RuValidationIssue {
  scope: "action" | "participants" | "employee"
  field: string
  message: string
  participantId?: string
  employeeId?: string
}

export interface RuValidationResult {
  eligible: boolean
  issues: RuValidationIssue[]
  participantCount: number
  validParticipantCount: number
}

const STORAGE_KEY = "rhinova-training-workspace-v2"
export const collaboratorTemplatePath = "/templates/rhinova-colaboradores-modelo.xlsx"
export const trainingProviderTemplatePath = "/templates/rhinova-entidades-formadoras-modelo.xlsx"
const LEGACY_SEEDED_TRAINING_IDS = new Set(mockTrainings.map((training) => training.id))
const LEGACY_SEEDED_EMPLOYEE_EMAILS = new Set([
  ...mockUsers.map((user) => user.email.toLowerCase()),
  ...Object.values(trainingParticipants)
    .flat()
    .map((participant) => participant.email.toLowerCase()),
])

export const trainingStatusLabels: Record<TrainingStatus, string> = {
  scheduled: "Agendada",
  in_progress: "Em curso",
  completed: "Concluida",
  cancelled: "Cancelada",
}

export const trainingFormatLabels: Record<TrainingFormat, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Hibrido",
}

export const participantStatusLabels: Record<TrainingParticipantStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  absent: "Ausente",
  completed: "Concluido",
}

export const taskStatusLabels: Record<TrainingTaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em progresso",
  completed: "Concluida",
}

export const taskPriorityLabels: Record<TrainingTaskPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
}

export const ruCodeTables: Record<RuTableKey, RuTableEntry[]> = {
  T28: [
    { code: "01", label: "Frequentou formação no ano" },
    { code: "02", label: "Recebeu compensação monetária ou crédito de horas" },
    { code: "03", label: "Usou horas para trabalhador-estudante / RVCC" },
    { code: "08", label: "Outra situação" },
  ],
  T29: [
    { code: "01", label: "Ano de referência" },
    { code: "02", label: "Ano anterior" },
    { code: "03", label: "Período plurianual" },
  ],
  T30: [
    { code: "090", label: "Desenvolvimento pessoal" },
    { code: "345", label: "Gestão e administração" },
    { code: "346", label: "Secretariado e trabalho administrativo" },
    { code: "481", label: "Informática na ótica do utilizador" },
    { code: "482", label: "Informática" },
    { code: "729", label: "Saúde - programas não classificados noutra área" },
    { code: "862", label: "Segurança e higiene no trabalho" },
  ],
  T31: [
    { code: "01", label: "Presencial" },
    { code: "02", label: "E-learning" },
    { code: "03", label: "B-learning" },
    { code: "04", label: "Formação em contexto de trabalho" },
  ],
  T32: [
    { code: "01", label: "Plano de formação da empresa" },
    { code: "02", label: "Obrigação legal" },
    { code: "03", label: "Reciclagem / atualização profissional" },
    { code: "04", label: "Desenvolvimento individual" },
  ],
  T33: [
    { code: "01", label: "Laboral" },
    { code: "02", label: "Pós-laboral" },
    { code: "03", label: "Misto" },
  ],
  T34: [
    { code: "01", label: "Entidade empregadora" },
    { code: "02", label: "Centro de formação externo" },
    { code: "03", label: "Instituição de ensino" },
    { code: "04", label: "Associação setorial / profissional" },
  ],
  T35: [
    { code: "01", label: "Certificado" },
    { code: "02", label: "Diploma" },
    { code: "03", label: "Sem certificado" },
    { code: "04", label: "Não aplicável" },
    { code: "99", label: "Desconhecido" },
  ],
  T36: [
    { code: "01", label: "Sem equivalência formal" },
    { code: "02", label: "Nível básico" },
    { code: "03", label: "Nível secundário" },
    { code: "04", label: "Nível pós-secundário" },
    { code: "05", label: "Nível superior" },
  ],
}

export const trainingTestingGuide: TrainingTestingGuideStep[] = [
  {
    id: "guide-1",
    title: "Importe ou crie colaboradores",
    description: "Comece por montar a base de pessoas com nome, email, departamento e objetivo anual de horas.",
    href: "/dashboard/trainings",
    actionLabel: "Gerir colaboradores",
  },
  {
    id: "guide-2",
    title: "Registe a primeira formação",
    description: "Crie uma ação com título, datas, carga horária e participantes para alimentar logo o catálogo.",
    href: "/dashboard/trainings/new",
    actionLabel: "Criar formação",
  },
  {
    id: "guide-3",
    title: "Adicione entidades formadoras",
    description: "Guarde os parceiros ou centros de formação que usa com mais frequência para organizar melhor a operação.",
    href: "/dashboard/trainings",
    actionLabel: "Gerir entidades",
  },
  {
    id: "guide-4",
    title: "Exporte quando precisar",
    description: "Quando já existirem dados, exporte o mapa de formações e o resumo por colaborador para reporting.",
    href: "/dashboard/trainings",
    actionLabel: "Exportar dados",
  },
  {
    id: "guide-5",
    title: "Acompanhe progresso por colaborador",
    description: "Veja rapidamente quantas horas cada pessoa já tem concluídas e quem ainda precisa de formação.",
    href: "/dashboard/trainings",
    actionLabel: "Ver progresso",
  },
  {
    id: "guide-6",
    title: "Valide os códigos só no fim",
    description: "Os campos de relatório único continuam disponíveis, mas surgem como detalhe operacional e não como barreira de arranque.",
    href: "/dashboard/trainings/playbook",
    actionLabel: "Abrir guia",
  },
]

const employeeFieldLabels: Record<keyof Pick<
  TrainingEmployee,
  | "niss"
  | "nif"
  | "sexCode"
  | "contractTypeCode"
  | "educationLevelCode"
  | "professionSituationCode"
  | "cppCode"
  | "irctApplicabilityCode"
  | "professionalCategoryCode"
  | "employeeQualificationLevelCode"
  | "workDurationRegimeCode"
  | "workingTimeDurationCode"
  | "workingTimeOrganizationCode"
>, string> = {
  niss: "NISS",
  nif: "NIF",
  sexCode: "T12 Sexo",
  contractTypeCode: "T13 Tipo de contrato",
  educationLevelCode: "T14 Nível de escolaridade",
  professionSituationCode: "T15 Situação na profissão",
  cppCode: "T16 CPP",
  irctApplicabilityCode: "T19 Aplicabilidade de IRCT",
  professionalCategoryCode: "T20 Categoria profissional",
  employeeQualificationLevelCode: "T21 Nível de qualificação do trabalhador",
  workDurationRegimeCode: "T22 Regime de duração do trabalho",
  workingTimeDurationCode: "T23 Duração do tempo de trabalho",
  workingTimeOrganizationCode: "T24 Organização do tempo de trabalho",
}

const ruActionRequiredFields: Array<keyof Pick<
  TrainingActionRecord,
  | "title"
  | "startDate"
  | "endDate"
  | "durationHours"
  | "educationAreaCode"
  | "trainingModalityCode"
  | "trainingInitiativeCode"
  | "trainingScheduleCode"
  | "trainingEntityCode"
  | "trainingQualificationLevelCode"
>> = [
  "title",
  "startDate",
  "endDate",
  "durationHours",
  "educationAreaCode",
  "trainingModalityCode",
  "trainingInitiativeCode",
  "trainingScheduleCode",
  "trainingEntityCode",
  "trainingQualificationLevelCode",
]

function normalizeDepartmentName(department: string) {
  if (department === "RH") return "Recursos Humanos"
  return department
}

function dateAt(year: number, month: number, day: number, hour = 9, minute = 0) {
  return new Date(year, month, day, hour, minute, 0, 0)
}

function shiftDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0, 0)
}

function endOfTraining(startDate: Date, duration: number) {
  const end = new Date(startDate)
  end.setHours(end.getHours() + Math.max(duration, 1))
  return end
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "pt"))
}

function formatCodeSeed(base: string, length: number) {
  return base.padStart(length, "0").slice(-length)
}

function buildRuEmployeeProfile(seed: string, role: User["role"]): Pick<
  TrainingEmployee,
  | "niss"
  | "nif"
  | "sexCode"
  | "contractTypeCode"
  | "educationLevelCode"
  | "professionSituationCode"
  | "cppCode"
  | "irctCode"
  | "nonIrctCode"
  | "irctApplicabilityCode"
  | "professionalCategoryCode"
  | "employeeQualificationLevelCode"
  | "workDurationRegimeCode"
  | "workingTimeDurationCode"
  | "workingTimeOrganizationCode"
> {
  const numericSeed = seed.replace(/\D/g, "") || "1"
  const niss = formatCodeSeed(`11${numericSeed}`, 11)
  const nif = formatCodeSeed(`2${numericSeed}`, 9)

  return {
    niss,
    nif,
    sexCode: Number(numericSeed) % 2 === 0 ? "F" : "M",
    contractTypeCode: role === "admin" ? "01" : "02",
    educationLevelCode: role === "hr_manager" ? "07" : "06",
    professionSituationCode: "01",
    cppCode: "2519",
    irctCode: "000001",
    nonIrctCode: "",
    irctApplicabilityCode: "01",
    professionalCategoryCode: role === "hr_manager" ? "1223" : "3341",
    employeeQualificationLevelCode: role === "hr_manager" ? "05" : "04",
    workDurationRegimeCode: "01",
    workingTimeDurationCode: "40",
    workingTimeOrganizationCode: "01",
  }
}

export function getRuLabel(table: RuTableKey, code?: string) {
  if (!code) return "Por definir"
  return ruCodeTables[table].find((entry) => entry.code === code)?.label || code
}

export function getEmployeeRuMissingFields(employee: TrainingEmployee) {
  const missingFields = Object.entries(employeeFieldLabels).flatMap(([field, label]) => {
    const value = employee[field as keyof typeof employeeFieldLabels]
    return value ? [] : [label]
  })

  if (employee.irctApplicabilityCode === "01" && !employee.irctCode && !employee.nonIrctCode) {
    missingFields.push("T17/T18 IRCT ou Não IRCT")
  }

  return missingFields
}

export function isEmployeeRuReady(employee: TrainingEmployee) {
  return getEmployeeRuMissingFields(employee).length === 0
}

function createRuDefaultsForTraining(index: number) {
  const educationAreaFallbacks = ["862", "345", "482", "481", "090"]
  const scheduleFallbacks = ["01", "03", "01", "02", "01"]
  const entityFallbacks = ["01", "02", "01", "02", "01"]

  return {
    educationAreaCode: educationAreaFallbacks[index] || "345",
    trainingModalityCode: index === 2 ? "02" : index === 1 ? "03" : "01",
    trainingInitiativeCode: index === 0 || index === 2 ? "02" : "01",
    trainingScheduleCode: scheduleFallbacks[index] || "01",
    trainingEntityCode: entityFallbacks[index] || "01",
    trainingQualificationLevelCode: index >= 3 ? "05" : "03",
  }
}

function getTrainingSeeds(): TrainingActionRecord[] {
  const year = new Date().getFullYear()

  const seededDates: Record<string, Pick<TrainingActionRecord, "startDate" | "endDate" | "status" | "location">> = {
    "1": {
      startDate: dateAt(year, 5, 18, 9),
      endDate: dateAt(year, 5, 18, 17),
      status: "scheduled",
      location: "Sala Atlas",
    },
    "2": {
      startDate: dateAt(year, 6, 2, 9),
      endDate: dateAt(year, 6, 3, 17),
      status: "scheduled",
      location: "Hub RH + Teams",
    },
    "3": {
      startDate: dateAt(year, 5, 10, 10),
      endDate: dateAt(year, 5, 10, 14),
      status: "in_progress",
      location: "Teams",
    },
    "4": {
      startDate: dateAt(year, 6, 16, 9),
      endDate: dateAt(year, 6, 17, 13),
      status: "scheduled",
      location: "Academia Finance",
    },
    "5": {
      startDate: dateAt(year, 4, 14, 9),
      endDate: dateAt(year, 4, 14, 17),
      status: "completed",
      location: "Sala Sprint",
    },
  }

  return mockTrainings.map((training, index) => {
    const seeded = seededDates[training.id]
    const ruDefaults = createRuDefaultsForTraining(index)

    return {
      id: training.id,
      title: training.title,
      description: training.description,
      type: training.type,
      format: training.format,
      instructor: training.instructor,
      duration: training.duration,
      durationHours: training.duration,
      isInternal: training.type === "internal",
      maxParticipants: training.maxParticipants,
      currentParticipants: training.currentParticipants,
      startDate: seeded.startDate,
      endDate: seeded.endDate,
      location: training.location ?? seeded.location,
      status: seeded.status,
      mandatory: training.mandatory,
      department: training.department,
      skills: training.skills,
      materials: training.materials,
      createdAt: shiftDays(seeded.startDate, -25),
      updatedAt: shiftDays(seeded.startDate, -10),
      ...ruDefaults,
    }
  })
}

function buildEmployeeDirectory(): TrainingEmployee[] {
  const byEmail = new Map<string, TrainingEmployee>()

  for (const user of mockUsers) {
    byEmail.set(user.email, {
      ...user,
      department: normalizeDepartmentName(user.department),
      employeeNumber: `RH-${user.id.padStart(4, "0")}`,
      jobTitle: user.role === "hr_manager" ? "HR Manager" : user.role === "admin" ? "Administrador" : "Colaborador",
      location: "Lisboa",
      ...buildRuEmployeeProfile(user.id, user.role),
    })
  }

  const participantGroups = Object.values(trainingParticipants).flat()
  for (const participant of participantGroups) {
    if (byEmail.has(participant.email)) continue

    byEmail.set(participant.email, {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      role: "employee",
      department: normalizeDepartmentName(participant.department),
      createdAt: shiftDays(new Date(), -120),
      employeeNumber: `RH-${participant.id.padStart(4, "0")}`,
      jobTitle: "Colaborador",
      location: "Porto",
      ...buildRuEmployeeProfile(participant.id, "employee"),
    })
  }

  return sortByName(Array.from(byEmail.values()))
}

function buildParticipantsDirectory(trainings: TrainingActionRecord[], employees: TrainingEmployee[]): Record<string, TrainingParticipantRecord[]> {
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))
  const trainingById = new Map(trainings.map((training) => [training.id, training]))

  return Object.fromEntries(
    Object.entries(trainingParticipants).map(([trainingId, participants]) => {
      const training = trainingById.get(trainingId)
      const attendedHoursDefault = training?.durationHours || 8

      return [
        trainingId,
        participants.map((participant) => {
          const employee = employeeById.get(participant.id)
          return {
            id: createId("participant"),
            trainingActionId: trainingId,
            employeeId: participant.id,
            name: participant.name,
            email: participant.email,
            department: normalizeDepartmentName(participant.department),
            status: participant.status,
            attendedHours:
              participant.status === "absent"
                ? 0
                : participant.status === "pending"
                  ? Math.max(attendedHoursDefault - 2, 1)
                  : attendedHoursDefault,
            trainingFrequencySituationCode: participant.status === "absent" ? "08" : "01",
            trainingReferencePeriodCode: "01",
            certificateTypeCode: participant.certificateId ? "01" : participant.status === "completed" ? "03" : "04",
            signedAt: participant.signedAt ? new Date(participant.signedAt) : undefined,
            score: participant.score,
            certificateId: participant.certificateId,
          }
        }),
      ]
    }),
  )
}

function buildSeedTasks(trainings: TrainingActionRecord[]): TrainingTask[] {
  const tasks: TrainingTask[] = []

  for (const training of trainings) {
    const sendInvitesStatus: TrainingTaskStatus =
      training.status === "completed" || training.status === "in_progress" ? "completed" : "pending"
    const readinessStatus: TrainingTaskStatus =
      training.status === "completed"
        ? "completed"
        : training.status === "in_progress"
          ? "in_progress"
          : "pending"
    const evidenceStatus: TrainingTaskStatus = training.status === "completed" ? "completed" : "pending"

    tasks.push(
      {
        id: createId("task"),
        trainingId: training.id,
        title: "Enviar convocatorias e confirmar presencas",
        owner: "Equipa RH",
        dueDate: shiftDays(training.startDate, -7),
        status: sendInvitesStatus,
        priority: "high",
        notes: "Acao critica para garantir taxa de adesao e prova de comunicacao.",
        createdAt: shiftDays(training.startDate, -20),
      },
      {
        id: createId("task"),
        trainingId: training.id,
        title: "Validar T30-T36 e entidade formadora",
        owner: "Compliance RH",
        dueDate: shiftDays(training.startDate, -3),
        status: readinessStatus,
        priority: "high",
        notes: "Confirmar codigos oficiais do Relatorio Unico e respetivos labels.",
        createdAt: shiftDays(training.startDate, -16),
      },
      {
        id: createId("task"),
        trainingId: training.id,
        title: "Recolher evidencias para relatorio anual",
        owner: "Compliance RH",
        dueDate: shiftDays(training.endDate, 2),
        status: evidenceStatus,
        priority: "high",
        notes: "Guardar horas, listas de presenca, certificados e entidade formadora.",
        createdAt: shiftDays(training.startDate, -10),
      },
    )
  }

  return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

function createSeedState(): TrainingWorkspaceState {
  return emptyWorkspaceState
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function detectDelimiter(row: string) {
  const candidates = [",", ";", "\t"] as const
  const counts = candidates.map((delimiter) => ({
    delimiter,
    count: row.split(delimiter).length,
  }))

  return counts.sort((left, right) => right.count - left.count)[0]?.delimiter || ","
}

function parseDelimitedText(raw: string) {
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim()
  if (!normalized) return [] as string[][]

  const delimiter = detectDelimiter(normalized.split("\n")[0] || ",")
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentCell = ""
  let inQuotes = false

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]
    const next = normalized[index + 1]

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentCell += "\""
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && char === delimiter) {
      currentRow.push(currentCell.trim())
      currentCell = ""
      continue
    }

    if (!inQuotes && char === "\n") {
      currentRow.push(currentCell.trim())
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow)
      }
      currentRow = []
      currentCell = ""
      continue
    }

    currentCell += char
  }

  currentRow.push(currentCell.trim())
  if (currentRow.some((value) => value.length > 0)) {
    rows.push(currentRow)
  }

  return rows
}

function toOptionalNumber(value?: string) {
  if (!value) return undefined
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? parsed : undefined
}

function toOptionalString(value?: string) {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

function toImportSummary() {
  return {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[],
  } as ImportSummary
}

function parseEmployeeImportRows(raw: string) {
  const rows = parseDelimitedText(raw)
  if (rows.length < 2) return []

  const [headerRow, ...dataRows] = rows
  const headers = headerRow.map(normalizeHeader)

  return dataRows.map((row, index) => {
    const entry = Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex] || ""]))
    return {
      index,
      name: toOptionalString(entry.nome_completo || entry.nome),
      email: toOptionalString(entry.email),
      department: toOptionalString(entry.departamento || entry.department),
      jobTitle: toOptionalString(entry.funcao || entry.cargo || entry.job_title),
      employeeNumber: toOptionalString(entry.numero_colaborador || entry.numero || entry.employee_number),
      admissionDate: toOptionalString(entry.data_admissao || entry.admission_date),
      manager: toOptionalString(entry.manager || entry.gestor || entry.responsavel),
      location: toOptionalString(entry.localizacao || entry.location),
      trainingHoursTarget: toOptionalNumber(entry.horas_formacao_ano || entry.training_hours_target),
    }
  })
}

function parseTrainingProviderImportRows(raw: string) {
  const rows = parseDelimitedText(raw)
  if (rows.length < 2) return []

  const [headerRow, ...dataRows] = rows
  const headers = headerRow.map(normalizeHeader)

  return dataRows.map((row, index) => {
    const entry = Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex] || ""]))
    return {
      index,
      name: toOptionalString(entry.nome || entry.entidade || entry.nome_entidade),
      typeCode: toOptionalString(entry.tipo_codigo || entry.t34 || entry.type_code) || "02",
      nif: toOptionalString(entry.nif),
      contactEmail: toOptionalString(entry.email || entry.contacto_email),
      location: toOptionalString(entry.localizacao || entry.location),
    }
  })
}

function csvEscape(value: string | number | undefined | null) {
  if (value === undefined || value === null) return ""
  const text = String(value)
  if (text.includes("\"") || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, "\"\"")}"`
  }
  return text
}

export function buildCsv(rows: Array<Record<string, string | number | undefined | null>>) {
  if (rows.length === 0) return ""
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ]
  return lines.join("\n")
}

export function buildTrainingMapExportRows(state: TrainingWorkspaceState) {
  return state.trainings.map((training) => {
    const participants = state.participantsByTraining[training.id] || []
    const completedHours = participants.reduce((total, participant) => total + participant.attendedHours, 0)

    return {
      formacao: training.title,
      estado: trainingStatusLabels[training.status],
      formato: trainingFormatLabels[training.format],
      departamento: training.department || "Sem departamento",
      departamentos_alvo: training.targetDepartments?.join(" | ") || training.department || "Sem departamento",
      entidade_formadora: training.trainingProviderName || getRuLabel("T34", training.trainingEntityCode),
      formador: training.instructor,
      inicio: training.startDate.toLocaleDateString("pt-PT"),
      fim: training.endDate.toLocaleDateString("pt-PT"),
      horas: training.durationHours,
      participantes: participants.length,
      horas_frequentadas: completedHours,
      obrigatoria: training.mandatory ? "Sim" : "Nao",
    }
  })
}

export function buildEmployeeTrainingExportRows(state: TrainingWorkspaceState) {
  return state.employees.map((employee) => {
    const participations = Object.entries(state.participantsByTraining).flatMap(([trainingId, participants]) =>
      participants
        .filter((participant) => participant.employeeId === employee.id)
        .map((participant) => ({ trainingId, participant })),
    )
    const attendedHours = participations.reduce((total, item) => total + item.participant.attendedHours, 0)
    const trainingTitles = participations
      .map(({ trainingId }) => state.trainings.find((training) => training.id === trainingId)?.title)
      .filter((title): title is string => Boolean(title))

    return {
      colaborador: employee.name,
      email: employee.email,
      departamento: employee.department,
      funcao: employee.jobTitle || "",
      manager: employee.manager || "",
      localizacao: employee.location || "",
      objetivo_horas: employee.trainingHoursTarget || 40,
      horas_concluidas: attendedHours,
      total_formacoes: trainingTitles.length,
      lista_formacoes: trainingTitles.join(" | "),
    }
  })
}

function serializeState(state: TrainingWorkspaceState) {
  return JSON.stringify(state)
}

function reviveState(raw: string | null): TrainingWorkspaceState | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<TrainingWorkspaceState>

    const nextState = {
      trainings: (parsed.trainings || []).map((training) => ({
        ...training,
        startDate: new Date(training.startDate),
        endDate: new Date(training.endDate),
        createdAt: new Date(training.createdAt),
        updatedAt: new Date(training.updatedAt),
      })),
      participantsByTraining: Object.fromEntries(
        Object.entries(parsed.participantsByTraining || {}).map(([trainingId, participants]) => [
          trainingId,
          participants.map((participant) => ({
            ...participant,
            signedAt: participant.signedAt ? new Date(participant.signedAt) : undefined,
          })),
        ]),
      ),
      tasks: (parsed.tasks || []).map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
      })),
      employees: (parsed.employees || []).map((employee) => ({
        ...employee,
        createdAt: new Date(employee.createdAt),
        trainingHoursTarget:
          typeof employee.trainingHoursTarget === "number" ? employee.trainingHoursTarget : undefined,
      })),
      trainingProviders: (parsed.trainingProviders || []).map((provider) => ({
        ...provider,
        createdAt: new Date(provider.createdAt),
      })),
    }

    const filteredTrainings = nextState.trainings.filter(
      (training) => !LEGACY_SEEDED_TRAINING_IDS.has(training.id),
    )
    const validTrainingIds = new Set(filteredTrainings.map((training) => training.id))
    const filteredParticipantsByTraining = Object.fromEntries(
      Object.entries(nextState.participantsByTraining).filter(([trainingId]) =>
        validTrainingIds.has(trainingId),
      ),
    )
    const participantEmployeeIds = new Set(
      Object.values(filteredParticipantsByTraining)
        .flat()
        .map((participant) => participant.employeeId),
    )
    const filteredEmployees = nextState.employees.filter((employee) => {
      if (participantEmployeeIds.has(employee.id)) {
        return true
      }

      return !LEGACY_SEEDED_EMPLOYEE_EMAILS.has(employee.email.toLowerCase())
    })
    const validEmployeeIds = new Set(filteredEmployees.map((employee) => employee.id))

    return {
      trainings: filteredTrainings,
      participantsByTraining: Object.fromEntries(
        Object.entries(filteredParticipantsByTraining).map(([trainingId, participants]) => [
          trainingId,
          participants.filter((participant) => validEmployeeIds.has(participant.employeeId)),
        ]),
      ),
      tasks: nextState.tasks.filter((task) => validTrainingIds.has(task.trainingId)),
      employees: filteredEmployees,
      trainingProviders: nextState.trainingProviders,
    }
  } catch {
    return null
  }
}

function persistState(next: TrainingWorkspaceState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, serializeState(next))
}

function createParticipantRecord(
  employee: TrainingEmployee,
  training: Pick<TrainingActionRecord, "id" | "durationHours">,
  existing?: TrainingParticipantRecord,
  payload?: Partial<TrainingParticipantPayload>,
): TrainingParticipantRecord {
  return {
    id: existing?.id || createId("participant"),
    trainingActionId: training.id,
    employeeId: employee.id,
    name: employee.name,
    email: employee.email,
    department: employee.department,
    status: payload?.status || existing?.status || "pending",
    attendedHours: payload?.attendedHours ?? existing?.attendedHours ?? training.durationHours,
    trainingFrequencySituationCode:
      payload?.trainingFrequencySituationCode || existing?.trainingFrequencySituationCode || "01",
    trainingReferencePeriodCode:
      payload?.trainingReferencePeriodCode || existing?.trainingReferencePeriodCode || "01",
    certificateTypeCode: payload?.certificateTypeCode || existing?.certificateTypeCode || "01",
    signedAt: existing?.signedAt,
    score: existing?.score,
    certificateId: existing?.certificateId,
  }
}

function resolveParticipants(
  participantPayloads: TrainingParticipantPayload[],
  employees: TrainingEmployee[],
  training: Pick<TrainingActionRecord, "id" | "durationHours">,
  existing: TrainingParticipantRecord[] = [],
) {
  const existingByEmployeeId = new Map(existing.map((participant) => [participant.employeeId, participant]))
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))

  return participantPayloads
    .map((payload) => {
      const employee = employeeById.get(payload.employeeId)
      if (!employee) return null
      const existingParticipant = existingByEmployeeId.get(payload.employeeId)
      return createParticipantRecord(employee, training, existingParticipant, payload)
    })
    .filter((participant): participant is TrainingParticipantRecord => Boolean(participant))
}

function updateTrainingParticipants(
  state: TrainingWorkspaceState,
  training: TrainingActionRecord,
  participantPayloads: TrainingParticipantPayload[],
) {
  const existingParticipants = state.participantsByTraining[training.id] || []

  return {
    ...state.participantsByTraining,
    [training.id]: resolveParticipants(participantPayloads, state.employees, training, existingParticipants),
  }
}

export function getTrainingRuValidation(
  training: TrainingActionRecord,
  participants: TrainingParticipantRecord[],
  employees: TrainingEmployee[],
): RuValidationResult {
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))
  const issues: RuValidationIssue[] = []

  for (const field of ruActionRequiredFields) {
    const value = training[field]
    if (value === undefined || value === null || value === "" || value === 0) {
      issues.push({
        scope: "action",
        field: String(field),
        message: `Campo obrigatório em falta na ação: ${String(field)}`,
      })
    }
  }

  if (participants.length === 0) {
    issues.push({
      scope: "participants",
      field: "participants",
      message: "A ação precisa de pelo menos um participante.",
    })
  }

  for (const participant of participants) {
    if (!(participant.attendedHours > 0)) {
      issues.push({
        scope: "participants",
        field: "attendedHours",
        participantId: participant.id,
        employeeId: participant.employeeId,
        message: `${participant.name}: horas frequentadas em falta.`,
      })
    }

    if (!participant.trainingFrequencySituationCode) {
      issues.push({
        scope: "participants",
        field: "trainingFrequencySituationCode",
        participantId: participant.id,
        employeeId: participant.employeeId,
        message: `${participant.name}: código T28 em falta.`,
      })
    }

    if (!participant.trainingReferencePeriodCode) {
      issues.push({
        scope: "participants",
        field: "trainingReferencePeriodCode",
        participantId: participant.id,
        employeeId: participant.employeeId,
        message: `${participant.name}: código T29 em falta.`,
      })
    }

    if (!participant.certificateTypeCode) {
      issues.push({
        scope: "participants",
        field: "certificateTypeCode",
        participantId: participant.id,
        employeeId: participant.employeeId,
        message: `${participant.name}: código T35 em falta.`,
      })
    }

    const employee = employeeById.get(participant.employeeId)
    if (!employee) {
      issues.push({
        scope: "employee",
        field: "employeeId",
        participantId: participant.id,
        employeeId: participant.employeeId,
        message: `${participant.name}: ficha RH não encontrada.`,
      })
      continue
    }

    const missingEmployeeFields = getEmployeeRuMissingFields(employee)
    for (const missingField of missingEmployeeFields) {
      issues.push({
        scope: "employee",
        field: missingField,
        participantId: participant.id,
        employeeId: participant.employeeId,
        message: `${participant.name}: ficha RH incompleta (${missingField}).`,
      })
    }
  }

  return {
    eligible: issues.length === 0,
    issues,
    participantCount: participants.length,
    validParticipantCount: participants.length - new Set(
      issues.filter((issue) => issue.participantId).map((issue) => issue.participantId),
    ).size,
  }
}

export function buildRuExportPayload(
  training: TrainingActionRecord,
  participants: TrainingParticipantRecord[],
  employees: TrainingEmployee[],
) {
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]))

  return {
    trainingAction: {
      id: training.id,
      title: training.title,
      startDate: training.startDate.toISOString(),
      endDate: training.endDate.toISOString(),
      durationHours: training.durationHours,
      isInternal: training.isInternal,
      educationAreaCode: training.educationAreaCode,
      educationAreaLabel: getRuLabel("T30", training.educationAreaCode),
      trainingModalityCode: training.trainingModalityCode,
      trainingModalityLabel: getRuLabel("T31", training.trainingModalityCode),
      trainingInitiativeCode: training.trainingInitiativeCode,
      trainingInitiativeLabel: getRuLabel("T32", training.trainingInitiativeCode),
      trainingScheduleCode: training.trainingScheduleCode,
      trainingScheduleLabel: getRuLabel("T33", training.trainingScheduleCode),
      trainingEntityCode: training.trainingEntityCode,
      trainingEntityLabel: getRuLabel("T34", training.trainingEntityCode),
      trainingQualificationLevelCode: training.trainingQualificationLevelCode,
      trainingQualificationLevelLabel: getRuLabel("T36", training.trainingQualificationLevelCode),
      trainingProviderName: training.trainingProviderName,
    },
    participants: participants.map((participant) => {
      const employee = employeeById.get(participant.employeeId)
      return {
        id: participant.id,
        trainingActionId: participant.trainingActionId,
        employeeId: participant.employeeId,
        attendedHours: participant.attendedHours,
        trainingFrequencySituationCode: participant.trainingFrequencySituationCode,
        trainingReferencePeriodCode: participant.trainingReferencePeriodCode,
        certificateTypeCode: participant.certificateTypeCode,
        employee,
      }
    }),
  }
}

export function getTrainingCalendarEvents(state: TrainingWorkspaceState): CalendarEvent[] {
  const trainingEvents = state.trainings.map((training) => ({
    id: `training-${training.id}`,
    title: training.title,
    type: "training" as const,
    start: startOfDay(training.startDate),
    end: endOfTraining(startOfDay(training.startDate), training.durationHours),
    color: training.mandatory ? "destructive" : "primary",
    trainingId: training.id,
  }))

  const deadlineEvents = state.tasks
    .filter((task) => task.status !== "completed")
    .map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      type: "deadline" as const,
      start: task.dueDate,
      end: task.dueDate,
      color: task.priority === "high" ? "destructive" : "warning",
      trainingId: task.trainingId,
    }))

  return [...trainingEvents, ...deadlineEvents].sort((a, b) => a.start.getTime() - b.start.getTime())
}

export function useTrainingWorkspace() {
  const [state, setState] = useState<TrainingWorkspaceState>(emptyWorkspaceState)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const storedState = reviveState(window.localStorage.getItem(STORAGE_KEY))
    if (storedState) {
      setState(storedState)
    } else {
      setState(emptyWorkspaceState)
      persistState(emptyWorkspaceState)
    }
    setIsReady(true)
  }, [])

  const commit = (updater: TrainingWorkspaceState | ((previous: TrainingWorkspaceState) => TrainingWorkspaceState)) => {
    setState((previous) => {
      const next = typeof updater === "function" ? updater(previous) : updater
      persistState(next)
      return next
    })
  }

  const createTraining = (payload: TrainingFormPayload) => {
    const id = createId("training")
    const now = new Date()

    const training: TrainingActionRecord = {
      id,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      format: payload.format,
      instructor: payload.instructor,
      duration: payload.duration,
      durationHours: payload.durationHours,
      isInternal: payload.isInternal,
      maxParticipants: payload.maxParticipants,
      currentParticipants: payload.participants.length,
      startDate: payload.startDate,
      endDate: payload.endDate,
      location: payload.location,
      status: payload.status,
      mandatory: payload.mandatory,
      department: payload.department,
      targetDepartments: payload.targetDepartments,
      skills: payload.skills,
      materials: [],
      createdAt: now,
      updatedAt: now,
      educationAreaCode: payload.educationAreaCode,
      trainingModalityCode: payload.trainingModalityCode,
      trainingInitiativeCode: payload.trainingInitiativeCode,
      trainingScheduleCode: payload.trainingScheduleCode,
      trainingEntityCode: payload.trainingEntityCode,
      trainingQualificationLevelCode: payload.trainingQualificationLevelCode,
      trainingProviderId: payload.trainingProviderId,
      trainingProviderName: payload.trainingProviderName,
    }

    const tasks = buildSeedTasks([training])

    commit((previous) => ({
      ...previous,
      trainings: [training, ...previous.trainings],
      participantsByTraining: {
        ...previous.participantsByTraining,
        [id]: resolveParticipants(payload.participants, previous.employees, training),
      },
      tasks: [...tasks, ...previous.tasks],
    }))

    return training
  }

  const updateTraining = (trainingId: string, payload: TrainingFormPayload) => {
    commit((previous) => {
      const currentTraining = previous.trainings.find((training) => training.id === trainingId)
      if (!currentTraining) return previous

      const updatedTraining: TrainingActionRecord = {
        ...currentTraining,
        title: payload.title,
        description: payload.description,
        type: payload.type,
        format: payload.format,
        instructor: payload.instructor,
        duration: payload.duration,
        durationHours: payload.durationHours,
        isInternal: payload.isInternal,
        maxParticipants: payload.maxParticipants,
        currentParticipants: payload.participants.length,
        startDate: payload.startDate,
        endDate: payload.endDate,
        location: payload.location,
        status: payload.status,
        mandatory: payload.mandatory,
        department: payload.department,
        targetDepartments: payload.targetDepartments,
        skills: payload.skills,
        updatedAt: new Date(),
        educationAreaCode: payload.educationAreaCode,
        trainingModalityCode: payload.trainingModalityCode,
        trainingInitiativeCode: payload.trainingInitiativeCode,
        trainingScheduleCode: payload.trainingScheduleCode,
        trainingEntityCode: payload.trainingEntityCode,
        trainingQualificationLevelCode: payload.trainingQualificationLevelCode,
        trainingProviderId: payload.trainingProviderId,
        trainingProviderName: payload.trainingProviderName,
      }

      return {
        ...previous,
        trainings: previous.trainings.map((training) => training.id === trainingId ? updatedTraining : training),
        participantsByTraining: updateTrainingParticipants(previous, updatedTraining, payload.participants),
      }
    })
  }

  const duplicateTraining = (trainingId: string) => {
    const sourceTraining = state.trainings.find((training) => training.id === trainingId)
    if (!sourceTraining) return null

    const newId = createId("training")
    const shiftedStartDate = shiftDays(sourceTraining.startDate, 14)
    const shiftedEndDate = shiftDays(sourceTraining.endDate, 14)
    const sourceParticipants = state.participantsByTraining[trainingId] || []

    const duplicatedTraining: TrainingActionRecord = {
      ...sourceTraining,
      id: newId,
      title: `${sourceTraining.title} - Copia`,
      startDate: shiftedStartDate,
      endDate: shiftedEndDate,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const duplicatedParticipants = sourceParticipants.map((participant) => ({
      ...participant,
      id: createId("participant"),
      trainingActionId: newId,
      status: participant.status === "completed" || participant.status === "absent" ? "pending" : participant.status,
      signedAt: undefined,
      score: undefined,
      certificateId: undefined,
    }))

    duplicatedTraining.currentParticipants = duplicatedParticipants.length

    const duplicatedTasks = (state.tasks.filter((task) => task.trainingId === trainingId).length
      ? state.tasks.filter((task) => task.trainingId === trainingId)
      : buildSeedTasks([duplicatedTraining])
    ).map((task) => ({
      ...task,
      id: createId("task"),
      trainingId: newId,
      dueDate: shiftDays(task.dueDate, 14),
      status: "pending" as TrainingTaskStatus,
      createdAt: new Date(),
    }))

    commit((previous) => ({
      ...previous,
      trainings: [duplicatedTraining, ...previous.trainings],
      participantsByTraining: {
        ...previous.participantsByTraining,
        [newId]: duplicatedParticipants,
      },
      tasks: [...duplicatedTasks, ...previous.tasks],
    }))

    return duplicatedTraining
  }

  const deleteTraining = (trainingId: string) => {
    commit((previous) => ({
      ...previous,
      trainings: previous.trainings.filter((training) => training.id !== trainingId),
      participantsByTraining: Object.fromEntries(
        Object.entries(previous.participantsByTraining).filter(([id]) => id !== trainingId),
      ),
      tasks: previous.tasks.filter((task) => task.trainingId !== trainingId),
    }))
  }

  const createEmployee = (payload: CreateEmployeePayload) => {
    const employeeId = createId("user")
    const employee: TrainingEmployee = {
      id: employeeId,
      name: payload.name,
      email: payload.email,
      role: "employee",
      department: normalizeDepartmentName(payload.department),
      createdAt: new Date(),
      employeeNumber: payload.employeeNumber,
      jobTitle: payload.jobTitle,
      location: payload.location,
      manager: payload.manager,
      admissionDate: payload.admissionDate,
      trainingHoursTarget: payload.trainingHoursTarget,
      ...buildRuEmployeeProfile(employeeId, "employee"),
    }

    commit((previous) => ({
      ...previous,
      employees: sortByName([employee, ...previous.employees]),
    }))

    return employee
  }

  const importEmployeesFromText = (raw: string) => {
    const rows = parseEmployeeImportRows(raw)
    const summary = toImportSummary()

    if (rows.length === 0) {
      summary.errors.push("Não encontrámos linhas válidas para importar.")
      return summary
    }

    commit((previous) => {
      const employees = [...previous.employees]
      const employeesByEmail = new Map(previous.employees.map((employee) => [employee.email.toLowerCase(), employee]))

      rows.forEach((row) => {
        if (!row.name || !row.email || !row.department) {
          summary.skipped += 1
          summary.errors.push(`Linha ${row.index + 2}: faltam nome, email ou departamento.`)
          return
        }

        const existing = employeesByEmail.get(row.email.toLowerCase())

        if (existing) {
          const updatedEmployee: TrainingEmployee = {
            ...existing,
            name: row.name,
            department: normalizeDepartmentName(row.department),
            jobTitle: row.jobTitle || existing.jobTitle,
            employeeNumber: row.employeeNumber || existing.employeeNumber,
            manager: row.manager || existing.manager,
            location: row.location || existing.location,
            admissionDate: row.admissionDate || existing.admissionDate,
            trainingHoursTarget: row.trainingHoursTarget ?? existing.trainingHoursTarget,
          }
          const employeeIndex = employees.findIndex((employee) => employee.id === existing.id)
          employees[employeeIndex] = updatedEmployee
          employeesByEmail.set(updatedEmployee.email.toLowerCase(), updatedEmployee)
          summary.updated += 1
          return
        }

        const importedEmployeeId = createId("user")
        const createdEmployee: TrainingEmployee = {
          id: importedEmployeeId,
          name: row.name,
          email: row.email,
          role: "employee",
          department: normalizeDepartmentName(row.department),
          createdAt: new Date(),
          employeeNumber: row.employeeNumber,
          jobTitle: row.jobTitle,
          location: row.location,
          manager: row.manager,
          admissionDate: row.admissionDate,
          trainingHoursTarget: row.trainingHoursTarget,
          ...buildRuEmployeeProfile(importedEmployeeId, "employee"),
        }

        employees.push(createdEmployee)
        employeesByEmail.set(createdEmployee.email.toLowerCase(), createdEmployee)
        summary.created += 1
      })

      return {
        ...previous,
        employees: sortByName(employees),
        participantsByTraining: Object.fromEntries(
          Object.entries(previous.participantsByTraining).map(([trainingId, participants]) => [
            trainingId,
            participants.map((participant) => {
              const employee = employees.find((item) => item.id === participant.employeeId)
              if (!employee) return participant
              return {
                ...participant,
                name: employee.name,
                email: employee.email,
                department: employee.department,
              }
            }),
          ]),
        ),
      }
    })

    return summary
  }

  const createTrainingProvider = (payload: CreateTrainingProviderPayload) => {
    const provider: TrainingProvider = {
      id: createId("provider"),
      name: payload.name,
      typeCode: payload.typeCode,
      nif: payload.nif,
      contactEmail: payload.contactEmail,
      location: payload.location,
      createdAt: new Date(),
    }

    commit((previous) => ({
      ...previous,
      trainingProviders: sortByName([provider, ...previous.trainingProviders]),
    }))

    return provider
  }

  const updateTrainingProvider = (providerId: string, payload: CreateTrainingProviderPayload) => {
    const currentProvider = state.trainingProviders.find((provider) => provider.id === providerId)
    if (!currentProvider) return null

    const updatedProvider: TrainingProvider = {
      ...currentProvider,
      name: payload.name,
      typeCode: payload.typeCode,
      nif: payload.nif,
      contactEmail: payload.contactEmail,
      location: payload.location,
    }

    commit((previous) => ({
      ...previous,
      trainingProviders: sortByName(
        previous.trainingProviders.map((provider) => provider.id === providerId ? updatedProvider : provider),
      ),
      trainings: previous.trainings.map((training) =>
        training.trainingProviderId === providerId
          ? { ...training, trainingProviderName: updatedProvider.name, trainingEntityCode: updatedProvider.typeCode }
          : training,
      ),
    }))

    return updatedProvider
  }

  const deleteTrainingProvider = (providerId: string) => {
    commit((previous) => ({
      ...previous,
      trainingProviders: previous.trainingProviders.filter((provider) => provider.id !== providerId),
      trainings: previous.trainings.map((training) =>
        training.trainingProviderId === providerId
          ? { ...training, trainingProviderId: undefined, trainingProviderName: undefined }
          : training,
      ),
    }))
  }

  const importTrainingProvidersFromText = (raw: string) => {
    const rows = parseTrainingProviderImportRows(raw)
    const summary = toImportSummary()

    if (rows.length === 0) {
      summary.errors.push("Não encontrámos entidades formadoras válidas para importar.")
      return summary
    }

    commit((previous) => {
      const providers = [...previous.trainingProviders]
      const providersByKey = new Map(
        previous.trainingProviders.map((provider) => [
          `${provider.nif || ""}::${provider.name.toLowerCase()}`,
          provider,
        ]),
      )

      rows.forEach((row) => {
        if (!row.name) {
          summary.skipped += 1
          summary.errors.push(`Linha ${row.index + 2}: falta o nome da entidade.`)
          return
        }

        const key = `${row.nif || ""}::${row.name.toLowerCase()}`
        const existing = providersByKey.get(key)

        if (existing) {
          const updatedProvider: TrainingProvider = {
            ...existing,
            name: row.name,
            typeCode: row.typeCode,
            nif: row.nif || existing.nif,
            contactEmail: row.contactEmail || existing.contactEmail,
            location: row.location || existing.location,
          }
          const providerIndex = providers.findIndex((provider) => provider.id === existing.id)
          providers[providerIndex] = updatedProvider
          providersByKey.set(key, updatedProvider)
          summary.updated += 1
          return
        }

        const provider: TrainingProvider = {
          id: createId("provider"),
          name: row.name,
          typeCode: row.typeCode,
          nif: row.nif,
          contactEmail: row.contactEmail,
          location: row.location,
          createdAt: new Date(),
        }

        providers.push(provider)
        providersByKey.set(key, provider)
        summary.created += 1
      })

      return {
        ...previous,
        trainingProviders: sortByName(providers),
      }
    })

    return summary
  }

  const addParticipant = (trainingId: string, employeeId: string) => {
    commit((previous) => {
      const training = previous.trainings.find((item) => item.id === trainingId)
      const employee = previous.employees.find((item) => item.id === employeeId)
      if (!training || !employee) return previous

      const nextParticipants = [
        ...(previous.participantsByTraining[trainingId] || []),
        createParticipantRecord(employee, training),
      ]

      return {
        ...previous,
        trainings: previous.trainings.map((item) =>
          item.id === trainingId
            ? { ...item, currentParticipants: nextParticipants.length, updatedAt: new Date() }
            : item,
        ),
        participantsByTraining: {
          ...previous.participantsByTraining,
          [trainingId]: nextParticipants,
        },
      }
    })
  }

  const removeParticipant = (trainingId: string, participantId: string) => {
    commit((previous) => {
      const nextParticipants = (previous.participantsByTraining[trainingId] || []).filter(
        (participant) => participant.id !== participantId,
      )

      return {
        ...previous,
        trainings: previous.trainings.map((training) =>
          training.id === trainingId
            ? { ...training, currentParticipants: nextParticipants.length, updatedAt: new Date() }
            : training,
        ),
        participantsByTraining: {
          ...previous.participantsByTraining,
          [trainingId]: nextParticipants,
        },
      }
    })
  }

  const updateParticipantStatus = (
    trainingId: string,
    participantId: string,
    status: TrainingParticipantStatus,
  ) => {
    commit((previous) => ({
      ...previous,
      participantsByTraining: {
        ...previous.participantsByTraining,
        [trainingId]: (previous.participantsByTraining[trainingId] || []).map((participant) =>
          participant.id === participantId
            ? {
                ...participant,
                status,
                attendedHours: status === "absent" ? 0 : participant.attendedHours,
                signedAt: status === "completed" ? new Date() : participant.signedAt,
              }
            : participant,
        ),
      },
    }))
  }

  const updateParticipantRuData = (
    trainingId: string,
    participantId: string,
    payload: Partial<Pick<
      TrainingParticipantRecord,
      "attendedHours" | "trainingFrequencySituationCode" | "trainingReferencePeriodCode" | "certificateTypeCode"
    >>,
  ) => {
    commit((previous) => ({
      ...previous,
      participantsByTraining: {
        ...previous.participantsByTraining,
        [trainingId]: (previous.participantsByTraining[trainingId] || []).map((participant) =>
          participant.id === participantId
            ? { ...participant, ...payload }
            : participant,
        ),
      },
    }))
  }

  const addTask = (task: Omit<TrainingTask, "id" | "createdAt">) => {
    const nextTask: TrainingTask = {
      ...task,
      id: createId("task"),
      createdAt: new Date(),
    }

    commit((previous) => ({
      ...previous,
      tasks: [...previous.tasks, nextTask].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    }))

    return nextTask
  }

  const updateTaskStatus = (taskId: string, status: TrainingTaskStatus) => {
    commit((previous) => ({
      ...previous,
      tasks: previous.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    }))
  }

  const deleteTask = (taskId: string) => {
    commit((previous) => ({
      ...previous,
      tasks: previous.tasks.filter((task) => task.id !== taskId),
    }))
  }

  const resetWorkspace = () => {
    commit(emptyWorkspaceState)
  }

  const departmentOptions = useMemo(() => {
    const fromEmployees = state.employees.map((employee) => employee.department)
    const fromTrainings = state.trainings
      .flatMap((training) => training.targetDepartments?.length ? training.targetDepartments : [training.department])
      .filter((department): department is string => Boolean(department))

    return Array.from(new Set([...fromEmployees, ...fromTrainings])).sort((a, b) =>
      a.localeCompare(b, "pt"),
    )
  }, [state.employees, state.trainings])

  const pendingTasks = useMemo(
    () =>
      state.tasks
        .filter((task) => task.status !== "completed")
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [state.tasks],
  )

  const calendarEvents = useMemo(() => getTrainingCalendarEvents(state), [state])

  return {
    state,
    isReady,
    departmentOptions,
    pendingTasks,
    calendarEvents,
    createTraining,
    updateTraining,
    duplicateTraining,
    deleteTraining,
    createEmployee,
    importEmployeesFromText,
    createTrainingProvider,
    updateTrainingProvider,
    deleteTrainingProvider,
    importTrainingProvidersFromText,
    addParticipant,
    removeParticipant,
    updateParticipantStatus,
    updateParticipantRuData,
    addTask,
    updateTaskStatus,
    deleteTask,
    resetWorkspace,
    buildRuValidationForTraining: (trainingId: string) => {
      const training = state.trainings.find((item) => item.id === trainingId)
      if (!training) return null
      return getTrainingRuValidation(training, state.participantsByTraining[trainingId] || [], state.employees)
    },
    buildRuExportForTraining: (trainingId: string) => {
      const training = state.trainings.find((item) => item.id === trainingId)
      if (!training) return null
      return buildRuExportPayload(training, state.participantsByTraining[trainingId] || [], state.employees)
    },
    buildTrainingMapExport: () => buildTrainingMapExportRows(state),
    buildEmployeeTrainingExport: () => buildEmployeeTrainingExportRows(state),
  }
}
