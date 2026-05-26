"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Edit,
  UserPlus,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Link2,
  CheckCircle,
  Loader2
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { users, departments, hoursPerEmployee } from "@/lib/mock-data"

// Dados realisticos de compliance por colaborador
const employeeComplianceData: Record<string, {
  mandatoryCompleted: number
  mandatoryTotal: number
  expiringCerts: number
  expiredCerts: number
  hoursCompleted: number
  certifications: number
  riskReasons: string[]
}> = {
  '1': { mandatoryCompleted: 5, mandatoryTotal: 5, expiringCerts: 0, expiredCerts: 0, hoursCompleted: 42, certifications: 4, riskReasons: [] },
  '2': { mandatoryCompleted: 5, mandatoryTotal: 5, expiringCerts: 1, expiredCerts: 0, hoursCompleted: 38, certifications: 3, riskReasons: ['Certificacao Seguranca expira em 15 dias'] },
  '3': { mandatoryCompleted: 4, mandatoryTotal: 5, expiringCerts: 1, expiredCerts: 0, hoursCompleted: 32, certifications: 2, riskReasons: ['Formacao RGPD pendente', 'Certificacao RGPD expira em 10 dias'] },
  '4': { mandatoryCompleted: 5, mandatoryTotal: 5, expiringCerts: 0, expiredCerts: 0, hoursCompleted: 45, certifications: 5, riskReasons: [] },
  '5': { mandatoryCompleted: 3, mandatoryTotal: 5, expiringCerts: 0, expiredCerts: 1, hoursCompleted: 18, certifications: 2, riskReasons: ['2 formacoes obrigatorias pendentes', 'Certificacao Primeiros Socorros expirada', 'Abaixo do minimo de horas (18h/40h)'] },
  '6': { mandatoryCompleted: 5, mandatoryTotal: 5, expiringCerts: 0, expiredCerts: 0, hoursCompleted: 40, certifications: 3, riskReasons: [] },
  '7': { mandatoryCompleted: 5, mandatoryTotal: 5, expiringCerts: 2, expiredCerts: 0, hoursCompleted: 35, certifications: 4, riskReasons: ['2 certificacoes expiram em 25 dias'] },
  '8': { mandatoryCompleted: 4, mandatoryTotal: 5, expiringCerts: 0, expiredCerts: 0, hoursCompleted: 28, certifications: 2, riskReasons: ['Formacao Ciberseguranca pendente'] },
}

const employeesWithStats = users.map((user) => {
  const complianceData = employeeComplianceData[user.id] || {
    mandatoryCompleted: 5,
    mandatoryTotal: 5,
    expiringCerts: 0,
    expiredCerts: 0,
    hoursCompleted: 35,
    certifications: 3,
    riskReasons: []
  }
  
  const hoursTarget = 40
  const isAtRisk = 
    complianceData.mandatoryCompleted < complianceData.mandatoryTotal ||
    complianceData.expiredCerts > 0 ||
    complianceData.expiringCerts > 0 ||
    complianceData.hoursCompleted < hoursTarget * 0.5 // menos de 50% das horas
  
  return {
    ...user,
    trainingsCompleted: complianceData.mandatoryCompleted + Math.floor(Math.random() * 5),
    hoursCompleted: complianceData.hoursCompleted,
    hoursTarget,
    certifications: complianceData.certifications,
    expiringCerts: complianceData.expiringCerts,
    expiredCerts: complianceData.expiredCerts,
    mandatoryCompleted: complianceData.mandatoryCompleted,
    mandatoryTotal: complianceData.mandatoryTotal,
    riskReasons: complianceData.riskReasons,
    complianceStatus: isAtRisk ? 'at_risk' : 'compliant'
  }
})

// Sistemas de integracao disponiveis
const integrationSystems = [
  { id: 'sap', name: 'SAP SuccessFactors', icon: '🔷', status: 'connected', lastSync: '2025-04-02T09:30:00' },
  { id: 'workday', name: 'Workday', icon: '🟠', status: 'disconnected', lastSync: null },
  { id: 'adp', name: 'ADP', icon: '🔴', status: 'disconnected', lastSync: null },
  { id: 'primavera', name: 'Primavera', icon: '🟢', status: 'connected', lastSync: '2025-04-01T14:15:00' },
  { id: 'phc', name: 'PHC', icon: '🔵', status: 'disconnected', lastSync: null },
]

export default function EmployeesPage() {
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [syncDialogOpen, setSyncDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncingSystem, setSyncingSystem] = useState<string | null>(null)

  const handleSync = (systemId: string) => {
    setSyncingSystem(systemId)
    setIsSyncing(true)
    // Simular sincronizacao
    setTimeout(() => {
      setIsSyncing(false)
      setSyncingSystem(null)
    }, 2000)
  }

  const filteredEmployees = employeesWithStats.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    const matchesStatus = statusFilter === "all" || employee.complianceStatus === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground">
            Gerir colaboradores e acompanhar formacao
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sincronizar com Sistema */}
          <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Sincronizar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Sincronizar com Sistemas RH</DialogTitle>
                <DialogDescription>
                  Sincronize colaboradores automaticamente com os seus sistemas de gestao de RH.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {integrationSystems.map((system) => (
                  <div 
                    key={system.id}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      system.status === 'connected' ? 'bg-accent/5 border-accent/30' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{system.icon}</span>
                      <div>
                        <div className="font-medium">{system.name}</div>
                        {system.status === 'connected' ? (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-accent" />
                            Ultima sync: {new Date(system.lastSync!).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Nao configurado</div>
                        )}
                      </div>
                    </div>
                    {system.status === 'connected' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={isSyncing}
                        onClick={() => handleSync(system.id)}
                      >
                        {syncingSystem === system.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            A sincronizar...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Sincronizar
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-primary">
                        <Link2 className="w-3 h-3 mr-1" />
                        Configurar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSyncDialogOpen(false)}>
                  Fechar
                </Button>
                <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="w-4 h-4" />
                  Adicionar Integracao
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Importar Excel */}
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Importar Colaboradores</DialogTitle>
                <DialogDescription>
                  Importe uma lista de colaboradores a partir de um ficheiro Excel ou CSV.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {/* Drag & Drop Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">Arraste o ficheiro ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">
                    Suporta ficheiros .xlsx, .xls e .csv
                  </p>
                </div>

                {/* Template Download */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Template de Importacao</p>
                      <p className="text-xs text-muted-foreground">
                        Descarregue o template para garantir a formatacao correta
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Template
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Campos obrigatorios:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Nome completo</li>
                    <li>Email</li>
                    <li>Departamento</li>
                  </ul>
                  <p className="mt-2 font-medium text-foreground">Campos opcionais:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Numero de colaborador</li>
                    <li>Data de admissao</li>
                    <li>Funcao</li>
                    <li>Gestor direto</li>
                  </ul>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setImportDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="w-full sm:w-auto gap-2" disabled>
                  <Upload className="w-4 h-4" />
                  Importar Ficheiro
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Adicionar Colaborador */}
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Colaboradores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {employeesWithStats.filter(e => e.complianceStatus === 'compliant').length}
            </div>
            <div className="text-sm text-muted-foreground">Em Conformidade</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {employeesWithStats.filter(e => e.complianceStatus === 'at_risk').length}
            </div>
            <div className="text-sm text-muted-foreground">Em Risco</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {employeesWithStats.reduce((acc, e) => acc + e.expiringCerts, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Certs. a Expirar</div>
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
                placeholder="Pesquisar colaboradores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="compliant">Em Conformidade</SelectItem>
                <SelectItem value="at_risk">Em Risco</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Horas de Formacao</TableHead>
                <TableHead>Certificacoes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {employee.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[120px]">
                      <div className="flex items-center justify-between text-sm">
                        <span>{employee.hoursCompleted}h</span>
                        <span className="text-muted-foreground">/{employee.hoursTarget}h</span>
                      </div>
                      <Progress 
                        value={(employee.hoursCompleted / employee.hoursTarget) * 100} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span>{employee.certifications}</span>
                      {employee.expiringCerts > 0 && (
                        <Badge variant="outline" className="text-warning border-warning">
                          {employee.expiringCerts} a expirar
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {employee.complianceStatus === 'compliant' ? (
                      <Badge 
                        variant="default"
                        className="bg-accent/20 text-accent"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Conforme
                      </Badge>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="destructive" className="cursor-help">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Em Risco
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[280px]">
                            <p className="font-semibold mb-1">Razoes de risco:</p>
                            <ul className="text-xs space-y-1">
                              {employee.riskReasons.map((reason, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-destructive">•</span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                          Ver perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Historico de formacao
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Award className="w-4 h-4 mr-2" />
                          Certificacoes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
