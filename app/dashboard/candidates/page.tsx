"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  Mail, 
  Phone,
  MoreHorizontal,
  Eye,
  Star,
  StarOff,
  UserPlus,
  FileText,
  Linkedin,
  Calendar,
  Users,
  UserCheck,
  Clock,
  Sparkles
} from "lucide-react"

const candidates = [
  {
    id: 1,
    name: "Ricardo Neves",
    email: "ricardo.neves@email.com",
    phone: "+351 912 345 678",
    currentRole: "Senior Software Engineer",
    currentCompany: "Tech Company XYZ",
    location: "Lisboa, Portugal",
    experience: "8 anos",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    status: "in_process",
    source: "LinkedIn",
    aiScore: 92,
    starred: true,
    appliedFor: "Senior Software Engineer",
    lastContact: "2025-05-20",
    stage: "Entrevista Técnica"
  },
  {
    id: 2,
    name: "Carla Mendes",
    email: "carla.mendes@email.com",
    phone: "+351 923 456 789",
    currentRole: "Marketing Director",
    currentCompany: "Global Marketing Inc",
    location: "Porto, Portugal",
    experience: "12 anos",
    skills: ["Digital Marketing", "Brand Strategy", "Team Leadership"],
    status: "in_process",
    source: "Referral",
    aiScore: 88,
    starred: true,
    appliedFor: "Marketing Manager",
    lastContact: "2025-05-18",
    stage: "Entrevista Final"
  },
  {
    id: 3,
    name: "Bruno Costa",
    email: "bruno.costa@email.com",
    phone: "+351 934 567 890",
    currentRole: "CFO",
    currentCompany: "Startup ABC",
    location: "Lisboa, Portugal",
    experience: "15 anos",
    skills: ["Financial Planning", "M&A", "IPO", "Strategy"],
    status: "new",
    source: "Executive Search",
    aiScore: 95,
    starred: false,
    appliedFor: "CFO - Chief Financial Officer",
    lastContact: "2025-05-22",
    stage: "Novo"
  },
  {
    id: 4,
    name: "Ana Ferreira",
    email: "ana.ferreira@email.com",
    phone: "+351 945 678 901",
    currentRole: "UX Lead",
    currentCompany: "Design Studio",
    location: "Remoto",
    experience: "6 anos",
    skills: ["Figma", "User Research", "Design Systems", "Prototyping"],
    status: "pool",
    source: "Portfolio",
    aiScore: 78,
    starred: false,
    appliedFor: null,
    lastContact: "2025-04-10",
    stage: "Talent Pool"
  },
  {
    id: 5,
    name: "Miguel Santos",
    email: "miguel.santos@email.com",
    phone: "+351 956 789 012",
    currentRole: "Sales Director",
    currentCompany: "Enterprise Solutions",
    location: "Lisboa, Portugal",
    experience: "10 anos",
    skills: ["B2B Sales", "Team Management", "Negotiation", "CRM"],
    status: "in_process",
    source: "LinkedIn",
    aiScore: 85,
    starred: true,
    appliedFor: "Sales Director",
    lastContact: "2025-05-21",
    stage: "Proposta"
  },
]

const stats = [
  { 
    label: "Total Candidatos", 
    value: 245, 
    icon: Users, 
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  { 
    label: "Em Processo", 
    value: 38, 
    icon: Clock, 
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  { 
    label: "Talent Pool", 
    value: 189, 
    icon: UserPlus, 
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  { 
    label: "Contratados (ano)", 
    value: 18, 
    icon: UserCheck, 
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Novo</Badge>
    case "in_process":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Em Processo</Badge>
    case "pool":
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Talent Pool</Badge>
    case "hired":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Contratado</Badge>
    case "rejected":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Rejeitado</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case "LinkedIn":
      return <Linkedin className="w-4 h-4 text-blue-600" />
    case "Referral":
      return <Users className="w-4 h-4 text-green-600" />
    case "Executive Search":
      return <Search className="w-4 h-4 text-purple-600" />
    default:
      return <FileText className="w-4 h-4 text-gray-600" />
  }
}

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    const matchesSource = sourceFilter === "all" || candidate.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

  const sources = [...new Set(candidates.map(c => c.source))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidatos</h1>
          <p className="text-muted-foreground">Base de dados de talentos e candidatos em processo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Sourcing
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Candidato
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome, função ou skills..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="in_process">Em Processo</SelectItem>
                <SelectItem value="pool">Talent Pool</SelectItem>
                <SelectItem value="hired">Contratados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                          {candidate.starred && (
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          )}
                          {getStatusBadge(candidate.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {candidate.currentRole} @ {candidate.currentCompany}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {candidate.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        {getSourceIcon(candidate.source)}
                        {candidate.source}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{candidate.skills.length - 4}
                        </Badge>
                      )}
                    </div>

                    {candidate.appliedFor && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Candidatura: </span>
                        <span className="font-medium text-foreground">{candidate.appliedFor}</span>
                        <span className="text-muted-foreground ml-2">• {candidate.stage}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Score & Actions */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{candidate.aiScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">AI Match Score</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="w-4 h-4" />
                      Ver Perfil
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="w-4 h-4 mr-2" />
                          Agendar Entrevista
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {candidate.starred ? (
                            <>
                              <StarOff className="w-4 h-4 mr-2" />
                              Remover Favorito
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Adicionar Favorito
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Ver CV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
