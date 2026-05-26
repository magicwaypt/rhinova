"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  GraduationCap,
  Clock,
  Users,
  CalendarDays,
  MapPin,
  Video,
  Laptop,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download
} from "lucide-react"
import { trainings } from "@/lib/mock-data"
import type { Training } from "@/lib/types"

const statusColors = {
  scheduled: "bg-primary/20 text-primary",
  in_progress: "bg-accent/20 text-accent",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/20 text-destructive"
}

const statusLabels = {
  scheduled: "Agendada",
  in_progress: "Em Curso",
  completed: "Concluida",
  cancelled: "Cancelada"
}

const formatIcons = {
  presencial: MapPin,
  online: Video,
  hibrido: Laptop
}

const formatLabels = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Hibrido"
}

export default function TrainingsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formatFilter, setFormatFilter] = useState<string>("all")

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(search.toLowerCase()) ||
      training.instructor.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || training.status === statusFilter
    const matchesFormat = formatFilter === "all" || training.format === formatFilter
    return matchesSearch && matchesStatus && matchesFormat
  })

  const activeTrainings = filteredTrainings.filter(t => t.status === "scheduled" || t.status === "in_progress")
  const completedTrainings = filteredTrainings.filter(t => t.status === "completed")

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Formacoes</h1>
          <p className="text-muted-foreground">
            Gerir todas as formacoes da sua organizacao
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/trainings/new">
            <Plus className="w-4 h-4 mr-2" />
            Nova Formacao
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{trainings.length}</div>
            <div className="text-sm text-muted-foreground">Total de Formacoes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {trainings.filter(t => t.status === "scheduled").length}
            </div>
            <div className="text-sm text-muted-foreground">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {trainings.filter(t => t.status === "in_progress").length}
            </div>
            <div className="text-sm text-muted-foreground">Em Curso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {trainings.reduce((acc, t) => acc + t.currentParticipants, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Participantes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar formacoes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="scheduled">Agendadas</SelectItem>
                <SelectItem value="in_progress">Em Curso</SelectItem>
                <SelectItem value="completed">Concluidas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os formatos</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hibrido">Hibrido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trainings tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            Ativas
            <Badge variant="secondary" className="ml-1">{activeTrainings.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Concluidas
            <Badge variant="secondary" className="ml-1">{completedTrainings.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all">
            Todas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <TrainingGrid trainings={activeTrainings} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <TrainingGrid trainings={completedTrainings} />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <TrainingTable trainings={filteredTrainings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TrainingGrid({ trainings }: { trainings: Training[] }) {
  if (trainings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma formacao encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Nao ha formacoes que correspondam aos filtros selecionados.
          </p>
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Plus className="w-4 h-4 mr-2" />
              Criar Formacao
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainings.map((training) => {
        const FormatIcon = formatIcons[training.format]
        return (
          <Card key={training.id} className="group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge className={statusColors[training.status]}>
                  {statusLabels[training.status]}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg mt-2">{training.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {training.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {training.mandatory && (
                  <Badge variant="destructive" className="text-xs">Obrigatoria</Badge>
                )}
                <Badge variant="outline" className="text-xs gap-1">
                  <FormatIcon className="w-3 h-3" />
                  {formatLabels[training.format]}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {new Date(training.startDate).toLocaleDateString('pt-PT', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{training.duration}h</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{training.currentParticipants}/{training.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span className="truncate">{training.instructor}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/trainings/${training.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function TrainingTable({ trainings }: { trainings: Training[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Formacao</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Duracao</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => {
              const FormatIcon = formatIcons[training.format]
              return (
                <TableRow key={training.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {training.title}
                        {training.mandatory && (
                          <Badge variant="destructive" className="text-xs">Obrig.</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {training.instructor}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FormatIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{formatLabels[training.format]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(training.startDate).toLocaleDateString('pt-PT', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{training.duration}h</TableCell>
                  <TableCell>
                    {training.currentParticipants}/{training.maxParticipants}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[training.status]}>
                      {statusLabels[training.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
