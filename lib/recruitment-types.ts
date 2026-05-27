// ========================================
// AI TALENT INTELLIGENCE PLATFORM - TYPES
// ========================================

// Candidate Intelligence Types
export interface CandidateProfile {
  id: string
  name: string
  email: string
  phone?: string
  currentRole: string
  currentCompany: string
  location: string
  yearsExperience: number
  skills: Skill[]
  experience: WorkExperience[]
  education: Education[]
  languages: Language[]
  linkedinUrl?: string
  portfolioUrl?: string
  cvUrl?: string
  source: CandidateSource
  status: CandidateStatus
  aiScore: number
  aiAnalysis?: AIAnalysis
  scorecards: Scorecard[]
  notes: RecruiterNote[]
  interactions: Interaction[]
  tags: string[]
  starred: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsExperience?: number
  verified: boolean
  endorsements?: number
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  description: string
  achievements: string[]
  companyType: 'startup' | 'scaleup' | 'corporate' | 'agency' | 'other'
  companySize?: string
  industry: string
  location: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: Date
  endDate?: Date
  grade?: string
  activities?: string[]
}

export interface Language {
  name: string
  level: 'basic' | 'conversational' | 'professional' | 'fluent' | 'native'
}

export type CandidateSource = 
  | 'linkedin'
  | 'referral'
  | 'executive_search'
  | 'job_board'
  | 'direct_application'
  | 'talent_pool'
  | 'ai_sourcing'
  | 'event'
  | 'other'

export type CandidateStatus = 
  | 'new'
  | 'contacted'
  | 'screening'
  | 'interview_scheduled'
  | 'in_process'
  | 'offer_pending'
  | 'hired'
  | 'rejected'
  | 'withdrawn'
  | 'talent_pool'

// AI Analysis Types
export interface AIAnalysis {
  id: string
  candidateId: string
  generatedAt: Date
  summary: string
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'executive' | 'c-level'
  specializations: string[]
  strengths: AnalysisPoint[]
  gaps: AnalysisPoint[]
  riskSignals: RiskSignal[]
  culturalFitIndicators: CulturalFitIndicator[]
  careerTrajectory: 'ascending' | 'stable' | 'transitioning' | 'declining'
  marketValue: 'below' | 'market' | 'above' | 'premium'
  recommendations: string[]
  similarProfiles: string[] // IDs of similar candidates
  matchScores: JobMatchScore[]
}

export interface AnalysisPoint {
  category: string
  description: string
  evidence: string[]
  confidence: number // 0-100
}

export interface RiskSignal {
  type: 'tenure' | 'gap' | 'downgrade' | 'frequency' | 'inconsistency' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high'
  details?: string
}

export interface CulturalFitIndicator {
  dimension: string
  score: number // 0-100
  indicators: string[]
}

export interface JobMatchScore {
  jobId: string
  jobTitle: string
  score: number
  matchedCriteria: string[]
  missingCriteria: string[]
}

// Scorecard Types
export interface Scorecard {
  id: string
  candidateId: string
  jobId?: string
  evaluatorId: string
  evaluatorName: string
  createdAt: Date
  overallScore: number
  criteria: ScorecardCriteria[]
  recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire' | 'strong_no_hire'
  notes: string
  isAIGenerated: boolean
}

export interface ScorecardCriteria {
  name: string
  score: number // 1-5
  weight: number // percentage
  notes?: string
}

// Recruiter Interactions
export interface RecruiterNote {
  id: string
visibleTo: 'all' | 'team' | 'private'
  authorId: string
  authorName: string
  content: string
  createdAt: Date
  updatedAt?: Date
  mentions: string[]
  attachments?: string[]
}

export interface Interaction {
  id: string
  candidateId: string
  type: 'email' | 'call' | 'linkedin' | 'meeting' | 'interview' | 'note' | 'status_change'
  direction: 'inbound' | 'outbound' | 'internal'
  subject?: string
  content: string
  outcome?: 'positive' | 'neutral' | 'negative'
  nextAction?: string
  performedBy: string
  performedAt: Date
}

// Job/Position Types
export interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: 'full_time' | 'part_time' | 'contract' | 'interim'
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'director' | 'executive' | 'c_level'
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: JobRequirement[]
  niceToHave: string[]
  benefits: string[]
  companyDescription?: string
  hiringManager: {
    id: string
    name: string
    email: string
  }
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  targetCompanies?: string[]
  excludedCompanies?: string[]
  candidates: string[] // Candidate IDs
  pipeline: PipelineStage[]
  aiSourcingEnabled: boolean
  sourcingStrategy?: SourcingStrategy
  createdAt: Date
  updatedAt: Date
  deadline?: Date
}

export interface JobRequirement {
  type: 'skill' | 'experience' | 'education' | 'certification' | 'language' | 'other'
  description: string
  mandatory: boolean
  minYears?: number
}

export interface PipelineStage {
  id: string
  name: string
  order: number
  type: 'sourcing' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected'
  candidateIds: string[]
  avgDaysInStage?: number
}

// Sourcing Strategy Types
export interface SourcingStrategy {
  id: string
  jobId: string
  targetProfiles: TargetProfile[]
  booleanSearches: BooleanSearch[]
  targetCompanies: TargetCompany[]
  equivalentTitles: string[]
  industryFocus: string[]
  geographyFocus: string[]
  seniorityRange: string[]
  aiRecommendations: AIRecommendation[]
  generatedAt: Date
}

export interface TargetProfile {
  description: string
  traits: string[]
  mustHave: string[]
  niceToHave: string[]
  dealBreakers: string[]
}

export interface BooleanSearch {
  platform: 'linkedin' | 'xing' | 'github' | 'general'
  query: string
  explanation: string
  expectedResults: number
}

export interface TargetCompany {
  name: string
  reason: string
  relevantRoles: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface AIRecommendation {
  type: 'title' | 'company' | 'skill' | 'geography' | 'strategy'
  suggestion: string
  reasoning: string
  confidence: number
}

// Outreach Types
export interface OutreachCampaign {
  id: string
  name: string
  jobId?: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  type: 'cold' | 'warm' | 'referral' | 'nurture'
  templates: OutreachTemplate[]
  recipients: OutreachRecipient[]
  stats: CampaignStats
  createdAt: Date
  updatedAt: Date
}

export interface OutreachTemplate {
  id: string
  name: string
  channel: 'email' | 'linkedin' | 'inmail'
  subject?: string
  content: string
  variables: string[]
  sequence: number
  delayDays: number
  isAIGenerated: boolean
}

export interface OutreachRecipient {
  candidateId: string
  candidateName: string
  currentStage: number
  status: 'pending' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed'
  sentAt?: Date
  openedAt?: Date
  repliedAt?: Date
  response?: 'interested' | 'not_interested' | 'maybe_later' | 'referred'
}

export interface CampaignStats {
  totalSent: number
  opened: number
  openRate: number
  clicked: number
  clickRate: number
  replied: number
  replyRate: number
  interested: number
  interestRate: number
}

// Market Intelligence Types
export interface MarketIntelligence {
  id: string
  type: 'funding' | 'layoff' | 'expansion' | 'acquisition' | 'leadership_change' | 'hiring_surge'
  company: string
  headline: string
  description: string
  source: string
  sourceUrl?: string
  date: Date
  relevantFor: string[] // Job IDs or general tags
  talentOpportunity?: string
  affectedRoles?: string[]
  estimatedImpact?: 'low' | 'medium' | 'high'
}

export interface CompanyProfile {
  id: string
  name: string
  industry: string
  size: string
  headquarters: string
  description: string
  linkedinUrl?: string
  websiteUrl?: string
  fundingStage?: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'late_stage' | 'public' | 'private'
  totalFunding?: number
  lastFundingDate?: Date
  keyPeople: KeyPerson[]
  recentNews: MarketIntelligence[]
  hiringTrends: HiringTrend[]
  talentPoolSize?: number
  competitorOf?: string[]
}

export interface KeyPerson {
  name: string
  role: string
  linkedinUrl?: string
  tenure?: string
  background?: string
}

export interface HiringTrend {
  role: string
  trend: 'increasing' | 'stable' | 'decreasing'
  openPositions: number
  avgTimeToFill?: number
}

// Talent Database Types
export interface TalentPool {
  id: string
  name: string
  description: string
  criteria: TalentPoolCriteria
  candidateIds: string[]
  isSmartPool: boolean
  autoUpdate: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TalentPoolCriteria {
  skills?: string[]
  roles?: string[]
  companies?: string[]
  industries?: string[]
  locations?: string[]
  seniorityLevels?: string[]
  minExperience?: number
  maxExperience?: number
  sources?: CandidateSource[]
  tags?: string[]
  customFilters?: CustomFilter[]
}

export interface CustomFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: string | number | string[]
}

// Semantic Search Types
export interface SemanticSearchQuery {
  id: string
  query: string
  interpretation: string
  extractedEntities: ExtractedEntity[]
  results: SearchResult[]
  totalResults: number
  searchedAt: Date
  savedAs?: string
}

export interface ExtractedEntity {
  type: 'role' | 'skill' | 'company' | 'industry' | 'location' | 'experience' | 'education'
  value: string
  confidence: number
}

export interface SearchResult {
  candidateId: string
  candidateName: string
  currentRole: string
  currentCompany: string
  matchScore: number
  matchReasons: string[]
  highlights: SearchHighlight[]
}

export interface SearchHighlight {
  field: string
  content: string
  matchedTerms: string[]
}

// Analytics Types
export interface RecruitmentAnalytics {
  period: 'week' | 'month' | 'quarter' | 'year'
  startDate: Date
  endDate: Date
  overview: AnalyticsOverview
  sourcing: SourcingAnalytics
  pipeline: PipelineAnalytics
  outreach: OutreachAnalytics
  aiPerformance: AIPerformanceMetrics
}

export interface AnalyticsOverview {
  totalCandidates: number
  newCandidates: number
  candidatesInProcess: number
  hired: number
  rejected: number
  timeToHire: number
  offerAcceptanceRate: number
  costPerHire: number
}

export interface SourcingAnalytics {
  bySource: { source: string; count: number; hiredCount: number; conversionRate: number }[]
  byChannel: { channel: string; count: number; responseRate: number }[]
  topPerformingSearches: { query: string; resultsFound: number; hired: number }[]
  aiSourcingEfficiency: number
}

export interface PipelineAnalytics {
  byStage: { stage: string; count: number; avgDays: number; dropoffRate: number }[]
  bottlenecks: { stage: string; issue: string; recommendation: string }[]
  velocity: number
  healthScore: number
}

export interface OutreachAnalytics {
  totalSent: number
  avgOpenRate: number
  avgReplyRate: number
  avgInterestRate: number
  bestPerformingTemplates: { templateId: string; name: string; replyRate: number }[]
  optimalSendTimes: { dayOfWeek: string; hour: number; performance: number }[]
}

export interface AIPerformanceMetrics {
  candidatesAnalyzed: number
  avgAnalysisAccuracy: number
  searchesPerformed: number
  avgSearchRelevance: number
  outreachGenerated: number
  avgOutreachPerformance: number
  timeSaved: number // hours
  costSavings: number
}
