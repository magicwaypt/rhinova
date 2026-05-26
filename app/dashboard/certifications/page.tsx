"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Award, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
  Building2,
  FileText,
  RefreshCw,
  Plus,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

import { certifications, departments, hrComplianceMetrics } from "@/lib/mock-data"

const statusConfig = {
  valid: {
    label: 'Valida',
    icon: CheckCircle2,
    className: 'bg-accent/15 text-accent border-accent/30'
  },
  expiring_soon: {
    label: 'A Expirar',
    icon: AlertTriangle,
    className: 'bg-warning/15 text-warning border-warning/30'
  },
  expired: {
    label: 'Expirada',
    icon: XCircle,
    className: 'bg-destructive/15 text-destructive border-destructive/30'
  }
}

const typeColors: Record<string, string> = {
  'Obrigatoria': 'bg-primary/15 text-primary border-primary/30',
  'Tecnica': 'bg-accent/15 text-accent border-accent/30',
  'Soft Skills': 'bg-violet-100 text-violet-700 border-violet-300',
}

export default function CertificationsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<'expiresAt' | 'issuedAt' | 'userName'>('expiresAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const stats = useMemo(() => {
    const valid = certifications.filter(c => c.status === 'valid').length
    const expiring = certifications.filter(c => c.status === 'expiring_soon').length
    const expired = certifications.filter(c => c.status === 'expired').length
    const total = certifications.length
    
    return { valid, expiring, expired, total }
  }, [])

  const filteredCertifications = useMemo(() => {
    return certifications
      .filter(cert => {
        const matchesSearch = 
          cert.userName.toLowerCase().includes(search.toLowerCase()) ||
          cert.trainingTitle.toLowerCase().includes(search.toLowerCase()) ||
          cert.certificateNumber.toLowerCase().includes(search.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || cert.status === statusFilter
        const matchesDepartment = departmentFilter === 'all' || cert.userDepartment === departmentFilter
        const matchesType = typeFilter === 'all' || cert.trainingType === typeFilter
        
        return matchesSearch && matchesStatus && matchesDepartment && matchesType
      })
      .sort((a, b) => {
        let comparison = 0
        
        if (sortBy === 'expiresAt') {
          comparison = (a.expiresAt?.getTime() || 0) - (b.expiresAt?.getTime() || 0)
        } else if (sortBy === 'issuedAt') {
          comparison = a.issuedAt.getTime() - b.issuedAt.getTime()
        } else if (sortBy === 'userName') {
          comparison = a.userName.localeCompare(b.userName)
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [search, statusFilter, departmentFilter, typeFilter, sortBy, sortOrder])

  const uniqueTypes = [...new Set(certifications.map(c => c.trainingType))]
  const uniqueDepartments = [...new Set(certifications.map(c => c.userDepartment))]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiresAt?: Date) => {
    if (!expiresAt) return null
    const today = new Date()
    const diffTime = expiresAt.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-7 h-7 text-primary" />
            Certificacoes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestao de certificados e validades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4" />
            Adicionar Certificado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Validas</p>
                <p className="text-2xl font-bold text-accent">{stats.valid}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
            </div>
            <Progress value={(stats.valid / stats.total) * 100} className="h-1 mt-3" />
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">A Expirar</p>
                <p className="text-2xl font-bold text-warning">{stats.expiring}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Proximos 30 dias</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiradas</p>
                <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Requerem renovacao</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              Todas
              <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="expiring" className="gap-2">
              A Expirar
              <Badge variant="secondary" className="ml-1 bg-warning/20 text-warning">{stats.expiring}</Badge>
            </TabsTrigger>
            <TabsTrigger value="expired" className="gap-2">
              Expiradas
              <Badge variant="secondary" className="ml-1 bg-destructive/20 text-destructive">{stats.expired}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar por nome, formacao ou numero..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="valid">Validas</SelectItem>
                <SelectItem value="expiring_soon">A Expirar</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 -ml-3 font-medium"
                        onClick={() => toggleSort('userName')}
                      >
                        Colaborador
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Formacao</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 -ml-3 font-medium"
                        onClick={() => toggleSort('issuedAt')}
                      >
                        Emissao
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 -ml-3 font-medium"
                        onClick={() => toggleSort('expiresAt')}
                      >
                        Validade
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertifications.map((cert) => {
                    const config = statusConfig[cert.status]
                    const StatusIcon = config.icon
                    const daysUntil = getDaysUntilExpiry(cert.expiresAt)
                    
                    return (
                      <TableRow key={cert.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {cert.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{cert.userName}</p>
                              <p className="text-xs text-muted-foreground">{cert.userDepartment}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{cert.trainingTitle}</p>
                            <p className="text-xs text-muted-foreground">{cert.certificateNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={typeColors[cert.trainingType] || ''}>
                            {cert.trainingType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(cert.issuedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {cert.expiresAt ? formatDate(cert.expiresAt) : 'Sem validade'}
                            {daysUntil !== null && daysUntil <= 30 && daysUntil > 0 && (
                              <p className="text-xs text-warning">{daysUntil} dias restantes</p>
                            )}
                            {daysUntil !== null && daysUntil <= 0 && (
                              <p className="text-xs text-destructive">Expirada ha {Math.abs(daysUntil)} dias</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="w-4 h-4" />
                                Ver Certificado
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2">
                                <Mail className="w-4 h-4" />
                                Enviar Lembrete
                              </DropdownMenuItem>
                              {cert.status !== 'valid' && (
                                <DropdownMenuItem className="gap-2 text-accent">
                                  <RefreshCw className="w-4 h-4" />
                                  Agendar Renovacao
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              {filteredCertifications.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma certificacao encontrada</p>
                  <p className="text-sm text-muted-foreground">Tenta ajustar os filtros de pesquisa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Certificacoes a Expirar (30 dias)
              </CardTitle>
              <CardDescription>
                Certificacoes que requerem renovacao em breve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications
                  .filter(c => c.status === 'expiring_soon')
                  .map(cert => {
                    const daysUntil = getDaysUntilExpiry(cert.expiresAt)
                    return (
                      <div key={cert.id} className="flex items-center justify-between p-4 rounded-lg border border-warning/30 bg-warning/5">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-warning/20 text-warning">
                              {cert.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{cert.userName}</p>
                            <p className="text-sm text-muted-foreground">{cert.trainingTitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-warning">{daysUntil} dias</p>
                            <p className="text-xs text-muted-foreground">ate expirar</p>
                          </div>
                          <Button size="sm" variant="outline" className="gap-2 border-warning/30 text-warning hover:bg-warning/10">
                            <RefreshCw className="w-4 h-4" />
                            Renovar
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Certificacoes Expiradas
              </CardTitle>
              <CardDescription>
                Certificacoes que necessitam renovacao imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications
                  .filter(c => c.status === 'expired')
                  .map(cert => {
                    const daysUntil = getDaysUntilExpiry(cert.expiresAt)
                    return (
                      <div key={cert.id} className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-destructive/20 text-destructive">
                              {cert.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{cert.userName}</p>
                            <p className="text-sm text-muted-foreground">{cert.trainingTitle}</p>
                            <Badge variant="outline" className="mt-1 text-xs bg-destructive/10 text-destructive border-destructive/30">
                              {cert.trainingType}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-destructive">
                              {daysUntil ? `Ha ${Math.abs(daysUntil)} dias` : 'Expirada'}
                            </p>
                            <p className="text-xs text-muted-foreground">{cert.userDepartment}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Mail className="w-4 h-4" />
                              Notificar
                            </Button>
                            <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                              <RefreshCw className="w-4 h-4" />
                              Agendar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
