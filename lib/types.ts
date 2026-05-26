export type UserRole = 'admin' | 'hr_manager' | 'employee'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
  createdAt: Date
}

export interface Training {
  id: string
  title: string
  description: string
  type: 'internal' | 'external'
  format: 'presencial' | 'online' | 'hibrido'
  instructor: string
  duration: number // in hours
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  endDate: Date
  location?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  mandatory: boolean
  department?: string
  skills: string[]
  materials: Document[]
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  name: string
  type: 'certificate' | 'manual' | 'presentation' | 'other'
  url: string
  uploadedAt: Date
  uploadedBy: string
  size: number
}

export interface Certification {
  id: string
  userId: string
  trainingId: string
  certificateNumber: string
  issuedAt: Date
  expiresAt?: Date
  status: 'valid' | 'expiring_soon' | 'expired'
  documentUrl?: string
}

export interface Attendance {
  id: string
  trainingId: string
  userId: string
  status: 'confirmed' | 'pending' | 'absent' | 'cancelled'
  signature?: string
  signedAt?: Date
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  type: 'training_invite' | 'certification_expiring' | 'training_reminder' | 'compliance_alert' | 'system'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export interface Department {
  id: string
  name: string
  managerId: string
  employeeCount: number
  trainingBudget: number
  usedBudget: number
}

export interface ComplianceMetrics {
  totalEmployees: number
  compliantEmployees: number
  complianceRate: number
  pendingCertifications: number
  expiringCertifications: number
  upcomingTrainings: number
  completedThisMonth: number
  hoursThisMonth: number
}

// Metricas avancadas para HR
export interface HRComplianceMetrics {
  // Compliance geral
  overallComplianceRate: number
  lastMonthComplianceRate: number
  complianceTrend: 'up' | 'down' | 'stable'
  
  // Formacoes obrigatorias
  mandatoryTrainingsTotal: number
  mandatoryTrainingsCompleted: number
  mandatoryComplianceRate: number
  
  // Certificacoes
  totalActiveCertifications: number
  expiringSoon: number // proximos 30 dias
  expiredNotRenewed: number
  renewalRate: number
  
  // Colaboradores
  totalEmployees: number
  employeesWithAllMandatory: number
  employeesNeedingAttention: number
  newEmployeesOnboarding: number
  
  // Horas de formacao
  avgHoursPerEmployee: number
  targetHoursPerEmployee: number
  hoursCompletedThisYear: number
  
  // Custos e orcamento
  budgetTotal: number
  budgetUsed: number
  budgetRemaining: number
  costPerEmployee: number
  
  // Por departamento com mais detalhes
  departmentMetrics: DepartmentComplianceDetail[]
  
  // Alertas criticos
  criticalAlerts: ComplianceAlert[]
}

export interface DepartmentComplianceDetail {
  department: string
  totalEmployees: number
  compliantEmployees: number
  complianceRate: number
  pendingMandatory: number
  expiringCerts: number
  avgTrainingHours: number
  trend: 'up' | 'down' | 'stable'
}

export interface ComplianceAlert {
  id: string
  type: 'expired_cert' | 'missing_mandatory' | 'low_compliance' | 'budget_exceeded' | 'deadline_approaching'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  affectedCount: number
  department?: string
  dueDate?: Date
  actionUrl?: string
}

export interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  gap: number
  recommendedTrainings: Training[]
}

export interface LearningPath {
  id: string
  title: string
  description: string
  targetRole: string
  trainings: Training[]
  estimatedDuration: number
  progress: number
}

export interface CalendarEvent {
  id: string
  title: string
  type: 'training' | 'certification_expiry' | 'deadline'
  start: Date
  end: Date
  color: string
  trainingId?: string
}

export interface DashboardStats {
  totalTrainings: number
  activeTrainings: number
  totalHours: number
  complianceRate: number
  certifications: number
  upcomingDeadlines: number
}
