"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  MoreHorizontal,
  Eye,
  Mail,
  Calendar,
  Phone,
  ChevronRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter
} from "lucide-react"

const jobs = [
  { id: 1, title: "Senior Software Engineer", department: "Engenharia" },
  { id: 2, title: "Marketing Manager", department: "Marketing" },
  { id: 3, title: "CFO - Chief Financial Officer", department: "Executivo" },
  { id: 5, title: "Sales Director", department: "Vendas" },
]

const stages = [
  { id: "applied", name: "Candidatura", color: "bg-gray-100 text-gray-700" },
  { id: "screening", name: "Triagem", color: "bg-blue-100 text-blue-700" },
  { id: "interview_hr", name: "Entrevista RH", color: "bg-purple-100 text-purple-700" },
  { id: "interview_tech", name: "Entrevista Técnica", color: "bg-amber-100 text-amber-700" },
  { id: "interview_final", name: "Entrevista Final", color: "bg-orange-100 text-orange-700" },
  { id: "offer", name: "Proposta", color: "bg-emerald-100 text-emerald-700" },
  { id: "hired", name: "Contratado", color: "bg-green-100 text-green-700" },
]

const candidatesByStage: Record<string, Array<{
  id: number
  name: string
  role: string
  aiScore: number
  daysInStage: number
  interviewDate?: string
}>> = {
  applied: [
    { id: 1, name: "Bruno Costa", role: "CFO", aiScore: 95, daysInStage: 1 },
    { id: 2, name: "João Almeida", role: "Senior Software Engineer", aiScore: 78, daysInStage: 2 },
  ],
  screening: [
    { id: 3, name: "Maria Silva", role: "Senior Software Engineer", aiScore: 85, daysInStage: 3 },
    { id: 4, name: "Pedro Martins", role: "Marketing Manager", aiScore: 72, daysInStage: 1 },
    { id: 5, name: "Ana Rodrigues", role: "Sales Director", aiScore: 88, daysInStage: 2 },
  ],
  interview_hr: [
    { id: 6, name: "Sofia Lima", role: "Senior Software Engineer", aiScore: 90, daysInStage: 2, interviewDate: "28/05/2025" },
    { id: 7, name: "Tiago Ferreira", role: "Marketing Manager", aiScore: 82, daysInStage: 4 },
  ],
  interview_tech: [
    { id: 8, name: "Ricardo Neves", role: "Senior Software Engineer", aiScore: 92, daysInStage: 1, interviewDate: "29/05/2025" },
  ],
  interview_final: [
    { id: 9, name: "Carla Mendes", role: "Marketing Manager", aiScore: 88, daysInStage: 3, interviewDate: "27/05/2025" },
  ],
  offer: [
    { id: 10, name: "Miguel Santos", role: "Sales Director", aiScore: 85, daysInStage: 5 },
  ],
  hired: [],
}

export default function PipelinePage() {
  const [selectedJob, setSelectedJob] = useState("all")

  const totalCandidates = Object.values(candidatesByStage).flat().length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline de Recrutamento</h1>
          <p className="text-muted-foreground">Visualização Kanban do processo de recrutamento</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por vaga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Vagas ({totalCandidates} candidatos)</SelectItem>
              {jobs.map(job => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-7 gap-2">
        {stages.map((stage) => {
          const count = candidatesByStage[stage.id]?.length || 0
          return (
            <Card key={stage.id} className="border-border/50">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground truncate">{stage.name}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-72">
            <Card className="border-border/50 h-full">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={stage.color}>
                    {stage.name}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    {candidatesByStage[stage.id]?.length || 0}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-2 min-h-96">
                {candidatesByStage[stage.id]?.map((candidate) => (
                  <Card 
                    key={candidate.id} 
                    className="border-border/50 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {candidate.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {candidate.role}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span className="text-xs font-medium">{candidate.aiScore}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{candidate.daysInStage}d</span>
                            </div>
                          </div>

                          {candidate.interviewDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                              <Calendar className="w-3 h-3" />
                              <span>{candidate.interviewDate}</span>
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Mover para Próxima Fase
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              Agendar Entrevista
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Enviar Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Ligar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="w-4 h-4 mr-2" />
                              Rejeitar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!candidatesByStage[stage.id] || candidatesByStage[stage.id].length === 0) && (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                    Sem candidatos
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start gap-2">
              <Calendar className="w-4 h-4" />
              3 entrevistas hoje
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              5 candidatos aguardam há +5 dias
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              1 proposta pendente de resposta
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
