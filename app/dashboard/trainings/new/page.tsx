"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  ArrowLeft, 
  CalendarDays, 
  Upload,
  X,
  Sparkles,
  Users,
  Building2,
  UserPlus,
  Search,
  CheckCircle2
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { users, departments } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { toast } from "sonner"

const skillSuggestions = [
  "Seguranca", "Compliance", "RGPD", "Lideranca", "Comunicacao",
  "Excel", "Agile", "Scrum", "Gestao de Projetos", "Vendas",
  "Marketing Digital", "Python", "SQL", "Power BI", "Negociacao"
]

export default function NewTrainingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    format: "",
    instructor: "",
    duration: "",
    maxParticipants: "",
    location: "",
    mandatory: false
  })

  // Participant selection
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [userSearch, setUserSearch] = useState("")

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    )
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const selectAllInDepartment = (dept: string) => {
    const deptUsers = users.filter(u => u.department === dept).map(u => u.id)
    const allSelected = deptUsers.every(id => selectedUsers.includes(id))
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !deptUsers.includes(id)))
    } else {
      setSelectedUsers(prev => [...new Set([...prev, ...deptUsers])])
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearch.toLowerCase())
  )

  const totalSelectedParticipants = selectedUsers.length + 
    users.filter(u => selectedDepartments.includes(u.department) && !selectedUsers.includes(u.id)).length

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success("Formacao criada com sucesso!", {
      description: "A formacao foi adicionada ao sistema."
    })

    router.push("/dashboard/trainings")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/trainings">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nova Formacao</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar uma nova formacao
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle>Informacao Basica</CardTitle>
            <CardDescription>Detalhes principais da formacao</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo da Formacao *</Label>
              <Input
                id="title"
                placeholder="Ex: Seguranca no Trabalho"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descricao</Label>
              <Textarea
                id="description"
                placeholder="Descreva os objetivos e conteudos da formacao..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Interna</SelectItem>
                    <SelectItem value="external">Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato *</Label>
                <Select 
                  value={formData.format} 
                  onValueChange={(value) => handleChange("format", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hibrido">Hibrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
              <div>
                <Label htmlFor="mandatory" className="font-medium">Formacao Obrigatoria</Label>
                <p className="text-sm text-muted-foreground">
                  Marque se esta formacao for obrigatoria para compliance
                </p>
              </div>
              <Switch
                id="mandatory"
                checked={formData.mandatory}
                onCheckedChange={(checked) => handleChange("mandatory", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamento</CardTitle>
            <CardDescription>Datas, duracao e local</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Inicio *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: pt }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: pt }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duracao (horas) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="Ex: 8"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max. Participantes *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  placeholder="Ex: 25"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange("maxParticipants", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Local / Link</Label>
              <Input
                id="location"
                placeholder="Ex: Sala de Formacao A ou link do Zoom"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructor */}
        <Card>
          <CardHeader>
            <CardTitle>Formador</CardTitle>
            <CardDescription>Quem ministra a formacao</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="instructor">Formador *</Label>
              <Input
                id="instructor"
                placeholder="Nome do formador ou entidade"
                value={formData.instructor}
                onChange={(e) => handleChange("instructor", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Participants Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participantes
                </CardTitle>
                <CardDescription>Selecione departamentos ou colaboradores individuais</CardDescription>
              </div>
              {totalSelectedParticipants > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {totalSelectedParticipants} selecionados
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="departments" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="departments" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Departamentos
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Colaboradores
                </TabsTrigger>
              </TabsList>

              <TabsContent value="departments" className="mt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {departments.map((dept) => {
                    const deptUserCount = users.filter(u => u.department === dept.name).length;
                    const isSelected = selectedDepartments.includes(dept.name);
                    return (
                      <div
                        key={dept.id}
                        onClick={() => toggleDepartment(dept.name)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={isSelected} 
                              onCheckedChange={() => toggleDepartment(dept.name)}
                            />
                            <div>
                              <p className="font-medium">{dept.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {deptUserCount} colaboradores
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {selectedDepartments.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm">
                      <span className="font-medium">Departamentos selecionados:</span>{" "}
                      {selectedDepartments.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Todos os colaboradores destes departamentos serao automaticamente inscritos.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users" className="mt-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome, email ou departamento..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Quick select by department */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Selecao rapida:</span>
                  {departments.map(dept => (
                    <Badge 
                      key={dept.id}
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => selectAllInDepartment(dept.name)}
                    >
                      {dept.name}
                    </Badge>
                  ))}
                </div>

                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedUsers.includes(user.id)
                      const isDeptSelected = selectedDepartments.includes(user.department)
                      return (
                        <div
                          key={user.id}
                          onClick={() => !isDeptSelected && toggleUser(user.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected || isDeptSelected
                              ? 'border-primary/50 bg-primary/5' 
                              : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                          } ${isDeptSelected ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={isSelected || isDeptSelected} 
                              disabled={isDeptSelected}
                              onCheckedChange={() => !isDeptSelected && toggleUser(user.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{user.name}</p>
                                {isDeptSelected && (
                                  <Badge variant="secondary" className="text-xs">
                                    via {user.department}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email} · {user.department}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum colaborador encontrado.
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {selectedUsers.length > 0 && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm">
                      <span className="font-medium">{selectedUsers.length} colaboradores</span> selecionados individualmente
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Competencias
              <Badge variant="outline" className="gap-1">
                <Sparkles className="w-3 h-3" />
                IA
              </Badge>
            </CardTitle>
            <CardDescription>
              Adicione as competencias desenvolvidas nesta formacao
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Adicionar competencia..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill(newSkill)
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => addSkill(newSkill)}
              >
                Adicionar
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Sugestoes:</p>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions
                  .filter(s => !selectedSkills.includes(s))
                  .slice(0, 8)
                  .map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Materiais</CardTitle>
            <CardDescription>Anexe documentos de apoio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">
                Arraste ficheiros ou clique para fazer upload
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PPT, DOC ate 10MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/trainings">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "A criar..." : "Criar Formacao"}
          </Button>
        </div>
      </form>
    </div>
  )
}
