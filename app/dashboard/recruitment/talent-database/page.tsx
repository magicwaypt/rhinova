"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Database, 
  Search, 
  Plus, 
  Filter,
  Users,
  FolderOpen,
  Settings,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
  Mail,
  Clock,
  TrendingUp,
  Star,
  MapPin,
  Briefcase,
  Zap
} from "lucide-react"
import { talentPools, candidateProfiles } from "@/lib/recruitment-data"

const databaseStats = {
  totalCandidates: 1245,
  newThisMonth: 89,
  activeInProcess: 38,
  talentPoolSize: 987,
  avgCompleteness: 78,
  uniqueSkills: 156,
  totalInteractions: 3420,
  avgResponseRate: 42,
}

const recentActivity = [
  { type: "added", candidate: "Bruno Costa", source: "Executive Search", time: "há 2h" },
  { type: "updated", candidate: "Ricardo Neves", action: "CV atualizado", time: "há 4h" },
  { type: "interaction", candidate: "Carla Mendes", action: "Email respondido", time: "há 6h" },
  { type: "added", candidate: "João Almeida", source: "LinkedIn", time: "ontem" },
  { type: "score", candidate: "Ana Ferreira", action: "Score AI atualizado: 85%", time: "ontem" },
]

export default function TalentDatabasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPool, setSelectedPool] = useState<string | null>(null)

  const filteredCandidates = candidateProfiles.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-7 h-7 text-primary" />
            Talent Intelligence Database
          </h1>
          <p className="text-muted-foreground">Base proprietária de conhecimento e talento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Candidato
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidatos</p>
                <p className="text-2xl font-bold text-foreground">{databaseStats.totalCandidates.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{databaseStats.newThisMonth} este mês</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Processo</p>
                <p className="text-2xl font-bold text-foreground">{databaseStats.activeInProcess}</p>
                <p className="text-xs text-muted-foreground">candidatos ativos</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completude Média</p>
                <p className="text-2xl font-bold text-foreground">{databaseStats.avgCompleteness}%</p>
                <Progress value={databaseStats.avgCompleteness} className="h-1 mt-2 w-20" />
              </div>
              <Database className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                <p className="text-2xl font-bold text-foreground">{databaseStats.avgResponseRate}%</p>
                <p className="text-xs text-muted-foreground">média outreach</p>
              </div>
              <Mail className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">Todos os Candidatos</TabsTrigger>
            <TabsTrigger value="pools">Talent Pools</TabsTrigger>
            <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar candidatos, skills..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* All Candidates Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <Card className="border-border/50 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="new">Novos</SelectItem>
                      <SelectItem value="in_process">Em Processo</SelectItem>
                      <SelectItem value="talent_pool">Talent Pool</SelectItem>
                      <SelectItem value="hired">Contratados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fonte</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="referral">Referência</SelectItem>
                      <SelectItem value="executive_search">Executive Search</SelectItem>
                      <SelectItem value="ai_sourcing">AI Sourcing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Localização</label>
                  <Input placeholder="Ex: Lisboa, Porto" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experiência</label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" className="w-20" />
                    <span className="flex items-center text-muted-foreground">-</span>
                    <Input placeholder="Max" type="number" className="w-20" />
                    <span className="flex items-center text-muted-foreground text-sm">anos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Score Mínimo</label>
                  <Input placeholder="Ex: 80" type="number" />
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>

            {/* Candidates List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredCandidates.length} de {databaseStats.totalCandidates} candidatos
                </p>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="score">AI Score</SelectItem>
                    <SelectItem value="name">Nome</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredCandidates.map((candidate) => (
                  <Card key={candidate.id} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold truncate">{candidate.name}</h4>
                            {candidate.starred && (
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                            )}
                            <Badge variant="outline" className="text-xs shrink-0">
                              {candidate.source === 'linkedin' ? 'LinkedIn' :
                               candidate.source === 'referral' ? 'Referência' :
                               candidate.source === 'executive_search' ? 'Executive Search' :
                               candidate.source}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {candidate.currentRole} @ {candidate.currentCompany}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {candidate.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {candidate.yearsExperience} anos
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Atualizado {new Date(candidate.updatedAt).toLocaleDateString('pt-PT')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Sparkles className="w-4 h-4 text-primary" />
                              <span className="text-xl font-bold text-primary">{candidate.aiScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">AI Score</p>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Perfil Completo
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FolderOpen className="w-4 h-4 mr-2" />
                                  Adicionar a Pool
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Re-analisar com AI
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      {/* Skills Preview */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pl-16">
                        {candidate.skills.slice(0, 5).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {candidate.skills.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{candidate.skills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Talent Pools Tab */}
        <TabsContent value="pools" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Talent Pools ({talentPools.length})</h3>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Pool
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {talentPools.map((pool) => (
              <Card key={pool.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {pool.name}
                        {pool.isSmartPool && (
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Smart
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {pool.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Candidatos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Pool
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar Critérios
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">{pool.candidateIds.length}</span>
                      <span className="text-sm text-muted-foreground">candidatos</span>
                    </div>
                    {pool.autoUpdate && (
                      <Badge variant="secondary" className="text-xs">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Auto-update
                      </Badge>
                    )}
                  </div>

                  {/* Criteria Preview */}
                  <div className="space-y-2">
                    {pool.criteria.skills && pool.criteria.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground mr-1">Skills:</span>
                        {pool.criteria.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    )}
                    {pool.criteria.seniorityLevels && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground mr-1">Senioridade:</span>
                        {pool.criteria.seniorityLevels.map((level, i) => (
                          <Badge key={i} variant="outline" className="text-xs capitalize">{level}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="w-4 h-4" />
                      Ver Pool
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Mail className="w-4 h-4" />
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Pool Card */}
            <Card className="border-border/50 border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">Criar Novo Pool</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Organize candidatos por critérios específicos
                </p>
                <Button variant="outline" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Criar Smart Pool
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente na Base de Dados</CardTitle>
              <CardDescription>
                Últimas alterações e interações com candidatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === 'added' ? 'bg-green-100 text-green-600' :
                      activity.type === 'updated' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'interaction' ? 'bg-purple-100 text-purple-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {activity.type === 'added' && <Plus className="w-5 h-5" />}
                      {activity.type === 'updated' && <RefreshCw className="w-5 h-5" />}
                      {activity.type === 'interaction' && <Mail className="w-5 h-5" />}
                      {activity.type === 'score' && <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.candidate}</span>
                        {activity.type === 'added' && (
                          <span className="text-muted-foreground"> foi adicionado via {activity.source}</span>
                        )}
                        {activity.type === 'updated' && (
                          <span className="text-muted-foreground"> - {activity.action}</span>
                        )}
                        {activity.type === 'interaction' && (
                          <span className="text-muted-foreground"> - {activity.action}</span>
                        )}
                        {activity.type === 'score' && (
                          <span className="text-muted-foreground"> - {activity.action}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
