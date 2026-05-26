"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Clock, 
  Users, 
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Briefcase,
  TrendingUp,
  UserCheck,
  Pause
} from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engenharia",
    location: "Lisboa, Portugal",
    type: "Full-time",
    status: "active",
    candidates: 45,
    newCandidates: 8,
    createdAt: "2025-05-01",
    salary: "55.000€ - 75.000€",
    priority: "high",
    hiringManager: "João Silva",
  },
  {
    id: 2,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Porto, Portugal",
    type: "Full-time",
    status: "active",
    candidates: 23,
    newCandidates: 3,
    createdAt: "2025-05-10",
    salary: "45.000€ - 60.000€",
    priority: "medium",
    hiringManager: "Ana Costa",
  },
  {
    id: 3,
    title: "CFO - Chief Financial Officer",
    department: "Executivo",
    location: "Lisboa, Portugal",
    type: "Full-time",
    status: "active",
    candidates: 12,
    newCandidates: 2,
    createdAt: "2025-04-20",
    salary: "120.000€ - 180.000€",
    priority: "high",
    hiringManager: "Pedro Ferreira",
  },
  {
    id: 4,
    title: "UX Designer",
    department: "Design",
    location: "Remoto",
    type: "Full-time",
    status: "paused",
    candidates: 34,
    newCandidates: 0,
    createdAt: "2025-04-15",
    salary: "35.000€ - 50.000€",
    priority: "low",
    hiringManager: "Sofia Oliveira",
  },
  {
    id: 5,
    title: "Sales Director",
    department: "Vendas",
    location: "Lisboa, Portugal",
    type: "Full-time",
    status: "active",
    candidates: 18,
    newCandidates: 5,
    createdAt: "2025-05-15",
    salary: "70.000€ - 100.000€",
    priority: "high",
    hiringManager: "Miguel Santos",
  },
]

const stats = [
  { 
    label: "Vagas Ativas", 
    value: 4, 
    icon: Briefcase, 
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  { 
    label: "Total Candidatos", 
    value: 132, 
    icon: Users, 
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  { 
    label: "Em Processo", 
    value: 28, 
    icon: TrendingUp, 
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  { 
    label: "Contratados (mês)", 
    value: 3, 
    icon: UserCheck, 
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge>
    case "paused":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pausada</Badge>
    case "closed":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Fechada</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="outline" className="border-red-300 text-red-600">Urgente</Badge>
    case "medium":
      return <Badge variant="outline" className="border-amber-300 text-amber-600">Média</Badge>
    case "low":
      return <Badge variant="outline" className="border-gray-300 text-gray-600">Normal</Badge>
    default:
      return null
  }
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = [...new Set(jobs.map(job => job.department))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vagas</h1>
          <p className="text-muted-foreground">Gestão de posições e processos de recrutamento</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Vaga
        </Button>
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
                placeholder="Pesquisar vagas..."
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
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="closed">Fechadas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Job Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        {getStatusBadge(job.status)}
                        {getPriorityBadge(job.priority)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Salário: <span className="text-foreground font-medium">{job.salary}</span></span>
                    <span className="text-muted-foreground">Hiring Manager: 
                      <span className="text-foreground font-medium ml-1">{job.hiringManager}</span>
                    </span>
                  </div>
                </div>

                {/* Candidates & Actions */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-2xl font-bold text-foreground">{job.candidates}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">candidatos</p>
                    {job.newCandidates > 0 && (
                      <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        +{job.newCandidates} novos
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="w-4 h-4" />
                      Ver Pipeline
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Archive className="w-4 h-4 mr-2" />
                          Arquivar
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
