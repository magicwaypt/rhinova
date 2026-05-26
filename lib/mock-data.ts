import type { 
  User, 
  Training, 
  Notification, 
  Department, 
  ComplianceMetrics,
  Certification,
  CalendarEvent,
  DashboardStats,
  SkillGap,
  LearningPath
} from './types'

export const currentUser: User = {
  id: '1',
  name: 'Maria Santos',
  email: 'maria.santos@empresa.pt',
  role: 'hr_manager',
  department: 'Recursos Humanos',
  avatar: '/avatars/maria.jpg',
  createdAt: new Date('2023-01-15')
}

export const users: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Joao Silva',
    email: 'joao.silva@empresa.pt',
    role: 'employee',
    department: 'Engenharia',
    createdAt: new Date('2023-03-20')
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@empresa.pt',
    role: 'employee',
    department: 'Marketing',
    createdAt: new Date('2023-06-10')
  },
  {
    id: '4',
    name: 'Pedro Ferreira',
    email: 'pedro.ferreira@empresa.pt',
    role: 'admin',
    department: 'IT',
    createdAt: new Date('2022-11-05')
  },
  {
    id: '5',
    name: 'Sofia Oliveira',
    email: 'sofia.oliveira@empresa.pt',
    role: 'employee',
    department: 'Vendas',
    createdAt: new Date('2024-01-08')
  },
]

export const trainings: Training[] = [
  {
    id: '1',
    title: 'Seguranca no Trabalho',
    description: 'Formacao obrigatoria sobre seguranca e higiene no trabalho conforme regulamentacao nacional.',
    type: 'internal',
    format: 'presencial',
    instructor: 'Dr. Carlos Mendes',
    duration: 8,
    maxParticipants: 25,
    currentParticipants: 18,
    startDate: new Date('2025-04-15'),
    endDate: new Date('2025-04-15'),
    location: 'Sala de Formacao A',
    status: 'scheduled',
    mandatory: true,
    department: undefined,
    skills: ['Seguranca', 'Compliance'],
    materials: [],
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01')
  },
  {
    id: '2',
    title: 'Lideranca e Gestao de Equipas',
    description: 'Desenvolvimento de competencias de lideranca para gestores de equipa.',
    type: 'external',
    format: 'hibrido',
    instructor: 'Leadership Academy',
    duration: 16,
    maxParticipants: 15,
    currentParticipants: 12,
    startDate: new Date('2025-04-20'),
    endDate: new Date('2025-04-21'),
    location: 'Online + Centro de Formacao',
    status: 'scheduled',
    mandatory: false,
    department: 'Todos',
    skills: ['Lideranca', 'Gestao', 'Comunicacao'],
    materials: [],
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-03-10')
  },
  {
    id: '3',
    title: 'RGPD e Protecao de Dados',
    description: 'Formacao sobre regulamento geral de protecao de dados e boas praticas.',
    type: 'internal',
    format: 'online',
    instructor: 'Dra. Helena Sousa',
    duration: 4,
    maxParticipants: 50,
    currentParticipants: 45,
    startDate: new Date('2025-04-10'),
    endDate: new Date('2025-04-10'),
    status: 'in_progress',
    mandatory: true,
    skills: ['RGPD', 'Compliance', 'Seguranca'],
    materials: [],
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-04-01')
  },
  {
    id: '4',
    title: 'Excel Avancado para Analise de Dados',
    description: 'Dominio de funcoes avancadas, tabelas dinamicas e macros no Excel.',
    type: 'external',
    format: 'online',
    instructor: 'TechSkills Portugal',
    duration: 12,
    maxParticipants: 20,
    currentParticipants: 8,
    startDate: new Date('2025-05-05'),
    endDate: new Date('2025-05-07'),
    status: 'scheduled',
    mandatory: false,
    department: 'Financas',
    skills: ['Excel', 'Analise de Dados', 'Produtividade'],
    materials: [],
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-03-20')
  },
  {
    id: '5',
    title: 'Gestao de Projetos com Metodologias Ageis',
    description: 'Introducao ao Scrum, Kanban e outras metodologias ageis para gestao de projetos.',
    type: 'internal',
    format: 'presencial',
    instructor: 'Rui Almeida',
    duration: 8,
    maxParticipants: 18,
    currentParticipants: 18,
    startDate: new Date('2025-03-25'),
    endDate: new Date('2025-03-25'),
    status: 'completed',
    mandatory: false,
    department: 'Engenharia',
    skills: ['Agile', 'Scrum', 'Gestao de Projetos'],
    materials: [],
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-03-26')
  },
]

export const notifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'training_invite',
    title: 'Nova Formacao Disponivel',
    message: 'Foi inscrito na formacao "Seguranca no Trabalho" agendada para 15 de Abril.',
    read: false,
    actionUrl: '/dashboard/trainings/1',
    createdAt: new Date('2025-04-01')
  },
  {
    id: '2',
    userId: '1',
    type: 'certification_expiring',
    title: 'Certificacao a Expirar',
    message: 'A certificacao de RGPD de Ana Costa expira em 14 dias.',
    read: false,
    actionUrl: '/dashboard/certifications',
    createdAt: new Date('2025-04-01')
  },
  {
    id: '3',
    userId: '1',
    type: 'compliance_alert',
    title: 'Alerta de Compliance',
    message: '3 colaboradores ainda nao completaram as horas minimas de formacao obrigatoria.',
    read: true,
    actionUrl: '/dashboard/compliance',
    createdAt: new Date('2025-03-28')
  },
  {
    id: '4',
    userId: '1',
    type: 'system',
    title: 'Relatorio Mensal Disponivel',
    message: 'O relatorio de formacao de Marco esta disponivel para download.',
    read: true,
    actionUrl: '/dashboard/reports',
    createdAt: new Date('2025-04-01')
  },
]

export const departments: Department[] = [
  {
    id: '1',
    name: 'Engenharia',
    managerId: '4',
    employeeCount: 25,
    trainingBudget: 15000,
    usedBudget: 8500
  },
  {
    id: '2',
    name: 'Marketing',
    managerId: '1',
    employeeCount: 12,
    trainingBudget: 8000,
    usedBudget: 4200
  },
  {
    id: '3',
    name: 'Vendas',
    managerId: '1',
    employeeCount: 18,
    trainingBudget: 10000,
    usedBudget: 6800
  },
  {
    id: '4',
    name: 'Recursos Humanos',
    managerId: '1',
    employeeCount: 8,
    trainingBudget: 6000,
    usedBudget: 3500
  },
  {
    id: '5',
    name: 'Financas',
    managerId: '1',
    employeeCount: 10,
    trainingBudget: 7000,
    usedBudget: 2100
  },
]

export const complianceMetrics: ComplianceMetrics = {
  totalEmployees: 73,
  compliantEmployees: 68,
  complianceRate: 93.2,
  pendingCertifications: 12,
  expiringCertifications: 5,
  upcomingTrainings: 8,
  completedThisMonth: 15,
  hoursThisMonth: 186
}

export const dashboardStats: DashboardStats = {
  totalTrainings: 24,
  activeTrainings: 8,
  totalHours: 2450,
  complianceRate: 93.2,
  certifications: 156,
  upcomingDeadlines: 12
}

// Certificacoes completas
export const certifications: (Certification & { 
  userName: string
  userEmail: string
  userDepartment: string
  trainingTitle: string
  trainingType: string
})[] = [
  {
    id: 'cert-001',
    userId: '2',
    userName: 'Joao Silva',
    userEmail: 'joao.silva@empresa.pt',
    userDepartment: 'Engenharia',
    trainingId: '1',
    trainingTitle: 'Seguranca no Trabalho',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-001',
    issuedAt: new Date('2024-03-15'),
    expiresAt: new Date('2025-03-15'),
    status: 'expired',
    documentUrl: '/certificates/cert-001.pdf'
  },
  {
    id: 'cert-002',
    userId: '3',
    userName: 'Ana Costa',
    userEmail: 'ana.costa@empresa.pt',
    userDepartment: 'Marketing',
    trainingId: '3',
    trainingTitle: 'RGPD e Protecao de Dados',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-015',
    issuedAt: new Date('2024-04-20'),
    expiresAt: new Date('2025-04-15'),
    status: 'expiring_soon',
    documentUrl: '/certificates/cert-002.pdf'
  },
  {
    id: 'cert-003',
    userId: '4',
    userName: 'Pedro Ferreira',
    userEmail: 'pedro.ferreira@empresa.pt',
    userDepartment: 'IT',
    trainingId: '5',
    trainingTitle: 'Ciberseguranca Avancada',
    trainingType: 'Tecnica',
    certificateNumber: 'CERT-2024-023',
    issuedAt: new Date('2024-06-10'),
    expiresAt: new Date('2026-06-10'),
    status: 'valid',
    documentUrl: '/certificates/cert-003.pdf'
  },
  {
    id: 'cert-004',
    userId: '5',
    userName: 'Sofia Oliveira',
    userEmail: 'sofia.oliveira@empresa.pt',
    userDepartment: 'Vendas',
    trainingId: '2',
    trainingTitle: 'Lideranca e Gestao de Equipas',
    trainingType: 'Soft Skills',
    certificateNumber: 'CERT-2024-031',
    issuedAt: new Date('2024-09-05'),
    expiresAt: new Date('2027-09-05'),
    status: 'valid',
    documentUrl: '/certificates/cert-004.pdf'
  },
  {
    id: 'cert-005',
    userId: '2',
    userName: 'Joao Silva',
    userEmail: 'joao.silva@empresa.pt',
    userDepartment: 'Engenharia',
    trainingId: '3',
    trainingTitle: 'RGPD e Protecao de Dados',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-042',
    issuedAt: new Date('2024-05-12'),
    expiresAt: new Date('2025-05-12'),
    status: 'expiring_soon',
    documentUrl: '/certificates/cert-005.pdf'
  },
  {
    id: 'cert-006',
    userId: '6',
    userName: 'Miguel Santos',
    userEmail: 'miguel.santos@empresa.pt',
    userDepartment: 'Engenharia',
    trainingId: '1',
    trainingTitle: 'Seguranca no Trabalho',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-055',
    issuedAt: new Date('2024-03-20'),
    expiresAt: new Date('2025-03-20'),
    status: 'expired',
    documentUrl: '/certificates/cert-006.pdf'
  },
  {
    id: 'cert-007',
    userId: '7',
    userName: 'Teresa Dias',
    userEmail: 'teresa.dias@empresa.pt',
    userDepartment: 'Financas',
    trainingId: '4',
    trainingTitle: 'Excel Avancado para Analise de Dados',
    trainingType: 'Tecnica',
    certificateNumber: 'CERT-2024-068',
    issuedAt: new Date('2024-07-15'),
    expiresAt: new Date('2027-07-15'),
    status: 'valid',
    documentUrl: '/certificates/cert-007.pdf'
  },
  {
    id: 'cert-008',
    userId: '8',
    userName: 'Bruno Lopes',
    userEmail: 'bruno.lopes@empresa.pt',
    userDepartment: 'IT',
    trainingId: '1',
    trainingTitle: 'Seguranca no Trabalho',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-079',
    issuedAt: new Date('2024-08-01'),
    expiresAt: new Date('2025-08-01'),
    status: 'valid',
    documentUrl: '/certificates/cert-008.pdf'
  },
  {
    id: 'cert-009',
    userId: '9',
    userName: 'Carla Mendes',
    userEmail: 'carla.mendes@empresa.pt',
    userDepartment: 'RH',
    trainingId: '3',
    trainingTitle: 'RGPD e Protecao de Dados',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-082',
    issuedAt: new Date('2024-04-28'),
    expiresAt: new Date('2025-04-28'),
    status: 'expiring_soon',
    documentUrl: '/certificates/cert-009.pdf'
  },
  {
    id: 'cert-010',
    userId: '10',
    userName: 'Rui Almeida',
    userEmail: 'rui.almeida@empresa.pt',
    userDepartment: 'Engenharia',
    trainingId: '5',
    trainingTitle: 'Gestao de Projetos Ageis',
    trainingType: 'Tecnica',
    certificateNumber: 'CERT-2025-001',
    issuedAt: new Date('2025-01-10'),
    expiresAt: new Date('2028-01-10'),
    status: 'valid',
    documentUrl: '/certificates/cert-010.pdf'
  },
  {
    id: 'cert-011',
    userId: '11',
    userName: 'Ines Fernandes',
    userEmail: 'ines.fernandes@empresa.pt',
    userDepartment: 'Marketing',
    trainingId: '2',
    trainingTitle: 'Comunicacao e Apresentacoes',
    trainingType: 'Soft Skills',
    certificateNumber: 'CERT-2025-008',
    issuedAt: new Date('2025-02-05'),
    expiresAt: new Date('2028-02-05'),
    status: 'valid',
    documentUrl: '/certificates/cert-011.pdf'
  },
  {
    id: 'cert-012',
    userId: '12',
    userName: 'Tiago Sousa',
    userEmail: 'tiago.sousa@empresa.pt',
    userDepartment: 'Vendas',
    trainingId: '1',
    trainingTitle: 'Seguranca no Trabalho',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-095',
    issuedAt: new Date('2024-02-28'),
    expiresAt: new Date('2025-02-28'),
    status: 'expired',
    documentUrl: '/certificates/cert-012.pdf'
  },
  {
    id: 'cert-013',
    userId: '13',
    userName: 'Patricia Rocha',
    userEmail: 'patricia.rocha@empresa.pt',
    userDepartment: 'Financas',
    trainingId: '3',
    trainingTitle: 'RGPD e Protecao de Dados',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-103',
    issuedAt: new Date('2024-05-18'),
    expiresAt: new Date('2025-05-18'),
    status: 'expiring_soon',
    documentUrl: '/certificates/cert-013.pdf'
  },
  {
    id: 'cert-014',
    userId: '14',
    userName: 'Andre Martins',
    userEmail: 'andre.martins@empresa.pt',
    userDepartment: 'IT',
    trainingId: '5',
    trainingTitle: 'AWS Cloud Fundamentals',
    trainingType: 'Tecnica',
    certificateNumber: 'CERT-2025-015',
    issuedAt: new Date('2025-03-01'),
    expiresAt: new Date('2028-03-01'),
    status: 'valid',
    documentUrl: '/certificates/cert-014.pdf'
  },
  {
    id: 'cert-015',
    userId: '15',
    userName: 'Mariana Pereira',
    userEmail: 'mariana.pereira@empresa.pt',
    userDepartment: 'Engenharia',
    trainingId: '1',
    trainingTitle: 'Seguranca no Trabalho',
    trainingType: 'Obrigatoria',
    certificateNumber: 'CERT-2024-118',
    issuedAt: new Date('2024-09-15'),
    expiresAt: new Date('2025-09-15'),
    status: 'valid',
    documentUrl: '/certificates/cert-015.pdf'
  },
  {
    id: 'cert-016',
    userId: '1',
    userName: 'Maria Santos',
    userEmail: 'maria.santos@empresa.pt',
    userDepartment: 'RH',
    trainingId: '2',
    trainingTitle: 'Gestao de Recursos Humanos',
    trainingType: 'Tecnica',
    certificateNumber: 'CERT-2024-125',
    issuedAt: new Date('2024-10-20'),
    expiresAt: new Date('2027-10-20'),
    status: 'valid',
    documentUrl: '/certificates/cert-016.pdf'
  },
]

export const calendarEvents: CalendarEvent[] = [
  // Abril 2025
  {
    id: '1',
    title: 'RGPD e Protecao de Dados',
    type: 'training',
    start: new Date('2025-04-02T09:00:00'),
    end: new Date('2025-04-02T13:00:00'),
    color: 'primary',
    trainingId: '3'
  },
  {
    id: '2',
    title: 'Seguranca no Trabalho',
    type: 'training',
    start: new Date('2025-04-08T09:00:00'),
    end: new Date('2025-04-08T17:00:00'),
    color: 'primary',
    trainingId: '1'
  },
  {
    id: '3',
    title: 'Workshop Excel Basico',
    type: 'training',
    start: new Date('2025-04-10T14:00:00'),
    end: new Date('2025-04-10T17:00:00'),
    color: 'accent'
  },
  {
    id: '4',
    title: 'Certificacao Seguranca - Miguel Santos',
    type: 'certification_expiry',
    start: new Date('2025-04-12T00:00:00'),
    end: new Date('2025-04-12T23:59:59'),
    color: 'warning'
  },
  {
    id: '5',
    title: 'Comunicacao Eficaz',
    type: 'training',
    start: new Date('2025-04-14T09:30:00'),
    end: new Date('2025-04-14T12:30:00'),
    color: 'primary'
  },
  {
    id: '6',
    title: 'Certificacao RGPD - Ana Costa',
    type: 'certification_expiry',
    start: new Date('2025-04-15T00:00:00'),
    end: new Date('2025-04-15T23:59:59'),
    color: 'warning'
  },
  {
    id: '7',
    title: 'Lideranca e Gestao de Equipas',
    type: 'training',
    start: new Date('2025-04-16T09:00:00'),
    end: new Date('2025-04-17T17:00:00'),
    color: 'primary',
    trainingId: '2'
  },
  {
    id: '8',
    title: 'Prazo Submissao Plano Formacao',
    type: 'deadline',
    start: new Date('2025-04-18T00:00:00'),
    end: new Date('2025-04-18T23:59:59'),
    color: 'destructive'
  },
  {
    id: '9',
    title: 'Onboarding Novos Colaboradores',
    type: 'training',
    start: new Date('2025-04-21T09:00:00'),
    end: new Date('2025-04-21T13:00:00'),
    color: 'accent'
  },
  {
    id: '10',
    title: 'Gestao de Tempo e Produtividade',
    type: 'training',
    start: new Date('2025-04-23T14:00:00'),
    end: new Date('2025-04-23T17:00:00'),
    color: 'primary'
  },
  {
    id: '11',
    title: 'Primeiros Socorros',
    type: 'training',
    start: new Date('2025-04-25T09:00:00'),
    end: new Date('2025-04-25T17:00:00'),
    color: 'primary'
  },
  {
    id: '12',
    title: 'Certificacao Primeiros Socorros - Teresa Dias',
    type: 'certification_expiry',
    start: new Date('2025-04-28T00:00:00'),
    end: new Date('2025-04-28T23:59:59'),
    color: 'warning'
  },
  {
    id: '13',
    title: 'Prazo Relatorio Anual',
    type: 'deadline',
    start: new Date('2025-04-30T00:00:00'),
    end: new Date('2025-04-30T23:59:59'),
    color: 'destructive'
  },
  // Maio 2025
  {
    id: '14',
    title: 'Inteligencia Emocional',
    type: 'training',
    start: new Date('2025-05-02T09:00:00'),
    end: new Date('2025-05-02T13:00:00'),
    color: 'primary'
  },
  {
    id: '15',
    title: 'Excel Avancado para Analise de Dados',
    type: 'training',
    start: new Date('2025-05-05T09:00:00'),
    end: new Date('2025-05-07T17:00:00'),
    color: 'primary',
    trainingId: '4'
  },
  {
    id: '16',
    title: 'Gestao de Projetos com Metodologias Ageis',
    type: 'training',
    start: new Date('2025-05-12T09:00:00'),
    end: new Date('2025-05-12T17:00:00'),
    color: 'primary',
    trainingId: '5'
  },
  {
    id: '17',
    title: 'Feedback e Avaliacao de Desempenho',
    type: 'training',
    start: new Date('2025-05-14T14:00:00'),
    end: new Date('2025-05-14T17:00:00'),
    color: 'accent'
  },
  {
    id: '18',
    title: 'Certificacao Excel - Joao Silva',
    type: 'certification_expiry',
    start: new Date('2025-05-15T00:00:00'),
    end: new Date('2025-05-15T23:59:59'),
    color: 'warning'
  },
  {
    id: '19',
    title: 'Ciberseguranca Basica',
    type: 'training',
    start: new Date('2025-05-19T09:00:00'),
    end: new Date('2025-05-19T13:00:00'),
    color: 'primary'
  },
  {
    id: '20',
    title: 'Negociacao e Resolucao de Conflitos',
    type: 'training',
    start: new Date('2025-05-21T09:00:00'),
    end: new Date('2025-05-21T17:00:00'),
    color: 'primary'
  },
  {
    id: '21',
    title: 'Workshop Design Thinking',
    type: 'training',
    start: new Date('2025-05-26T09:00:00'),
    end: new Date('2025-05-26T17:00:00'),
    color: 'accent'
  },
  {
    id: '22',
    title: 'Prazo Renovacao Licencas Software',
    type: 'deadline',
    start: new Date('2025-05-30T00:00:00'),
    end: new Date('2025-05-30T23:59:59'),
    color: 'destructive'
  },
  // Junho 2025
  {
    id: '23',
    title: 'Apresentacoes Eficazes',
    type: 'training',
    start: new Date('2025-06-03T14:00:00'),
    end: new Date('2025-06-03T17:00:00'),
    color: 'primary'
  },
  {
    id: '24',
    title: 'Power BI para Analise de Dados',
    type: 'training',
    start: new Date('2025-06-09T09:00:00'),
    end: new Date('2025-06-10T17:00:00'),
    color: 'primary'
  },
  {
    id: '25',
    title: 'Certificacao Lideranca - Carla Mendes',
    type: 'certification_expiry',
    start: new Date('2025-06-15T00:00:00'),
    end: new Date('2025-06-15T23:59:59'),
    color: 'warning'
  },
]

export const skillGaps: SkillGap[] = [
  {
    skill: 'Lideranca',
    currentLevel: 3,
    requiredLevel: 5,
    gap: 2,
    recommendedTrainings: [trainings[1]]
  },
  {
    skill: 'Analise de Dados',
    currentLevel: 2,
    requiredLevel: 4,
    gap: 2,
    recommendedTrainings: [trainings[3]]
  },
  {
    skill: 'Agile',
    currentLevel: 4,
    requiredLevel: 5,
    gap: 1,
    recommendedTrainings: [trainings[4]]
  },
]

export const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Junior para Senior Engineer',
    description: 'Percurso de desenvolvimento para progredir de Junior para Senior Engineer.',
    targetRole: 'Senior Engineer',
    trainings: [trainings[4], trainings[3]],
    estimatedDuration: 20,
    progress: 45
  },
  {
    id: '2',
    title: 'Especialista em Compliance',
    description: 'Formacao completa em compliance e regulamentacao.',
    targetRole: 'Compliance Officer',
    trainings: [trainings[0], trainings[2]],
    estimatedDuration: 12,
    progress: 75
  },
]

// Training participants (attendance records)
export const trainingParticipants: Record<string, {
  id: string
  name: string
  email: string
  department: string
  status: 'confirmed' | 'pending' | 'absent' | 'completed'
  signedAt?: Date
  score?: number
  certificateId?: string
}[]> = {
  '1': [
    { id: '2', name: 'Joao Silva', email: 'joao.silva@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '3', name: 'Ana Costa', email: 'ana.costa@empresa.pt', department: 'Marketing', status: 'confirmed' },
    { id: '5', name: 'Sofia Oliveira', email: 'sofia.oliveira@empresa.pt', department: 'Vendas', status: 'pending' },
    { id: '6', name: 'Miguel Santos', email: 'miguel.santos@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '7', name: 'Teresa Dias', email: 'teresa.dias@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '8', name: 'Bruno Lopes', email: 'bruno.lopes@empresa.pt', department: 'IT', status: 'pending' },
    { id: '9', name: 'Carla Mendes', email: 'carla.mendes@empresa.pt', department: 'RH', status: 'confirmed' },
    { id: '10', name: 'Rui Almeida', email: 'rui.almeida@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '11', name: 'Ines Fernandes', email: 'ines.fernandes@empresa.pt', department: 'Marketing', status: 'confirmed' },
    { id: '12', name: 'Tiago Sousa', email: 'tiago.sousa@empresa.pt', department: 'Vendas', status: 'pending' },
    { id: '13', name: 'Patricia Rocha', email: 'patricia.rocha@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '14', name: 'Andre Martins', email: 'andre.martins@empresa.pt', department: 'IT', status: 'confirmed' },
    { id: '15', name: 'Mariana Pereira', email: 'mariana.pereira@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '16', name: 'Luis Gomes', email: 'luis.gomes@empresa.pt', department: 'Vendas', status: 'confirmed' },
    { id: '17', name: 'Rita Teixeira', email: 'rita.teixeira@empresa.pt', department: 'Marketing', status: 'confirmed' },
    { id: '18', name: 'Nuno Correia', email: 'nuno.correia@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '19', name: 'Catarina Lima', email: 'catarina.lima@empresa.pt', department: 'RH', status: 'confirmed' },
    { id: '20', name: 'Hugo Cardoso', email: 'hugo.cardoso@empresa.pt', department: 'IT', status: 'confirmed' },
  ],
  '2': [
    { id: '2', name: 'Joao Silva', email: 'joao.silva@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '3', name: 'Ana Costa', email: 'ana.costa@empresa.pt', department: 'Marketing', status: 'confirmed' },
    { id: '6', name: 'Miguel Santos', email: 'miguel.santos@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '7', name: 'Teresa Dias', email: 'teresa.dias@empresa.pt', department: 'Financas', status: 'pending' },
    { id: '9', name: 'Carla Mendes', email: 'carla.mendes@empresa.pt', department: 'RH', status: 'confirmed' },
    { id: '10', name: 'Rui Almeida', email: 'rui.almeida@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '11', name: 'Ines Fernandes', email: 'ines.fernandes@empresa.pt', department: 'Marketing', status: 'confirmed' },
    { id: '13', name: 'Patricia Rocha', email: 'patricia.rocha@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '14', name: 'Andre Martins', email: 'andre.martins@empresa.pt', department: 'IT', status: 'confirmed' },
    { id: '15', name: 'Mariana Pereira', email: 'mariana.pereira@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '18', name: 'Nuno Correia', email: 'nuno.correia@empresa.pt', department: 'Engenharia', status: 'pending' },
    { id: '19', name: 'Catarina Lima', email: 'catarina.lima@empresa.pt', department: 'RH', status: 'confirmed' },
  ],
  '3': [
    { id: '2', name: 'Joao Silva', email: 'joao.silva@empresa.pt', department: 'Engenharia', status: 'confirmed' },
    { id: '3', name: 'Ana Costa', email: 'ana.costa@empresa.pt', department: 'Marketing', status: 'confirmed' },
    { id: '5', name: 'Sofia Oliveira', email: 'sofia.oliveira@empresa.pt', department: 'Vendas', status: 'confirmed' },
  ],
  '4': [
    { id: '7', name: 'Teresa Dias', email: 'teresa.dias@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '13', name: 'Patricia Rocha', email: 'patricia.rocha@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '21', name: 'Vasco Ribeiro', email: 'vasco.ribeiro@empresa.pt', department: 'Financas', status: 'pending' },
    { id: '22', name: 'Marta Cruz', email: 'marta.cruz@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '23', name: 'Filipe Monteiro', email: 'filipe.monteiro@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '24', name: 'Sara Pinto', email: 'sara.pinto@empresa.pt', department: 'Financas', status: 'pending' },
    { id: '25', name: 'Ricardo Neves', email: 'ricardo.neves@empresa.pt', department: 'Financas', status: 'confirmed' },
    { id: '26', name: 'Leonor Campos', email: 'leonor.campos@empresa.pt', department: 'Financas', status: 'confirmed' },
  ],
  '5': [
    { id: '2', name: 'Joao Silva', email: 'joao.silva@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T17:30:00'), score: 92, certificateId: 'CERT-2025-001' },
    { id: '6', name: 'Miguel Santos', email: 'miguel.santos@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T17:25:00'), score: 88, certificateId: 'CERT-2025-002' },
    { id: '10', name: 'Rui Almeida', email: 'rui.almeida@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T17:20:00'), score: 95, certificateId: 'CERT-2025-003' },
    { id: '14', name: 'Andre Martins', email: 'andre.martins@empresa.pt', department: 'IT', status: 'completed', signedAt: new Date('2025-03-25T17:15:00'), score: 90, certificateId: 'CERT-2025-004' },
    { id: '15', name: 'Mariana Pereira', email: 'mariana.pereira@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T17:10:00'), score: 87, certificateId: 'CERT-2025-005' },
    { id: '18', name: 'Nuno Correia', email: 'nuno.correia@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T17:05:00'), score: 91, certificateId: 'CERT-2025-006' },
    { id: '20', name: 'Hugo Cardoso', email: 'hugo.cardoso@empresa.pt', department: 'IT', status: 'completed', signedAt: new Date('2025-03-25T17:00:00'), score: 89, certificateId: 'CERT-2025-007' },
    { id: '27', name: 'Diana Faria', email: 'diana.faria@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:55:00'), score: 94, certificateId: 'CERT-2025-008' },
    { id: '28', name: 'Gonalo Reis', email: 'goncalo.reis@empresa.pt', department: 'IT', status: 'absent' },
    { id: '29', name: 'Beatriz Cunha', email: 'beatriz.cunha@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:50:00'), score: 86, certificateId: 'CERT-2025-009' },
    { id: '30', name: 'Paulo Moreira', email: 'paulo.moreira@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:45:00'), score: 93, certificateId: 'CERT-2025-010' },
    { id: '31', name: 'Joana Barbosa', email: 'joana.barbosa@empresa.pt', department: 'IT', status: 'completed', signedAt: new Date('2025-03-25T16:40:00'), score: 88, certificateId: 'CERT-2025-011' },
    { id: '32', name: 'Marco Vieira', email: 'marco.vieira@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:35:00'), score: 90, certificateId: 'CERT-2025-012' },
    { id: '33', name: 'Celia Azevedo', email: 'celia.azevedo@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:30:00'), score: 85, certificateId: 'CERT-2025-013' },
    { id: '34', name: 'Alexandre Matos', email: 'alexandre.matos@empresa.pt', department: 'IT', status: 'completed', signedAt: new Date('2025-03-25T16:25:00'), score: 91, certificateId: 'CERT-2025-014' },
    { id: '35', name: 'Sandra Pires', email: 'sandra.pires@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:20:00'), score: 89, certificateId: 'CERT-2025-015' },
    { id: '36', name: 'Fabio Carvalho', email: 'fabio.carvalho@empresa.pt', department: 'Engenharia', status: 'completed', signedAt: new Date('2025-03-25T16:15:00'), score: 92, certificateId: 'CERT-2025-016' },
    { id: '37', name: 'Vera Nogueira', email: 'vera.nogueira@empresa.pt', department: 'IT', status: 'completed', signedAt: new Date('2025-03-25T16:10:00'), score: 87, certificateId: 'CERT-2025-017' },
  ]
}

// Chart data for analytics
export const trainingTrendData = [
  { month: 'Jan', completed: 12, scheduled: 8 },
  { month: 'Fev', completed: 15, scheduled: 10 },
  { month: 'Mar', completed: 18, scheduled: 12 },
  { month: 'Abr', completed: 8, scheduled: 15 },
  { month: 'Mai', completed: 0, scheduled: 10 },
  { month: 'Jun', completed: 0, scheduled: 8 },
]

export const complianceByDepartment = [
  { department: 'Engenharia', rate: 96 },
  { department: 'Marketing', rate: 92 },
  { department: 'Vendas', rate: 88 },
  { department: 'RH', rate: 100 },
  { department: 'Financas', rate: 95 },
]

// Metricas avancadas para HR
import type { HRComplianceMetrics, DepartmentComplianceDetail, ComplianceAlert } from './types'

export const hrComplianceMetrics: HRComplianceMetrics = {
  // Compliance geral
  overallComplianceRate: 93.2,
  lastMonthComplianceRate: 91.1,
  complianceTrend: 'up',
  
  // Formacoes obrigatorias
  mandatoryTrainingsTotal: 5,
  mandatoryTrainingsCompleted: 4,
  mandatoryComplianceRate: 89.5,
  
  // Certificacoes
  totalActiveCertifications: 156,
  expiringSoon: 12, // proximos 30 dias
  expiredNotRenewed: 3,
  renewalRate: 94.2,
  
  // Colaboradores
  totalEmployees: 73,
  employeesWithAllMandatory: 68,
  employeesNeedingAttention: 8,
  newEmployeesOnboarding: 4,
  
  // Horas de formacao
  avgHoursPerEmployee: 33.6,
  targetHoursPerEmployee: 40,
  hoursCompletedThisYear: 2450,
  
  // Custos e orcamento
  budgetTotal: 85000,
  budgetUsed: 52300,
  budgetRemaining: 32700,
  costPerEmployee: 716,
  
  // Por departamento com mais detalhes
  departmentMetrics: [
    { 
      department: 'Engenharia', 
      totalEmployees: 18, 
      compliantEmployees: 17, 
      complianceRate: 96,
      pendingMandatory: 2,
      expiringCerts: 3,
      avgTrainingHours: 38,
      trend: 'up'
    },
    { 
      department: 'Marketing', 
      totalEmployees: 12, 
      compliantEmployees: 11, 
      complianceRate: 92,
      pendingMandatory: 1,
      expiringCerts: 2,
      avgTrainingHours: 32,
      trend: 'stable'
    },
    { 
      department: 'Vendas', 
      totalEmployees: 15, 
      compliantEmployees: 13, 
      complianceRate: 88,
      pendingMandatory: 4,
      expiringCerts: 3,
      avgTrainingHours: 28,
      trend: 'down'
    },
    { 
      department: 'RH', 
      totalEmployees: 5, 
      compliantEmployees: 5, 
      complianceRate: 100,
      pendingMandatory: 0,
      expiringCerts: 1,
      avgTrainingHours: 42,
      trend: 'stable'
    },
    { 
      department: 'Financas', 
      totalEmployees: 10, 
      compliantEmployees: 9, 
      complianceRate: 95,
      pendingMandatory: 1,
      expiringCerts: 2,
      avgTrainingHours: 35,
      trend: 'up'
    },
    { 
      department: 'IT', 
      totalEmployees: 13, 
      compliantEmployees: 13, 
      complianceRate: 100,
      pendingMandatory: 0,
      expiringCerts: 1,
      avgTrainingHours: 45,
      trend: 'up'
    },
  ],
  
  // Alertas criticos
  criticalAlerts: [
    {
      id: '1',
      type: 'expired_cert',
      severity: 'critical',
      title: '3 certificacoes expiradas',
      description: 'Colaboradores com certificacoes obrigatorias expiradas que necessitam renovacao imediata',
      affectedCount: 3,
      actionUrl: '/dashboard/certifications?status=expired'
    },
    {
      id: '2',
      type: 'low_compliance',
      severity: 'warning',
      title: 'Vendas abaixo do target',
      description: 'Departamento de Vendas com taxa de compliance de 88%, abaixo do minimo de 90%',
      affectedCount: 2,
      department: 'Vendas',
      actionUrl: '/dashboard/analytics?department=vendas'
    },
    {
      id: '3',
      type: 'deadline_approaching',
      severity: 'warning',
      title: '12 certificacoes a expirar',
      description: 'Certificacoes que expiram nos proximos 30 dias e necessitam agendamento de renovacao',
      affectedCount: 12,
      dueDate: new Date('2025-05-02'),
      actionUrl: '/dashboard/certifications?status=expiring'
    },
    {
      id: '4',
      type: 'missing_mandatory',
      severity: 'warning',
      title: '5 colaboradores sem RGPD',
      description: 'Formacao obrigatoria de RGPD pendente para colaboradores',
      affectedCount: 5,
      actionUrl: '/dashboard/trainings/3'
    },
    {
      id: '5',
      type: 'budget_exceeded',
      severity: 'info',
      title: 'Orcamento 61% utilizado',
      description: 'Ja foi utilizado 61% do orcamento anual de formacao. Restam 32.700EUR',
      affectedCount: 0,
      actionUrl: '/dashboard/settings?tab=billing'
    },
  ]
}

export const trainingByFormat = [
  { name: 'Presencial', value: 35, fill: 'var(--chart-1)' },
  { name: 'Online', value: 45, fill: 'var(--chart-2)' },
  { name: 'Hibrido', value: 20, fill: 'var(--chart-3)' },
]

export const hoursPerEmployee = [
  { name: 'Joao Silva', hours: 24, target: 40 },
  { name: 'Ana Costa', hours: 38, target: 40 },
  { name: 'Pedro Ferreira', hours: 42, target: 40 },
  { name: 'Sofia Oliveira', hours: 16, target: 40 },
  { name: 'Rui Santos', hours: 35, target: 40 },
]
