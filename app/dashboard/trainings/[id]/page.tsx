"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ArrowLeft,
  Edit,
  MoreHorizontal,
  GraduationCap,
  Clock,
  Users,
  CalendarDays,
  MapPin,
  Video,
  Laptop,
  Mail,
  Phone,
  Download,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  FileText,
  Award,
  Building2,
  Trash2,
  Copy,
  Send
} from "lucide-react"
import { trainings, trainingParticipants } from "@/lib/mock-data"

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

const participantStatusColors = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  absent: "bg-red-100 text-red-700",
  completed: "bg-primary/20 text-primary"
}

const participantStatusLabels = {
  confirmed: "Confirmado",
  pending: "Pendente",
  absent: "Ausente",
  completed: "Concluido"
}

const participantStatusIcons = {
  confirmed: CheckCircle2,
  pending: AlertCircle,
  absent: XCircle,
  completed: Award
}

export default function TrainingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  const training = trainings.find(t => t.id === resolvedParams.id)
  const participants = trainingParticipants[resolvedParams.id] || []
  
  if (!training) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Formacao nao encontrada</h2>
        <p className="text-muted-foreground mb-4">A formacao que procura nao existe.</p>
        <Button asChild>
          <Link href="/dashboard/trainings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar a lista
          </Link>
        </Button>
      </div>
    )
  }

  const FormatIcon = formatIcons[training.format]
  
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const confirmedCount = participants.filter(p => p.status === 'confirmed' || p.status === 'completed').length
  const pendingCount = participants.filter(p => p.status === 'pending').length
  const absentCount = participants.filter(p => p.status === 'absent').length
  const completedCount = participants.filter(p => p.status === 'completed').length
  const averageScore = participants.filter(p => p.score).reduce((acc, p) => acc + (p.score || 0), 0) / (completedCount || 1)

  return (
    <div className="space-y-6">
      {/* Back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/trainings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar a lista
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Exportar Lista
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="w-4 h-4 mr-2" />
                Enviar Convites
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Training header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusColors[training.status]}>
                  {statusLabels[training.status]}
                </Badge>
                {training.mandatory && (
                  <Badge variant="destructive">Obrigatoria</Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <FormatIcon className="w-3 h-3" />
                  {formatLabels[training.format]}
                </Badge>
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{training.title}</h1>
                <p className="text-muted-foreground mt-2">{training.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {training.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="lg:w-80 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Data</div>
                    <div className="font-medium">
                      {new Date(training.startDate).toLocaleDateString('pt-PT', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Duracao</div>
                    <div className="font-medium">{training.duration} horas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Participantes</div>
                    <div className="font-medium">{participants.length}/{training.maxParticipants}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Formador</div>
                    <div className="font-medium truncate">{training.instructor}</div>
                  </div>
                </div>
              </div>

              {training.location && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Local</div>
                    <div className="font-medium">{training.location}</div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ocupacao</span>
                  <span className="font-medium">{Math.round((participants.length / training.maxParticipants) * 100)}%</span>
                </div>
                <Progress value={(participants.length / training.maxParticipants) * 100} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{confirmedCount}</div>
                <div className="text-sm text-muted-foreground">Confirmados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{absentCount}</div>
                <div className="text-sm text-muted-foreground">Ausentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {training.status === 'completed' ? `${averageScore.toFixed(0)}%` : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Media Notas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for participants */}
      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants" className="gap-2">
            <Users className="w-4 h-4" />
            Formandos
            <Badge variant="secondary" className="ml-1">{participants.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <FileText className="w-4 h-4" />
            Materiais
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2">
            <Award className="w-4 h-4" />
            Certificados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4">
          {/* Filters and actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar formandos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={statusFilter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={statusFilter === "confirmed" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("confirmed")}
                  >
                    Confirmados
                  </Button>
                  <Button 
                    variant={statusFilter === "pending" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pendentes
                  </Button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Formando</DialogTitle>
                      <DialogDescription>
                        Adicione colaboradores a esta formacao.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input placeholder="Pesquisar colaborador..." />
                      <p className="text-sm text-muted-foreground mt-4">
                        Funcionalidade disponivel com integracao de base de dados.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Participants table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Formando</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Estado</TableHead>
                    {training.status === 'completed' && (
                      <>
                        <TableHead>Nota</TableHead>
                        <TableHead>Certificado</TableHead>
                      </>
                    )}
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={training.status === 'completed' ? 6 : 4} className="text-center py-8">
                        <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Nenhum formando encontrado</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParticipants.map((participant) => {
                      const StatusIcon = participantStatusIcons[participant.status]
                      return (
                        <TableRow key={participant.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{participant.name}</div>
                                <div className="text-sm text-muted-foreground">{participant.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              {participant.department}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={participantStatusColors[participant.status]}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {participantStatusLabels[participant.status]}
                            </Badge>
                          </TableCell>
                          {training.status === 'completed' && (
                            <>
                              <TableCell>
                                {participant.score ? (
                                  <span className={`font-medium ${participant.score >= 80 ? 'text-green-600' : participant.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {participant.score}%
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {participant.certificateId ? (
                                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                                    <Download className="w-3 h-3" />
                                    {participant.certificateId}
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Enviar email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Marcar como presente
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materiais de Formacao</CardTitle>
              <CardDescription>
                Documentos e recursos disponibilizados para esta formacao.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Sem materiais</h3>
                <p className="text-muted-foreground mb-4">
                  Ainda nao foram adicionados materiais a esta formacao.
                </p>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Adicionar Material
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificados Emitidos</CardTitle>
              <CardDescription>
                Certificados gerados apos conclusao da formacao.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {training.status === 'completed' && completedCount > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formando</TableHead>
                      <TableHead>Numero</TableHead>
                      <TableHead>Data Emissao</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.filter(p => p.certificateId).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.certificateId}</TableCell>
                        <TableCell>
                          {p.signedAt ? new Date(p.signedAt).toLocaleDateString('pt-PT') : '-'}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">{p.score}%</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem certificados</h3>
                  <p className="text-muted-foreground">
                    Os certificados serao gerados apos a conclusao da formacao.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
